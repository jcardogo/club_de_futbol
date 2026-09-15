import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semillero Rivera — Escuela de Fútbol Infantil",
  description:
    "Escuela de fútbol formativo para niños y niñas de 4 a 11 años en Rivera, Huila. Cupos limitados, crecimiento por fases.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
