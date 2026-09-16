import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase para lecturas públicas desde el servidor (páginas y
 * route handlers) que no dependen de la sesión de un usuario — como el
 * horario de clases, que cualquier visitante puede ver.
 */
export function getSupabasePublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
