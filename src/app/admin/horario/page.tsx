import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import AdminHorarioPanel from "@/components/AdminHorarioPanel";
import type { ClaseHorario } from "@/lib/horario";

export default async function AdminHorarioPage() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clases, error } = await supabase
    .from("horario_clases")
    .select("id, nivel, dia_semana, hora_inicio, hora_fin, ubicacion, notas, alternativo, orden, activo")
    .order("dia_semana", { ascending: true })
    .order("hora_inicio", { ascending: true })
    .returns<ClaseHorario[]>();

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

      <div className="flex gap-6 border-b border-zinc-200 bg-white px-6 sm:px-12">
        <Link href="/admin" className="border-b-2 border-transparent px-1 py-3 text-sm font-semibold text-[--color-grey]">
          Inscripciones
        </Link>
        <Link href="/admin/horario" className="border-b-2 border-[--color-red] px-1 py-3 text-sm font-semibold text-[--color-ink]">
          Horario
        </Link>
      </div>

      <div className="px-6 py-10 sm:px-12">
        {error ? (
          <div className="rounded border-l-4 border-[--color-red] bg-white p-4 text-sm text-[--color-red]">
            No se pudo cargar el horario: {error.message}
          </div>
        ) : (
          <AdminHorarioPanel initialData={clases ?? []} />
        )}
      </div>
    </div>
  );
}
