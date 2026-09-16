-- Corrección adicional: permisos base de PostgreSQL para la tabla inscripciones
-- Ejecutar en Supabase: SQL Editor -> New query -> pegar todo -> Run
--
-- Una política RLS (row-level security) NO es suficiente por sí sola: Postgres
-- también exige el permiso base (GRANT) para que un rol pueda tocar la tabla.
-- Cuando una tabla se crea por SQL Editor (en lugar del editor visual de
-- Supabase), ese permiso base no se otorga automáticamente. Por eso, aunque
-- la política ya decía "cualquiera puede insertar", Postgres seguía rechazando
-- la operación con el mismo error 42501.

grant insert on public.inscripciones to anon, authenticated;

-- Nota: esto NO abre lectura/edición/borrado — sigue existiendo solo la
-- política de INSERT que ya creamos. anon/authenticated siguen sin poder
-- leer, editar ni borrar filas de esta tabla.

-- Verificación rápida (opcional): confirma que la política de INSERT existe
-- y a qué rol aplica.
select polname, polcmd, roles
from pg_policy
join pg_class on pg_policy.polrelid = pg_class.oid
where pg_class.relname = 'inscripciones';
