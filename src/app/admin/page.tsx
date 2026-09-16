import { getSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

type Inscripcion = {
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

function formatFecha(fecha: string) {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-CO");
}

function formatFechaHora(fecha: string) {
  return new Date(fecha).toLocaleString("es-CO");
}

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: inscripciones, error } = await supabase
    .from("inscripciones")
    .select(
      "id, created_at, nombre_nino, fecha_nacimiento, nombre_acudiente, telefono, email, nivel_interes, estado"
    )
    .order("created_at", { ascending: false })
    .returns<Inscripcion[]>();

  return (
    <div className="min-h-screen bg-[--color-bg-soft]">
      <div className="flex items-center justify-between border-b-[3px] border-[--color-red] bg-white px-6 py-4 sm:px-12">
        <div className="leading-tight">
          <div className="headline text-lg">Club Deportivo Cardoso</div>
          <div className="text-[10px] tracking-[2px] text-[--color-grey] uppercase">
            Panel de administración
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[--color-grey]">{user?.email}</span>
          <SignOutButton />
        </div>
      </div>

      <div className="px-6 py-10 sm:px-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="headline text-2xl">Inscripciones</h1>
          <span className="text-sm text-[--color-grey]">
            {inscripciones?.length ?? 0} en total
          </span>
        </div>

        {error && (
          <div className="rounded border-l-4 border-[--color-red] bg-white p-4 text-sm text-[--color-red]">
            No se pudieron cargar las inscripciones: {error.message}
          </div>
        )}

        {!error && (!inscripciones || inscripciones.length === 0) && (
          <div className="rounded bg-white p-8 text-center text-sm text-[--color-grey]">
            Todavía no hay inscripciones registradas.
          </div>
        )}

        {!error && inscripciones && inscripciones.length > 0 && (
          <div className="overflow-x-auto rounded bg-white shadow-sm">
            <table className="w-full min-w-[820px] text-left text-sm">
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
                </tr>
              </thead>
              <tbody>
                {inscripciones.map((row) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
