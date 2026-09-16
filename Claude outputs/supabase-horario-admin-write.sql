-- Permite que un administrador autenticado (quien inició sesión en /admin)
-- pueda ver TODAS las clases (incluyendo las ocultas/inactivas), y
-- agregar, editar y borrar clases desde /admin/horario.
-- El acceso público sigue igual: solo ve las clases marcadas como activas,
-- y no puede insertar, editar ni borrar.
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

grant select, insert, update, delete on public.horario_clases to authenticated;

create policy "Administradores autenticados pueden ver todo el horario"
  on public.horario_clases
  for select
  to authenticated
  using (true);

create policy "Administradores autenticados pueden agregar clases"
  on public.horario_clases
  for insert
  to authenticated
  with check (true);

create policy "Administradores autenticados pueden editar clases"
  on public.horario_clases
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Administradores autenticados pueden borrar clases"
  on public.horario_clases
  for delete
  to authenticated
  using (true);
