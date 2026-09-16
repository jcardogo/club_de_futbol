import Link from "next/link";
import { headers } from "next/headers";
import {
  DIAS,
  UBICACION_DEFAULT,
  enlaceGoogleCalendar,
  getHorarioClases,
  tituloClase,
  type ClaseHorario,
} from "@/lib/horario";

function formatHora(horaHHMMSS: string) {
  const [h, m] = horaHHMMSS.split(":").map(Number);
  const fecha = new Date(2000, 0, 1, h, m);
  return fecha.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function agruparPorDia(clases: ClaseHorario[]) {
  const grupos = new Map<string, ClaseHorario[]>();
  for (const clase of clases) {
    const lista = grupos.get(clase.dia_semana) ?? [];
    lista.push(clase);
    grupos.set(clase.dia_semana, lista);
  }
  return grupos;
}

export default async function HorarioPage() {
  let clases: ClaseHorario[] = [];
  let error = "";

  try {
    clases = await getHorarioClases();
  } catch (err) {
    error = err instanceof Error ? err.message : "No se pudo cargar el horario.";
  }

  const grupos = agruparPorDia(clases);
  const feedUrl = "/api/calendario.ics";
  const host = (await headers()).get("host") ?? "";
  const feedUrlWebcal = host ? `webcal://${host}${feedUrl}` : feedUrl;

  return (
    <div className="min-h-screen bg-[--color-bg-soft] text-[--color-ink]">
      <div className="flex items-center justify-between border-b-[3px] border-[--color-red] bg-white px-6 py-4 sm:px-12">
        <Link href="/" className="leading-tight">
          <div className="headline text-lg">Club Deportivo Cardoso</div>
          <div className="text-[10px] tracking-[2px] text-[--color-grey] uppercase">
            Escuela de Fútbol
          </div>
        </Link>
        <Link href="/" className="text-sm font-semibold text-[--color-ink]">
          ← Volver al inicio
        </Link>
      </div>

      <div className="px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="kicker mb-4">Entrenamientos</div>
          <h1 className="headline mb-4 text-3xl sm:text-4xl">Horario de clases</h1>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-zinc-600">
            Este es el horario vigente de entrenamientos, tomado directamente de
            nuestra base de datos. Puedes agregarlo a Google Calendar u Outlook para
            que se mantenga sincronizado automáticamente.
          </p>

          {error && (
            <div className="mb-10 rounded border-l-4 border-[--color-red] bg-white p-4 text-sm text-[--color-red]">
              No se pudo cargar el horario: {error}
            </div>
          )}

          {!error && clases.length === 0 && (
            <div className="mb-10 rounded bg-white p-8 text-center text-sm text-[--color-grey]">
              Todavía no hay clases publicadas en el horario.
            </div>
          )}

          {!error && clases.length > 0 && (
            <>
              {/* Suscripción al calendario completo */}
              <div className="mb-12 rounded border-t-4 border-[--color-red] bg-white p-6 shadow-sm">
                <div className="headline mb-2 text-lg">
                  Sincroniza todo el horario en tu agenda
                </div>
                <p className="mb-5 text-sm leading-relaxed text-zinc-600">
                  Suscríbete una sola vez y recibirás automáticamente los cambios que
                  hagamos al horario, sin tener que actualizar tu calendario a mano.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={feedUrlWebcal}
                    className="btn-primary rounded px-5 py-2.5 text-sm font-bold tracking-wide"
                  >
                    Suscribirse (Google/Outlook/Apple)
                  </a>
                  <a
                    href={feedUrl}
                    download="club-deportivo-cardoso-horario.ics"
                    className="rounded border border-[--color-red] px-5 py-2.5 text-sm font-bold text-[--color-red] hover:bg-[--color-red] hover:text-white"
                  >
                    Descargar archivo .ics
                  </a>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[--color-grey]">
                  En Google Calendar: menú <strong>Otros calendarios → Desde URL</strong>,
                  y pega la dirección de este enlace. En Outlook (web o escritorio):{" "}
                  <strong>Agregar calendario → Suscribirse desde la web</strong>, con la
                  misma dirección. También puedes descargar el archivo .ics e
                  importarlo directamente.
                </p>
              </div>

              {/* Horario por día */}
              <div className="grid gap-6">
                {Array.from(grupos.entries()).map(([diaKey, claseDia]) => (
                  <div key={diaKey} className="rounded bg-white p-6 shadow-sm">
                    <div className="headline mb-4 text-xl">
                      {DIAS[diaKey]?.label ?? diaKey}
                    </div>
                    <div className="grid gap-4">
                      {claseDia.map((clase) => (
                        <div
                          key={clase.id}
                          className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4 first:border-0 first:pt-0"
                        >
                          <div>
                            <div className="font-semibold">{tituloClase(clase)}</div>
                            <div className="text-sm text-[--color-grey]">
                              {formatHora(clase.hora_inicio)} – {formatHora(clase.hora_fin)}
                              {clase.alternativo && " · horario alternativo"}
                            </div>
                            <div className="text-sm text-zinc-500">
                              {clase.ubicacion || UBICACION_DEFAULT}
                            </div>
                            {clase.notas && (
                              <div className="mt-1 text-xs text-zinc-400">{clase.notas}</div>
                            )}
                          </div>
                          <a
                            href={enlaceGoogleCalendar(clase)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded border border-zinc-300 px-4 py-2 text-xs font-semibold text-[--color-ink] hover:bg-zinc-50"
                          >
                            + Google Calendar
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
