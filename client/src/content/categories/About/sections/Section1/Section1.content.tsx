import type { MouseEvent } from "react"
import { ChevronRight } from "lucide-react"
import { prefersReducedMotion } from "@/utils/scroll"
import { DataSection } from "../../DataSection"
import { SourcesSection } from "../../SourcesSection"

/**
 * The button leads to the text about the data, on this same page. The page's own scroll restoration (<ScrollRestoration /> in the layout)
 * puts the scroll back where it was after any change of address, a "#about-datos" included, so the browser's jump to the anchor would be
 * undone: the button scrolls to the text itself (smooth, unless the person asks for less motion) and moves the focus there. The href stays,
 * for what does not run scripts.
 */
const goToData = (event: MouseEvent<HTMLAnchorElement>) => {
  const target = document.getElementById("about-datos")
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
  target.focus({ preventScroll: true })
}

/**
 * Sobre AuxiliAR: the institutional page (the footer links here). It says only what the site itself already says elsewhere
 * (what it is, that the information comes from official sources, that it does not replace professional care) and its button leads to
 * "Sobre los datos del mapa", below on this same page: how the places are verified, what free means, what the date means and where it
 * covers (it was the second section of Centros de atención). At the end, "Fuentes y referencias": every source of the site, by topic,
 * in disclosures (the pages of the topics keep only the links to services, procedures, resources and videos).
 */
export default function AboutContent() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">AuxiliAR reúne información y recursos de salud para Argentina, en lenguaje simple y con fuentes oficiales.</p>
      <p className="m-0 text-ink-soft">
        Cada centro del mapa nombra de dónde sale su información y cuándo se verificó; lo que todavía no verificamos, no lo mostramos. AuxiliAR no reemplaza la atención médica ni psicológica profesional.
      </p>
      <a
        href="#about-datos"
        onClick={goToData}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-line-strong bg-card px-4 py-3 font-extrabold text-ink no-underline hover:border-control-line hover:text-ink"
      >
        <span className="flex-1">Cómo verificamos los datos</span>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-brand" />
      </a>

      <DataSection />

      <SourcesSection />
    </div>
  )
}
