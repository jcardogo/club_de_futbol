import { getSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import AdminPanel, { type Inscripcion } from "@/components/AdminPanel";

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
        {error ? (
          <div className="rounded border-l-4 border-[--color-red] bg-white p-4 text-sm text-[--color-red]">
            No se pudieron cargar las inscripciones: {error.message}
          </div>
        ) : (
          <AdminPanel initialData={inscripciones ?? []} />
        )}
      </div>
    </div>
  );
}
