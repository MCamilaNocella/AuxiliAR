import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { PATHS, SECTION_PARAM } from "@/router/paths"

/**
 * Sobre AuxiliAR: the institutional page (the footer links here). It says only what the site itself already says elsewhere
 * (what it is, that the information comes from official sources, that it does not replace professional care) and points to
 * the page that explains how the data is verified. It does not repeat that page.
 */
export default function AboutContent() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">AuxiliAR reúne información y recursos de salud para Argentina, en lenguaje simple y con fuentes oficiales.</p>
      <p className="m-0 text-ink-soft">
        Cada centro del mapa nombra de dónde sale su información y cuándo se verificó; lo que todavía no verificamos, no lo mostramos. AuxiliAR no reemplaza la atención médica ni psicológica profesional.
      </p>
      <Link
        to={`${PATHS.centers}?${SECTION_PARAM}=section-2`}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-line-strong bg-card px-4 py-3 font-extrabold text-ink no-underline hover:border-control-line hover:text-ink"
      >
        <span className="flex-1">Cómo verificamos los datos</span>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-brand" />
      </Link>
    </div>
  )
}
