-- Tabla del horario de clases, para la página pública /horario y el feed
-- de calendario (.ics) que se puede sincronizar con Google Calendar u Outlook.
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

create table if not exists public.horario_clases (
  id uuid primary key default gen_random_uuid(),
  nivel text not null,
  dia_semana text not null check (
    dia_semana in ('lunes','martes','miercoles','jueves','viernes','sabado','domingo')
  ),
  hora_inicio time not null,
  hora_fin time not null,
  ubicacion text,
  notas text,
  alternativo boolean not null default false,
  activo boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.horario_clases enable row level security;

-- Cualquier visitante (con o sin sesión) puede ver las clases activas.
-- Nadie puede insertar, editar ni borrar desde el sitio por ahora — el
-- horario se administra directamente desde este SQL Editor.
create policy "Cualquiera puede ver el horario activo"
  on public.horario_clases
  for select
  to public
  using (activo = true);

grant select on public.horario_clases to anon, authenticated;

-- Horario vigente: Fase 1 (solo Nivel 1, ver documento de cronograma)
insert into public.horario_clases
  (nivel, dia_semana, hora_inicio, hora_fin, ubicacion, notas, alternativo, orden)
values
  ('Nivel 1 - Iniciación (4-5 años)', 'martes', '15:00', '15:40', null, null, false, 1),
  ('Nivel 1 - Iniciación (4-5 años)', 'jueves', '15:00', '15:40', null, null, false, 1),
  ('Nivel 1 - Iniciación (4-5 años)', 'sabado', '09:00', '09:40', null,
   'Horario alternativo para familias con jornada escolar distinta', true, 1);
