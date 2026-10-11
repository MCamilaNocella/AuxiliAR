import { useState } from "react"
import { Disclosure } from "@/components/health/Disclosure"
import { todayInArgentina } from "@/data/resources"
import { planLoad, provinceLabel } from "@/utils/places"
import { POINTS } from "../About.points"

/**
 * "Sobre AuxiliAR" · Sobre los datos del mapa: how the places on the map are verified, in plain words, and where it covers today.
 * It is the text that used to be the second section of Centros de atención ("Sobre los datos"), moved here unchanged: the rules are
 * in About.points.ts (the FAQ of Más recursos reads the same points: one copy). "Cómo verificamos" is plain text under the introduction; the other five points (four rules and "Fuentes y alcance",
 * with the provinces that have verified places today) are disclosures that start closed: all their text is in the page even when closed.
 * The emergency line and the link back to the map of that page are not repeated: the emergency bar is always in sight, and this page
 * is not a place to search. When the button of the page scrolls here, the text lands under the sticky bars: the page's own scroll-padding
 * (index.css) covers the header, and scroll-mt-14 the category bar that is stuck under it on small screens (on large ones the bar is a column).
 */
export const DataSection = () => {
  // The provinces that have verified places today (names only: the numbers of the index are not for people)
  const [day] = useState(() => todayInArgentina())
  const covered = planLoad({ day, province: null }).covered.map(provinceLabel)
  // "Cómo verificamos" is told as plain text, right under the introduction (no disclosure of its own); the other rules are disclosures
  const howWeVerify = POINTS.find(({ title }) => title === "Cómo verificamos")
  const rules = POINTS.filter(({ title }) => title !== "Cómo verificamos")

  return (
    <section id="about-datos" tabIndex={-1} aria-labelledby="about-datos-title" className="flex scroll-mt-14 flex-col gap-3 border-t border-line-strong pt-6 outline-none lg:scroll-mt-0">
      <h3 id="about-datos-title" className="m-0 text-xl font-extrabold">
        Sobre los datos del mapa
      </h3>
      <p className="m-0 text-ink-soft">Estas son las reglas con las que mostramos los centros del Mapa AuxiliAR.</p>
      {howWeVerify?.text.map((paragraph) => (
        <p key={paragraph} className="m-0 text-ink-soft">
          {paragraph}
        </p>
      ))}

      <div className="flex flex-col gap-2">
        {rules.map(({ title, text }) => (
          <Disclosure key={title} title={title} compact>
            <div className="flex flex-col gap-2 text-ink-soft">
              {text.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </Disclosure>
        ))}

        <Disclosure title="Fuentes y alcance" compact>
          <div className="flex flex-col gap-2 text-ink-soft">
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
        </Disclosure>
      </div>
    </section>
  )
}
