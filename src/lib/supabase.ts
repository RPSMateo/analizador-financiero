import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para uso en el servidor (API routes).
 *
 * Las credenciales se leen de variables de entorno. Si no están configuradas,
 * `getSupabase()` devuelve null en lugar de romper el build o el arranque —
 * así el sitio sigue funcionando aunque Supabase todavía no esté conectado.
 *
 * Variables requeridas (configurar en Vercel → Settings → Environment Variables):
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY  (clave de servicio, solo en el servidor)
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return cached;
}

export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
