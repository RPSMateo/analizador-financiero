# Conectar Supabase (lista de espera)

Esta guía conecta la base de datos donde se guardan los emails de la lista de
espera. Es un paso de una sola vez, ~10 minutos. **Mientras tanto el sitio ya
funciona**: si Supabase no está conectado, el formulario igual responde "ok" y
los emails quedan en los logs del servidor (sin perderse), pero conviene
conectarlo para tenerlos en una tabla consultable.

---

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y registrate (podés usar GitHub).
2. "New Project" → ponele un nombre (ej. `retirolibre`).
3. Elegí una contraseña para la base de datos y la región más cercana
   (South America - São Paulo).
4. Esperá ~2 minutos a que se cree.

## 2. Crear la tabla `waitlist`

En el panel de Supabase, andá a **SQL Editor** → **New query**, pegá esto y
dale **Run**:

```sql
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  situacion text,
  plan text,
  origen text,
  created_at timestamptz not null default now()
);

-- Habilitamos Row Level Security pero no creamos políticas públicas:
-- solo la service role key (que usa el servidor) puede leer/escribir.
alter table waitlist enable row level security;
```

## 3. Copiar las credenciales

En Supabase, andá a **Project Settings** (el engranaje) → **API**:

- **Project URL** → es tu `NEXT_PUBLIC_SUPABASE_URL`
- En **Project API keys**, copiá la clave **`service_role`** (la secreta, NO la
  `anon`) → es tu `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ La `service_role` es secreta y tiene acceso total. Solo se usa en el
> servidor (nuestras API routes). Nunca la pongas en código del cliente.

## 4. Cargar las variables en Vercel

1. En [vercel.com](https://vercel.com), entrá a tu proyecto `retirolibre`.
2. **Settings** → **Environment Variables**.
3. Agregá estas dos (marcá los tres entornos: Production, Preview, Development):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (tu Project URL) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (tu service_role key) |

4. **Redeploy**: andá a la pestaña **Deployments** → en el último deploy, los
   tres puntitos → **Redeploy**. (Las env vars nuevas solo aplican tras un
   redeploy.)

## 5. Probar

1. Entrá a tu sitio, cargá un email en la lista de espera y enviá.
2. En Supabase → **Table Editor** → `waitlist`: deberías ver el registro.

¡Listo! Cada email que captures queda guardado con su origen y situación laboral.

---

## Para desarrollo local (opcional)

Si querés correr el proyecto en tu compu con Supabase conectado, creá un archivo
`.env.local` en la raíz (ya está en `.gitignore`, no se sube):

```
NEXT_PUBLIC_SUPABASE_URL=tu-project-url
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```
