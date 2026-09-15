import { createBrowserClient } from "@supabase/ssr";

// Estas dos variables se configuran en Vercel (Project Settings -> Environment
// Variables) y localmente en un archivo .env.local que NUNCA se sube a GitHub
// (ya está en .gitignore). Ver .env.local.example para los nombres exactos.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado todavía. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
