import { DataSection } from "../../DataSection"
import { SourcesSection } from "../../SourcesSection"

/**
 * Sobre AuxiliAR: the institutional page (the footer links here). It says only what the site itself already says elsewhere
 * (what it is, that the information comes from official sources, that it does not replace professional care) and then, below on this same page, "Sobre los datos del mapa": how the places are verified, what free means, what the date means and where it
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
      <DataSection />

      <SourcesSection />
    </div>
  )
}
