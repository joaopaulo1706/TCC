// supabase/functions/enviarCodigo/index.ts
import { serve } from "server";
import { createClient } from "@supabase/supabase-js";


const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "no-reply@brevo.com";

const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function cors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  return null;
}

serve(async (req: Request) => {
  const corsRes = cors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email) {
      return json({ error: "E-mail é obrigatório", body }, 400);
    }

    // ✅ normaliza o e-mail
    const email = String(body.email).trim().toLowerCase();
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ invalida códigos antigos do mesmo e-mail antes de criar um novo
    await supabase.from("reset_codes").update({ usado: true }).eq("email", email);

    // ✅ insere novo código
    const { error: insertError } = await supabase
      .from("reset_codes")
      .insert({ email, codigo });

    if (insertError) {
      return json({ error: "Erro ao salvar no banco", details: insertError }, 400);
    }

    // ✅ envia com Brevo
    if (BREVO_API_KEY) {
      const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { email: FROM_EMAIL, name: "Suporte" },
          to: [{ email }],
          subject: "Código para redefinir sua senha",
          textContent: `Seu código é: ${codigo}\nEle expira em 10 minutos.`,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        return json({ error: "Falha ao enviar e-mail", details: txt }, 400);
      }

      return json({ message: "Código enviado com sucesso" });
    }

    // fallback: modo teste
    return json({ message: "Código gerado (modo teste)", codigo });
  } catch (err: unknown) {
    return json(
      {
        error: err instanceof Error ? err.message : "Erro inesperado",
        stack: err instanceof Error ? err.stack : err,
      },
      500,
    );
  }
});
