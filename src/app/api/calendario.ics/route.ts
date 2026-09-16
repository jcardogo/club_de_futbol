import { NextResponse } from "next/server";
import { getHorarioClases, generarIcsHorario } from "@/lib/horario";

export const revalidate = 3600; // refrescar el feed cada hora como máximo

export async function GET() {
  try {
    const clases = await getHorarioClases();
    const ics = generarIcsHorario(clases);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="club-deportivo-cardoso-horario.ics"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "No se pudo generar el calendario.",
      },
      { status: 500 }
    );
  }
}
