import { getSupabasePublicClient } from "@/lib/supabase/public";

export type ClaseHorario = {
  id: string;
  nivel: string;
  dia_semana: string;
  hora_inicio: string; // "HH:MM:SS"
  hora_fin: string; // "HH:MM:SS"
  ubicacion: string | null;
  notas: string | null;
  alternativo: boolean;
  orden: number | null;
};

type DiaInfo = { label: string; jsDay: number; byDay: string };

export const DIAS: Record<string, DiaInfo> = {
  lunes: { label: "Lunes", jsDay: 1, byDay: "MO" },
  martes: { label: "Martes", jsDay: 2, byDay: "TU" },
  miercoles: { label: "Miércoles", jsDay: 3, byDay: "WE" },
  jueves: { label: "Jueves", jsDay: 4, byDay: "TH" },
  viernes: { label: "Viernes", jsDay: 5, byDay: "FR" },
  sabado: { label: "Sábado", jsDay: 6, byDay: "SA" },
  domingo: { label: "Domingo", jsDay: 0, byDay: "SU" },
};

const ORDEN_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export const UBICACION_DEFAULT = "Cancha de fútbol, Rivera, Huila, Colombia";

export async function getHorarioClases(): Promise<ClaseHorario[]> {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("horario_clases")
    .select("id, nivel, dia_semana, hora_inicio, hora_fin, ubicacion, notas, alternativo, orden")
    .returns<ClaseHorario[]>();

  if (error) throw error;

  const rows = data ?? [];
  return rows.sort((a, b) => {
    const da = ORDEN_SEMANA.indexOf(a.dia_semana);
    const db = ORDEN_SEMANA.indexOf(b.dia_semana);
    if (da !== db) return da - db;
    return a.hora_inicio.localeCompare(b.hora_inicio);
  });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Próxima fecha (>= hoy) en que cae ese día de la semana, en hora de Bogotá. */
function proximaFecha(jsDay: number): Date {
  const ahora = new Date();
  const hoyBogota = new Date(
    ahora.toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  const diff = (jsDay - hoyBogota.getDay() + 7) % 7;
  hoyBogota.setDate(hoyBogota.getDate() + diff);
  return hoyBogota;
}

/** YYYYMMDD para una fecha local (sin componente de hora). */
function fechaLocalYYYYMMDD(fecha: Date) {
  return `${fecha.getFullYear()}${pad(fecha.getMonth() + 1)}${pad(fecha.getDate())}`;
}

/**
 * Convierte una hora "HH:MM:SS" de Bogotá (UTC-5, sin horario de verano) a
 * un Date en UTC para una fecha local dada.
 */
function horaBogotaAUtc(fechaLocal: Date, horaHHMMSS: string): Date {
  const [h, m] = horaHHMMSS.split(":").map(Number);
  return new Date(
    Date.UTC(
      fechaLocal.getFullYear(),
      fechaLocal.getMonth(),
      fechaLocal.getDate(),
      h + 5,
      m,
      0
    )
  );
}

function formatUtc(fecha: Date) {
  return (
    `${fecha.getUTCFullYear()}${pad(fecha.getUTCMonth() + 1)}${pad(fecha.getUTCDate())}` +
    `T${pad(fecha.getUTCHours())}${pad(fecha.getUTCMinutes())}${pad(fecha.getUTCSeconds())}Z`
  );
}

export function tituloClase(clase: ClaseHorario) {
  return `Entrenamiento — ${clase.nivel}`;
}

/** Enlace de "agregar evento" con recurrencia semanal a Google Calendar. */
export function enlaceGoogleCalendar(clase: ClaseHorario) {
  const dia = DIAS[clase.dia_semana];
  if (!dia) return "#";

  const fechaLocal = proximaFecha(dia.jsDay);
  const inicioUtc = horaBogotaAUtc(fechaLocal, clase.hora_inicio);
  const finUtc = horaBogotaAUtc(fechaLocal, clase.hora_fin);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: tituloClase(clase),
    dates: `${formatUtc(inicioUtc)}/${formatUtc(finUtc)}`,
    recur: `RRULE:FREQ=WEEKLY;BYDAY=${dia.byDay}`,
    location: clase.ubicacion || UBICACION_DEFAULT,
    details:
      clase.notas ||
      "Entrenamiento de la Escuela de Fútbol Infantil — Club Deportivo Cardoso.",
    ctz: "America/Bogota",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(texto: string) {
  return texto.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

/** Genera un archivo .ics con un VEVENT recurrente por cada clase activa. */
export function generarIcsHorario(clases: ClaseHorario[]) {
  const ahora = formatUtc(new Date());

  const eventos = clases
    .map((clase) => {
      const dia = DIAS[clase.dia_semana];
      if (!dia) return "";

      const fechaLocal = proximaFecha(dia.jsDay);
      const inicioUtc = horaBogotaAUtc(fechaLocal, clase.hora_inicio);
      const finUtc = horaBogotaAUtc(fechaLocal, clase.hora_fin);

      return [
        "BEGIN:VEVENT",
        `UID:${clase.id}@club-de-futbol-cardoso`,
        `DTSTAMP:${ahora}`,
        `DTSTART:${formatUtc(inicioUtc)}`,
        `DTEND:${formatUtc(finUtc)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${dia.byDay}`,
        `SUMMARY:${escapeIcs(tituloClase(clase))}`,
        `LOCATION:${escapeIcs(clase.ubicacion || UBICACION_DEFAULT)}`,
        `DESCRIPTION:${escapeIcs(
          clase.notas ||
            "Entrenamiento de la Escuela de Fútbol Infantil — Club Deportivo Cardoso."
        )}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .filter(Boolean)
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Club Deportivo Cardoso//Horario de Clases//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Club Deportivo Cardoso — Horario de clases",
    "X-WR-TIMEZONE:America/Bogota",
    eventos,
    "END:VCALENDAR",
  ].join("\r\n");
}
