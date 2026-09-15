-- Tabla de inscripciones — Semillero Rivera
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

create table if not exists public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre_nino text not null,
  fecha_nacimiento date not null,
  nombre_acudiente text not null,
  telefono text not null,
  email text,
  nivel_interes text not null default 'Nivel 1 - Iniciación (4-5 años)',
  estado text not null default 'pendiente' -- pendiente | contactado | confirmado | rechazado
);

-- Seguridad: por defecto Supabase bloquea todo acceso a una tabla nueva.
-- Activamos Row Level Security y agregamos SOLO el permiso necesario:
-- que cualquier visitante del sitio pueda INSERTAR una inscripción,
-- pero nadie pueda leer, editar ni borrar inscripciones ajenas desde el navegador.
alter table public.inscripciones enable row level security;

create policy "Cualquiera puede inscribirse"
  on public.inscripciones
  for insert
  to anon
  with check (true);

-- Nota: para que tú (administrador) puedas VER las inscripciones,
-- entra directamente a Supabase -> Table Editor -> inscripciones.
-- Ese acceso usa tu sesión de administrador, no la llave pública del sitio,
-- así que no necesita una política adicional por ahora.
