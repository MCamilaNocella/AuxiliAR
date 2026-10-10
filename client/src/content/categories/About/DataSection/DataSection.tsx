import { useState } from "react"
import { todayInArgentina } from "@/data/resources"
import { planLoad, provinceLabel } from "@/utils/places"
import { POINTS } from "../About.points"

/**
 * "Sobre AuxiliAR" · Sobre los datos del mapa: how the places on the map are verified, in plain words, and where it covers today.
 * It is the text that used to be the second section of Centros de atención ("Sobre los datos"), moved here unchanged: the rules are
 * in About.points.ts (the FAQ of Más recursos reads the same points: one copy). The emergency line and the link back to the map
 * of that page are not repeated: the emergency bar is always in sight, and this page is not a place to search.
 */
export const DataSection = () => {
  // The provinces that have verified places today (names only: the numbers of the index are not for people)
  const [day] = useState(() => todayInArgentina())
  const covered = planLoad({ day, province: null }).covered.map(provinceLabel)

  return (
    <section id="about-datos" aria-labelledby="about-datos-title" className="flex scroll-mt-24 flex-col gap-3 border-t border-line-strong pt-6">
      <h3 id="about-datos-title" className="m-0 text-xl font-extrabold">
        Sobre los datos del mapa
      </h3>
      <p className="m-0 text-ink-soft">Estas son las reglas con las que mostramos los centros del Mapa AuxiliAR.</p>

      <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
        {POINTS.map(({ title, text }) => (
          <li key={title} className="rounded-2xl border border-line-strong bg-card p-4">
            <h4 className="m-0 text-lg font-extrabold">{title}</h4>
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
          <h4 className="m-0 text-lg font-extrabold">Fuentes y alcance</h4>
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
    </section>
  )
}
