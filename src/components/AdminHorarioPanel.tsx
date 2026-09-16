"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DIAS, type ClaseHorario } from "@/lib/horario";

const NIVELES = [
  "Nivel 1 - Iniciación (4-5 años)",
  "Nivel 2 - Sub-7",
  "Nivel 3 - Sub-9",
  "Nivel 4 - Sub-11",
];

const DIA_KEYS = Object.keys(DIAS);

function horaInputValue(hora: string) {
  // Supabase entrega "HH:MM:SS"; <input type="time"> quiere "HH:MM".
  return hora?.slice(0, 5) ?? "";
}

type FormState = {
  nivel: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  ubicacion: string;
  notas: string;
  alternativo: boolean;
  activo: boolean;
  orden: number;
};

const emptyForm: FormState = {
  nivel: NIVELES[0],
  dia_semana: DIA_KEYS[0],
  hora_inicio: "15:00",
  hora_fin: "15:40",
  ubicacion: "",
  notas: "",
  alternativo: false,
  activo: true,
  orden: 1,
};

function claseAForm(clase: ClaseHorario): FormState {
  return {
    nivel: clase.nivel,
    dia_semana: clase.dia_semana,
    hora_inicio: horaInputValue(clase.hora_inicio),
    hora_fin: horaInputValue(clase.hora_fin),
    ubicacion: clase.ubicacion ?? "",
    notas: clase.notas ?? "",
    alternativo: clase.alternativo,
    activo: clase.activo ?? true,
    orden: clase.orden ?? 1,
  };
}

export default function AdminHorarioPanel({
  initialData,
}: {
  initialData: ClaseHorario[];
}) {
  const [rows, setRows] = useState<ClaseHorario[]>(initialData);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [rowError, setRowError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.nivel, DIAS[row.dia_semana]?.label ?? row.dia_semana, row.ubicacion ?? "", row.notas ?? ""]
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
        .from("horario_clases")
        .insert({
          nivel: form.nivel,
          dia_semana: form.dia_semana,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
          ubicacion: form.ubicacion || null,
          notas: form.notas || null,
          alternativo: form.alternativo,
          activo: form.activo,
          orden: form.orden,
        })
        .select(
          "id, nivel, dia_semana, hora_inicio, hora_fin, ubicacion, notas, alternativo, orden, activo"
        )
        .single<ClaseHorario>();

      if (error) throw error;
      if (data) setRows((prev) => [...prev, data]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo agregar la clase.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(row: ClaseHorario) {
    setEditingId(row.id);
    setEditForm(claseAForm(row));
    setRowError("");
  }

  async function handleEditSave(id: string) {
    setBusyId(id);
    setRowError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("horario_clases")
        .update({
          nivel: editForm.nivel,
          dia_semana: editForm.dia_semana,
          hora_inicio: editForm.hora_inicio,
          hora_fin: editForm.hora_fin,
          ubicacion: editForm.ubicacion || null,
          notas: editForm.notas || null,
          alternativo: editForm.alternativo,
          activo: editForm.activo,
          orden: editForm.orden,
        })
        .eq("id", id)
        .select(
          "id, nivel, dia_semana, hora_inicio, hora_fin, ubicacion, notas, alternativo, orden, activo"
        )
        .single<ClaseHorario>();

      if (error) throw error;
      if (data) {
        setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
      }
      setEditingId(null);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "No se pudo guardar el cambio.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(row: ClaseHorario) {
    const confirmado = window.confirm(
      `¿Borrar la clase de ${row.nivel} (${DIAS[row.dia_semana]?.label ?? row.dia_semana})? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    setBusyId(row.id);
    setRowError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("horario_clases").delete().eq("id", row.id);
      if (error) throw error;
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "No se pudo borrar la clase.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="headline text-2xl">Horario de clases</h1>
        <span className="text-sm text-[--color-grey]">
          {filteredRows.length} de {rows.length} en total
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nivel, día, lugar o nota..."
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
          {showForm ? "Cancelar" : "+ Agregar clase"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-6 grid gap-4 rounded bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold">Nivel</label>
            <select
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
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
            <label className="mb-1 block text-sm font-semibold">Día</label>
            <select
              value={form.dia_semana}
              onChange={(e) => setForm({ ...form, dia_semana: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            >
              {DIA_KEYS.map((dia) => (
                <option key={dia} value={dia}>
                  {DIAS[dia].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Hora de inicio</label>
            <input
              required
              type="time"
              value={form.hora_inicio}
              onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Hora de fin</label>
            <input
              required
              type="time"
              value={form.hora_fin}
              onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Lugar (opcional)</label>
            <input
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              placeholder="Cancha de fútbol, Rivera, Huila"
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Nota (opcional)</label>
            <input
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Ej: horario alternativo"
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.alternativo}
                onChange={(e) => setForm({ ...form, alternativo: e.target.checked })}
              />
              Horario alternativo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
              Visible en el sitio público
            </label>
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
              {saving ? "Guardando..." : "Guardar clase"}
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
            ? "Todavía no hay clases en el horario."
            : "Ningún registro coincide con el filtro."}
        </div>
      )}

      {filteredRows.length > 0 && (
        <div className="overflow-x-auto rounded bg-white shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-[--color-grey]">
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Día</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Lugar</th>
                <th className="px-4 py-3">Nota</th>
                <th className="px-4 py-3">Alt.</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const enEdicion = editingId === row.id;

                if (enEdicion) {
                  return (
                    <tr key={row.id} className="border-b border-zinc-100 bg-zinc-50 last:border-0">
                      <td className="px-4 py-3">
                        <select
                          value={editForm.nivel}
                          onChange={(e) => setEditForm({ ...editForm, nivel: e.target.value })}
                          className="w-full rounded border border-zinc-300 px-2 py-1"
                        >
                          {NIVELES.map((nivel) => (
                            <option key={nivel} value={nivel}>
                              {nivel}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.dia_semana}
                          onChange={(e) => setEditForm({ ...editForm, dia_semana: e.target.value })}
                          className="w-full rounded border border-zinc-300 px-2 py-1"
                        >
                          {DIA_KEYS.map((dia) => (
                            <option key={dia} value={dia}>
                              {DIAS[dia].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            value={editForm.hora_inicio}
                            onChange={(e) =>
                              setEditForm({ ...editForm, hora_inicio: e.target.value })
                            }
                            className="w-full rounded border border-zinc-300 px-2 py-1"
                          />
                          <span>–</span>
                          <input
                            type="time"
                            value={editForm.hora_fin}
                            onChange={(e) => setEditForm({ ...editForm, hora_fin: e.target.value })}
                            className="w-full rounded border border-zinc-300 px-2 py-1"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.ubicacion}
                          onChange={(e) => setEditForm({ ...editForm, ubicacion: e.target.value })}
                          className="w-full rounded border border-zinc-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.notas}
                          onChange={(e) => setEditForm({ ...editForm, notas: e.target.value })}
                          className="w-full rounded border border-zinc-300 px-2 py-1"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={editForm.alternativo}
                          onChange={(e) =>
                            setEditForm({ ...editForm, alternativo: e.target.checked })
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={editForm.activo}
                          onChange={(e) => setEditForm({ ...editForm, activo: e.target.checked })}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditSave(row.id)}
                            disabled={busyId === row.id}
                            className="btn-primary rounded px-3 py-1.5 text-xs font-bold disabled:opacity-60"
                          >
                            {busyId === row.id ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{row.nivel}</td>
                    <td className="px-4 py-3">{DIAS[row.dia_semana]?.label ?? row.dia_semana}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {horaInputValue(row.hora_inicio)} – {horaInputValue(row.hora_fin)}
                    </td>
                    <td className="px-4 py-3">{row.ubicacion || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{row.notas || "—"}</td>
                    <td className="px-4 py-3 text-center">{row.alternativo ? "Sí" : "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          row.activo === false
                            ? "bg-zinc-100 text-zinc-500"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.activo === false
                          ? "Oculto"
                          : "Visible"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-[--color-ink] hover:bg-zinc-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={busyId === row.id}
                          className="rounded border border-[--color-red] px-3 py-1.5 text-xs font-semibold text-[--color-red] hover:bg-[--color-red] hover:text-white disabled:opacity-60"
                        >
                          {busyId === row.id ? "Borrando..." : "Borrar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
