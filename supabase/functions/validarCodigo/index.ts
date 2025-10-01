// supabase/functions/validarCodigo/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

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

async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const r = await fetch(
      `${PROJECT_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
        },
      },
    );
    if (r.ok) {
      const data = await r.json();
      const user = Array.isArray(data?.users)
        ? data.users[0]
        : data?.[0] || data?.user;
      if (user?.id) return user.id as string;
    }
  } catch (err) {
    console.error("Erro getUserIdByEmail:", err);
  }
  return null;
}

serve(async (req) => {
  const corsRes = cors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { email, codigo, novaSenha } = await req.json();
    if (!email || !codigo || !novaSenha) {
      return json({ error: "Dados incompletos" }, 400);
    }

    // busca o último código válido
    const { data, error } = await supabase
      .from("reset_codes")
      .select("*")
      .eq("email", email)
      .eq("codigo", codigo)
      .eq("usado", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Erro ao buscar código:", error);
      return json({ error: "Erro ao buscar código", details: error }, 400);
    }

    if (!data || data.length === 0) {
      return json({ error: "Código inválido" }, 400);
    }

    const registro = data[0];

    // verifica expiração (10 min)
    const expirado =
      new Date().getTime() - new Date(registro.created_at).getTime() >
      10 * 60 * 1000;
    if (expirado) {
      await supabase.from("reset_codes").update({ usado: true }).eq("id", registro.id);
      return json({ error: "Código expirado" }, 400);
    }

    // pega o id do usuário
    const userId = await getUserIdByEmail(email);
    if (!userId) return json({ error: "Usuário não encontrado" }, 404);

    // atualiza a senha
    const { error: upErr } = await supabase.auth.admin.updateUserById(userId, {
      password: novaSenha,
    });
    if (upErr) {
      console.error("Erro ao atualizar senha:", upErr);
      return json({ error: upErr.message }, 400);
    }

    // marca código como usado
    await supabase.from("reset_codes").update({ usado: true }).eq("id", registro.id);

    return json({ message: "Senha redefinida com sucesso" });
  } catch (err: any) {
    console.error("Erro inesperado:", err);
    return json({ error: err?.message || "Erro inesperado" }, 500);
  }
});
