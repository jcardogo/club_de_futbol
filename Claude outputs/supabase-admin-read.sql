-- Permite que un usuario autenticado (el administrador que inicia sesión
-- en /admin) pueda LEER las inscripciones. El acceso público (sin sesión)
-- sigue sin poder leer nada -- solo puede insertar, como hasta ahora.
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

grant select on public.inscripciones to authenticated;

create policy "Administradores autenticados pueden ver inscripciones"
  on public.inscripciones
  for select
  to authenticated
  using (true);
