-- Corrección de la política de seguridad de "inscripciones"
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run

-- Quitamos la política anterior (apuntaba al rol "anon", que no coincide
-- con las llaves nuevas tipo sb_publishable_...)
drop policy if exists "Cualquiera puede inscribirse" on public.inscripciones;

-- La recreamos apuntando a "public" (cualquier solicitante), manteniendo
-- la misma restricción: solo puede INSERTAR, nunca leer/editar/borrar.
create policy "Cualquiera puede inscribirse"
  on public.inscripciones
  for insert
  to public
  with check (true);
