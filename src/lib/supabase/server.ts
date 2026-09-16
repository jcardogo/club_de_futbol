import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Cliente de Supabase para usar en Server Components, Server Actions y
// Route Handlers. Lee/escribe la sesión desde las cookies de la petición.
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Se llama desde un Server Component sin permiso de escritura;
          // el middleware ya se encarga de refrescar la sesión en ese caso.
        }
      },
    },
  });
}
