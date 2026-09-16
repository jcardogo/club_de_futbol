-- Corrección: permisos base de PostgreSQL para la tabla inscripciones
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

grant insert on public.inscripciones to anon, authenticated;
