import EnrollmentForm from "@/components/EnrollmentForm";

const NIVELES = [
  {
    tag: "NIVEL 1",
    edad: "4—5 años",
    nombre: "Iniciación",
    desc: "Motricidad, equilibrio y juego. El primer contacto con el balón y con el grupo.",
  },
  {
    tag: "NIVEL 2 · SUB-7",
    edad: "6—7 años",
    nombre: "Fundamentos",
    desc: "Técnica básica, reglas simples y los primeros partidos reducidos.",
  },
  {
    tag: "NIVEL 3 · SUB-9",
    edad: "8—9 años",
    nombre: "Desarrollo técnico",
    desc: "Consolidación técnica, táctica inicial y primeros amistosos.",
  },
  {
    tag: "NIVEL 4 · SUB-11",
    edad: "10—11 años",
    nombre: "Desarrollo",
    desc: "Táctica de equipo, liderazgo y competencia departamental.",
  },
];

function CrestIcon({ size = 40 }: { size?: number }) {
  const h = Math.round(size * 1.1);
  return (
    <svg width={size} height={h} viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 1L38 8V21C38 32 30 40.5 20 43C10 40.5 2 32 2 21V8L20 1Z"
        fill="#c8102e"
        stroke="#17140f"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="19" r="7.2" stroke="#ffffff" strokeWidth="1.4" fill="none" />
      <path d="M20 13.5L23 16.5L21.8 20.5H18.2L17 16.5Z" stroke="#ffffff" strokeWidth="1" fill="none" />
      <path d="M13 30L20 26L27 30" stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white text-[--color-ink]">
      {/* NAV */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-[--color-red] bg-white/95 px-6 py-4 backdrop-blur sm:px-12">
        <div className="flex items-center gap-3">
          <CrestIcon />
          <div className="leading-tight">
            <div className="headline text-lg">Semillero Rivera</div>
            <div className="text-[10px] tracking-[2px] text-[--color-grey] uppercase">
              Escuela de Fútbol
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-9 sm:flex">
          <a href="#escuela" className="text-sm font-semibold text-[--color-ink]">
            La Escuela
          </a>
          <a href="#niveles" className="text-sm font-semibold text-[--color-ink]">
            Niveles
          </a>
          <a href="#contacto" className="text-sm font-semibold text-[--color-ink]">
            Contacto
          </a>
          <a
            href="#inscripcion"
            className="btn-primary rounded-sm px-6 py-3 text-sm font-bold tracking-wide"
          >
            Inscríbete
          </a>
        </div>
      </div>

      {/* HERO */}
      <div
        className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-36"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, #a10d2570 0%, transparent 60%), linear-gradient(180deg, #7a0c1e 0%, #5c0917 100%)",
        }}
      >
        <div className="absolute -right-20 -top-16 opacity-10">
          <svg width="480" height="480" viewBox="0 0 40 44" fill="none">
            <path
              d="M20 1L38 8V21C38 32 30 40.5 20 43C10 40.5 2 32 2 21V8L20 1Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.6"
            />
          </svg>
        </div>
        <div className="relative max-w-2xl">
          <div className="kicker mb-5 !text-white">Rivera · Huila · Colombia</div>
          <h1 className="headline text-5xl leading-[0.98] text-white sm:text-6xl">
            Aquí se forman
            <br />
            jugadores<span className="text-[#f2c6ce]">.</span>
            <br />
            Aquí se forman
            <br />
            personas<span className="text-[#f2c6ce]">.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#f0d9dd]">
            Escuela de fútbol formativo para niños y niñas de 4 a 11 años. Fútbol,
            valores y desarrollo — con cupos limitados para crecer bien, no rápido.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <a
              href="#inscripcion"
              className="inline-block rounded-sm bg-white px-9 py-4 text-base font-extrabold tracking-wide text-[#7a0c1e]"
            >
              Inscribe a tu hijo/a
            </a>
            <a
              href="#niveles"
              className="border-b-2 border-white pb-1 text-sm font-bold text-white"
            >
              Ver niveles →
            </a>
          </div>
        </div>

        <div className="mt-20 grid max-w-3xl grid-cols-3 gap-px bg-white/20">
          <div className="bg-[#7a0c1e] px-2 pt-7">
            <div className="headline text-3xl text-white sm:text-4xl">4—11</div>
            <div className="mt-1.5 text-xs uppercase tracking-wide text-[#f0d9dd]">
              Años de edad
            </div>
          </div>
          <div className="bg-[#7a0c1e] px-2 pt-7">
            <div className="headline text-3xl text-white sm:text-4xl">4</div>
            <div className="mt-1.5 text-xs uppercase tracking-wide text-[#f0d9dd]">
              Niveles formativos
            </div>
          </div>
          <div className="bg-[#7a0c1e] px-2 pt-7">
            <div className="headline text-3xl text-white sm:text-4xl">30</div>
            <div className="mt-1.5 text-xs uppercase tracking-wide text-[#f0d9dd]">
              Cupos Fase 1
            </div>
          </div>
        </div>
      </div>

      {/* CONVOCATORIA + FORMULARIO */}
      <div id="inscripcion" className="bg-[--color-ink] px-6 py-14 sm:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-start">
          <div>
            <span className="headline text-lg text-white">
              Convocatoria abierta — Nivel 1, Iniciación (4-5 años)
            </span>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              30 cupos disponibles para el lanzamiento, en dos grupos de 15 niños con
              entrenador principal y auxiliar. Completa el formulario para reservar el
              cupo de tu hijo/a.
            </p>
          </div>
          <EnrollmentForm />
        </div>
      </div>

      {/* LA ESCUELA */}
      <div id="escuela" className="grid gap-16 px-6 py-24 sm:grid-cols-2 sm:items-center sm:px-12">
        <div>
          <div className="kicker mb-4">Nuestro enfoque</div>
          <h2 className="headline mb-6 text-3xl leading-tight sm:text-4xl">
            Desarrollo antes que competencia
          </h2>
          <p className="mb-5 text-base leading-relaxed text-zinc-600">
            Creemos que el fútbol infantil es, primero, una herramienta de desarrollo
            motriz, social y emocional. Por eso crecemos por fases, con grupos pequeños
            y entrenadores dedicados a cada nivel.
          </p>
          <p className="text-base leading-relaxed text-zinc-600">
            Nuestros niveles están alineados con las categorías de la Liga de Fútbol
            del Huila, para que el camino de cada niño tenga continuidad más allá de la
            escuela.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center border border-zinc-200 border-t-4 border-t-[--color-red] bg-gradient-to-br from-zinc-100 to-zinc-200">
          <span className="text-sm tracking-wide text-zinc-400">
            [FOTO: NIÑOS ENTRENANDO]
          </span>
        </div>
      </div>

      {/* NIVELES */}
      <div id="niveles" className="bg-[--color-bg-soft] px-6 py-24 sm:px-12">
        <div className="mb-14 text-center">
          <div className="kicker mb-4">Nuestra formación</div>
          <h2 className="headline text-3xl sm:text-4xl">Cuatro niveles, un mismo camino</h2>
        </div>
        <div className="grid gap-px bg-[#e2d3d5] sm:grid-cols-2 lg:grid-cols-4">
          {NIVELES.map((nivel) => (
            <div key={nivel.tag} className="border-t-4 border-[--color-red] bg-white p-8">
              <div className="mb-2.5 text-xs font-bold tracking-widest text-[--color-red]">
                {nivel.tag}
              </div>
              <div className="headline mb-2 text-2xl">{nivel.edad}</div>
              <div className="mb-4 text-sm text-[--color-grey]">{nivel.nombre}</div>
              <p className="text-sm leading-relaxed text-zinc-600">{nivel.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        id="contacto"
        className="flex flex-wrap justify-between gap-8 border-t-4 border-[--color-red] bg-[--color-ink] px-6 py-14 sm:px-12"
      >
        <div className="flex items-center gap-3">
          <svg width="30" height="33" viewBox="0 0 40 44" fill="none">
            <path
              d="M20 1L38 8V21C38 32 30 40.5 20 43C10 40.5 2 32 2 21V8L20 1Z"
              fill="none"
              stroke="#c8102e"
              strokeWidth="1.5"
            />
          </svg>
          <div className="headline text-base text-white">Semillero Rivera</div>
        </div>
        <div className="text-sm leading-loose text-zinc-300">
          Rivera, Huila, Colombia
          <br />
          [correo@semillerorivera.co]
          <br />
          [+57 300 000 0000]
        </div>
        <div className="text-xs text-zinc-500">
          © 2026 Semillero Rivera. Nombre y datos de contacto por confirmar.
        </div>
      </div>
    </div>
  );
}
