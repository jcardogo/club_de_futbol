"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function EnrollmentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      nombre_nino: String(formData.get("nombre_nino") || ""),
      fecha_nacimiento: String(formData.get("fecha_nacimiento") || ""),
      nombre_acudiente: String(formData.get("nombre_acudiente") || ""),
      telefono: String(formData.get("telefono") || ""),
      email: String(formData.get("email") || ""),
      nivel_interes: "Nivel 1 - Iniciación (4-5 años)",
    };

    if (!isSupabaseConfigured()) {
      // Supabase todavía no está conectado: guardamos la intención igual,
      // dejando claro que falta terminar la conexión a la base de datos.
      console.warn("Supabase no configurado. Datos del formulario:", payload);
      setStatus("error");
      setErrorMessage(
        "El formulario aún no está conectado a la base de datos. Este envío no quedó guardado."
      );
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("inscripciones").insert(payload);
      if (error) throw error;
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "No se pudo enviar la inscripción."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded border-l-4 border-[--color-red] bg-white p-6 text-[--color-ink]">
        <p className="headline text-lg">¡Inscripción recibida!</p>
        <p className="mt-2 text-sm text-[--color-grey]">
          Nos pondremos en contacto pronto para confirmar el cupo en el Nivel 1.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="nombre_nino">
          Nombre del niño/a
        </label>
        <input
          required
          id="nombre_nino"
          name="nombre_nino"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="fecha_nacimiento">
          Fecha de nacimiento
        </label>
        <input
          required
          type="date"
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="nombre_acudiente">
          Nombre del acudiente
        </label>
        <input
          required
          id="nombre_acudiente"
          name="nombre_acudiente"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="telefono">
          Teléfono
        </label>
        <input
          required
          type="tel"
          id="telefono"
          name="telefono"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="email">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-[--color-red]">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-2 rounded px-6 py-3 text-sm font-bold tracking-wide disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar inscripción"}
      </button>
    </form>
  );
}
