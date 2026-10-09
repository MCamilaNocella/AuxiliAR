import { useState } from "react"
import { Link } from "react-router"
import { todayInArgentina } from "@/data/resources"
import { PATHS } from "@/router/paths"
import { planLoad, provinceLabel } from "@/utils/places"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { POINTS } from "./Section2.points"

/** Centros de atención · Sobre los datos: how the places on the map are verified, in plain words, and where it covers today */
export default function Section2Content() {
  // The provinces that have verified places today (names only: the numbers of the index are not for people)
  const [day] = useState(() => todayInArgentina())
  const covered = planLoad({ day, province: null }).covered.map(provinceLabel)

  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-3">
      <p className="m-0 text-ink-soft">
        Estas son las reglas con las que mostramos los centros del{" "}
        <Link to={PATHS.centers} className="font-bold">
          Mapa AuxiliAR
        </Link>
        .
      </p>

      <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
        {POINTS.map(({ title, text }) => (
          <li key={title} className="rounded-2xl border border-line-strong bg-card p-4">
            <h3 className="m-0 text-lg font-extrabold">{title}</h3>
            <div className="mt-1 flex flex-col gap-2 text-ink-soft">
              {text.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </li>
        ))}

        <li className="rounded-2xl border border-line-strong bg-card p-4">
          <h3 className="m-0 text-lg font-extrabold">Fuentes y alcance</h3>
          <div className="mt-1 flex flex-col gap-2 text-ink-soft">
            <p className="m-0">
              La información viene de fuentes oficiales: por ahora, los datos abiertos del Gobierno de la Ciudad de Buenos Aires y las páginas oficiales de cada centro. Cada ficha nombra su fuente y trae el
              enlace para consultarla.
            </p>
            <p className="m-0">
              {covered.length === 0
                ? "Por ahora no hay centros verificados para mostrar."
                : covered.length === 1
                  ? `Hoy solo hay centros verificados en ${covered[0]}.`
                  : `Hoy hay centros verificados en ${covered.join(", ")}.`}{" "}
              En el resto del país todavía no tenemos cobertura: estamos incorporando establecimientos de a poco, y las zonas con cobertura son las que ofrece el selector de provincias del mapa.
            </p>
          </div>
        </li>
      </ul>

      <p className="m-0 text-ink-soft">
        Si hay riesgo inmediato, no busques un centro:{" "}
        <button type="button" onClick={revealEmergencies} className="-my-2.5 inline-block cursor-pointer border-0 bg-transparent py-2.5 font-bold text-brand underline underline-offset-4">
          mirá los números de emergencia
        </button>
        .
      </p>
    </div>
  )
}
