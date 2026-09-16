"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? "Correo o contraseña incorrectos."
          : "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[--color-bg-soft] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="headline text-2xl">Club Deportivo Cardoso</div>
          <div className="mt-1 text-sm text-[--color-grey]">Panel de administración</div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 rounded bg-white p-8 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="email">
              Correo
            </label>
            <input
              required
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="password">
              Contraseña
            </label>
            <input
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm font-medium text-[--color-red]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 rounded px-6 py-3 text-sm font-bold tracking-wide disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
