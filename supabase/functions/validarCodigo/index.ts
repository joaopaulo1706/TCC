import { serve } from "server";
import { createClient } from "@supabase/supabase-js";

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

serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const codigo = String(body?.codigo ?? "").trim();
    const novaSenha = String(body?.novaSenha ?? "");

    if (!email || !codigo || !novaSenha) {
      return json({ error: "Dados incompletos" }, 400);
    }

    // busca código exato e não usado
    const { data, error } = await supabase
      .from("reset_codes")
      .select("*")
      .eq("email", email)
      .eq("codigo", codigo)
      .eq("usado", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error("❌ Código não encontrado:", { email, codigo, error });
      return json({ error: "Código inválido" }, 400);
    }

    // expiração 10min
    const createdMs = new Date(data.created_at).getTime();
    if (Date.now() - createdMs > 10 * 60 * 1000) {
      await supabase.from("reset_codes").update({ usado: true }).eq("id", data.id);
      return json({ error: "Código expirado" }, 400);
    }

    // busca usuário no Auth
    const r = await fetch(
      `${PROJECT_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
        },
      },
    );

    if (!r.ok) {
      const errTxt = await r.text();
      console.error("❌ Erro buscando usuário:", errTxt);
      return json({ error: "Falha ao buscar usuário", details: errTxt }, 400);
    }

    const usersJson = await r.json();

    // filtra exatamente pelo e-mail
    const user =
      Array.isArray(usersJson?.users)
        ? usersJson.users.find((u: any) => (u.email || "").toLowerCase() === email)
        : Array.isArray(usersJson)
        ? usersJson.find((u: any) => (u.email || "").toLowerCase() === email)
        : usersJson?.user?.email?.toLowerCase() === email
        ? usersJson.user
        : null;

    if (!user || !user.id) {
      console.error("❌ Nenhum usuário encontrado para:", email);
      return json({ error: "Usuário não encontrado" }, 404);
    }

    console.log("✅ Usuário encontrado:", { id: user.id, email: user.email });

    // atualiza senha
    const { error: upErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: novaSenha,
    });

    if (upErr) {
      console.error("❌ Erro updateUserById:", upErr);
      return json({ error: upErr.message }, 400);
    }

    console.log("✅ Senha atualizada com sucesso para:", email);

    // marca código como usado
    await supabase.from("reset_codes").update({ usado: true }).eq("id", data.id);

    return json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error("❌ Erro inesperado:", err);
    return json(
      { error: err instanceof Error ? err.message : "Erro inesperado" },
      500,
    );
  }
});
