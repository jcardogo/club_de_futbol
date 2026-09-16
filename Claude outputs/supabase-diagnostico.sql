-- Diagnóstico (solo lectura, no cambia nada)
-- Ejecuta cada bloque por separado en el SQL Editor de Supabase
-- (selecciona el texto de un bloque y dale Run, uno a la vez)

-- 1) ¿Qué políticas existen sobre la tabla?
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where tablename = 'inscripciones';

-- 2) ¿Qué permisos GRANT tiene cada rol sobre la tabla?
select grantee, privilege_type
from information_schema.role_table_grants
where table_name = 'inscripciones';

-- 3) ¿RLS está realmente activado?
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname = 'inscripciones';
