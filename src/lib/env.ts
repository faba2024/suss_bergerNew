/**
 * URL base do projeto Supabase: SEMPRE só a origem (https://<ref>.supabase.co).
 * Corrige valores colados errado na Vercel/.env (ex.: ".../rest/v1/", ".../auth/v1",
 * barra no final, espaços ou aspas) — o supabase-js monta /auth/v1 e /rest/v1 sozinho;
 * com o caminho duplicado o Supabase responde "Invalid path specified in request URL".
 */
export function normalizeSupabaseUrl(raw: string | undefined | null): string {
  const v = (raw ?? "").trim().replace(/^['"]|['"]$/g, "").trim();
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return u.origin;
  } catch {
    return "";
  }
}

/** Chave pública sem espaços/aspas acidentais. */
export function cleanKey(raw: string | undefined | null): string {
  return (raw ?? "").trim().replace(/^['"]|['"]$/g, "").trim();
}

export const env = {
  supabaseUrl: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: cleanKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  rootDomain: (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").toLowerCase(),
};

export function assertSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local (veja SETUP.md).",
    );
  }
}

/** URL pública da loja (subdomínio quando configurado, senão /slug). */
export function storeUrl(slug: string, path = "") {
  if (env.rootDomain) {
    const protocol = env.appUrl.startsWith("https") ? "https" : "http";
    return `${protocol}://${slug}.${env.rootDomain}${path}`;
  }
  return `${env.appUrl}/${slug}${path}`;
}
