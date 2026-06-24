import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/waitlist
 *
 * Recibe el email de un interesado y lo guarda en la tabla `waitlist` de Supabase.
 * Campos opcionales de metadata (situación laboral, plan de interés, origen) sirven
 * para validar qué perfil de usuario muestra interés.
 *
 * Body esperado (JSON):
 *   { email: string, situacion?: string, plan?: string, origen?: string }
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { email, situacion, plan, origen } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Ingresá un email válido" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Supabase todavía no está configurado: no perdemos el lead, lo registramos
    // en los logs del servidor y respondemos OK para no frenar la validación.
    console.warn("[waitlist] Supabase no configurado. Lead recibido:", email);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("waitlist").insert({
    email: email.trim().toLowerCase(),
    situacion: typeof situacion === "string" ? situacion : null,
    plan: typeof plan === "string" ? plan : null,
    origen: typeof origen === "string" ? origen : null,
  });

  if (error) {
    // Código 23505 = violación de unique constraint (email ya registrado).
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }
    console.error("[waitlist] Error al insertar:", error);
    return NextResponse.json(
      { error: "No pudimos guardar tu email. Probá de nuevo en un momento." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
