"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type Inscripcion = {
  id: string;
  created_at: string;
  nombre_nino: string;
  fecha_nacimiento: string;
  nombre_acudiente: string;
  telefono: string;
  email: string | null;
  nivel_interes: string;
  estado: string;
};

const NIVELES = [
  "Nivel 1 - Iniciación (4-5 años)",
  "Nivel 2 - Sub-7",
  "Nivel 3 - Sub-9",
  "Nivel 4 - Sub-11",
];

const ESTADOS = ["pendiente", "contactado", "confirmado", "retirado"];

function formatFecha(fecha: string) {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-CO");
}

function formatFechaHora(fecha: string) {
  return new Date(fecha).toLocaleString("es-CO");
}

const emptyForm = {
  nombre_nino: "",
  fecha_nacimiento: "",
  nombre_acudiente: "",
  telefono: "",
  email: "",
  nivel_interes: NIVELES[0],
  estado: ESTADOS[0],
};

export default function AdminPanel({ initialData }: { initialData: Inscripcion[] }) {
  const [rows, setRows] = useState<Inscripcion[]>(initialData);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState("");

  const filteredRows = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [
        row.nombre_nino,
        row.nombre_acudiente,
        row.telefono,
        row.email ?? "",
        row.nivel_interes,
        row.estado,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, filtro]);

  async function handleAddSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("inscripciones")
        .insert({
          nombre_nino: form.nombre_nino,
          fecha_nacimiento: form.fecha_nacimiento,
          nombre_acudiente: form.nombre_acudiente,
          telefono: form.telefono,
          email: form.email || null,
          nivel_interes: form.nivel_interes,
          estado: form.estado,
        })
        .select(
          "id, created_at, nombre_nino, fecha_nacimiento, nombre_acudiente, telefono, email, nivel_interes, estado"
        )
        .single<Inscripcion>();

      if (error) throw error;
      if (data) {
        setRows((prev) => [data, ...prev]);
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "No se pudo agregar el registro."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: Inscripcion) {
    const confirmado = window.confirm(
      `¿Borrar la inscripción de ${row.nombre_nino}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    setDeletingId(row.id);
    setRowError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("inscripciones").delete().eq("id", row.id);
      if (error) throw error;
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setRowError(
        err instanceof Error ? err.message : "No se pudo borrar el registro."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="headline text-2xl">Inscripciones</h1>
        <span className="text-sm text-[--color-grey]">
          {filteredRows.length} de {rows.length} en total
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por niño, acudiente, teléfono, correo, nivel o estado..."
          className="w-full max-w-md rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setFormError("");
          }}
          className="btn-primary rounded px-4 py-2 text-sm font-bold tracking-wide"
        >
          {showForm ? "Cancelar" : "+ Agregar inscripción"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-6 grid gap-4 rounded bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_nombre_nino">
              Nombre del niño/a
            </label>
            <input
              required
              id="a_nombre_nino"
              value={form.nombre_nino}
              onChange={(e) => setForm({ ...form, nombre_nino: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_fecha_nacimiento">
              Fecha de nacimiento
            </label>
            <input
              required
              type="date"
              id="a_fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_nombre_acudiente">
              Nombre del acudiente
            </label>
            <input
              required
              id="a_nombre_acudiente"
              value={form.nombre_acudiente}
              onChange={(e) => setForm({ ...form, nombre_acudiente: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_telefono">
              Teléfono
            </label>
            <input
              required
              type="tel"
              id="a_telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="a_email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_nivel_interes">
              Nivel de interés
            </label>
            <select
              id="a_nivel_interes"
              value={form.nivel_interes}
              onChange={(e) => setForm({ ...form, nivel_interes: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            >
              {NIVELES.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="a_estado">
              Estado
            </label>
            <select
              id="a_estado"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2 capitalize"
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado} className="capitalize">
                  {estado}
                </option>
              ))}
            </select>
          </div>

          {formError && (
            <p className="sm:col-span-2 text-sm font-medium text-[--color-red]">
              {formError}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary rounded px-6 py-3 text-sm font-bold tracking-wide disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar inscripción"}
            </button>
          </div>
        </form>
      )}

      {rowError && (
        <div className="mb-4 rounded border-l-4 border-[--color-red] bg-white p-4 text-sm text-[--color-red]">
          {rowError}
        </div>
      )}

      {filteredRows.length === 0 && (
        <div className="rounded bg-white p-8 text-center text-sm text-[--color-grey]">
          {rows.length === 0
            ? "Todavía no hay inscripciones registradas."
            : "Ningún registro coincide con el filtro."}
        </div>
      )}

      {filteredRows.length > 0 && (
        <div className="overflow-x-auto rounded bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-[--color-grey]">
                <th className="px-4 py-3">Recibido</th>
                <th className="px-4 py-3">Niño/a</th>
                <th className="px-4 py-3">Fecha nac.</th>
                <th className="px-4 py-3">Acudiente</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-[--color-grey]">
                    {formatFechaHora(row.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.nombre_nino}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatFecha(row.fecha_nacimiento)}
                  </td>
                  <td className="px-4 py-3">{row.nombre_acudiente}</td>
                  <td className="whitespace-nowrap px-4 py-3">{row.telefono}</td>
                  <td className="px-4 py-3">{row.email || "—"}</td>
                  <td className="px-4 py-3">{row.nivel_interes}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize">
                      {row.estado}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={deletingId === row.id}
                      className="rounded border border-[--color-red] px-3 py-1.5 text-xs font-semibold text-[--color-red] hover:bg-[--color-red] hover:text-white disabled:opacity-60"
                    >
                      {deletingId === row.id ? "Borrando..." : "Borrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
