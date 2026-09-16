-- Permite que un administrador autenticado (quien inició sesión en /admin)
-- pueda AGREGAR y BORRAR inscripciones manualmente desde el panel.
-- El acceso público (sin sesión) sigue igual: solo puede insertar mediante
-- el formulario del sitio; no puede leer, editar ni borrar nada.
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

grant insert, delete on public.inscripciones to authenticated;

create policy "Administradores autenticados pueden agregar inscripciones"
  on public.inscripciones
  for insert
  to authenticated
  with check (true);

create policy "Administradores autenticados pueden borrar inscripciones"
  on public.inscripciones
  for delete
  to authenticated
  using (true);
