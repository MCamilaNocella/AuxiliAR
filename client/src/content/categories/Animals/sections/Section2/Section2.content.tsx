import { Link } from "react-router"
import { Phone } from "lucide-react"
import { SourceList } from "@/components/health/SourceList"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { CHECKED_AT, RABIA, ZOONOSIS } from "../../Animals.sources"

/**
 * Salud animal · Cuidado y prevención. General information of the Ministerio de Salud de la Nación and Senasa; it gives no
 * veterinary instruction (no doses, no treatment, no schedule beyond what the ministry says) and no first-aid steps for a bite
 * (the wash and the rest are left to a clinical review, as the ficha SA09 asks): it only says to go quickly to a health center.
 * What it says:
 *  - "vacunando cada año a los perros y gatos contra la rabia a partir de los 3 meses de edad", for their whole life (RABIA)
 *  - "evitar el contacto con animales silvestres" (RABIA)
 *  - after a bite or scratch: go quickly to a health center to be evaluated (RABIA); the emergency button opens the existing numbers
 *  - what a zoonosis is, and that Senasa works on production animals while dogs and cats are handled by the municipality or the
 *    province (ZOONOSIS)
 */
export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Información general de organismos oficiales. No reemplaza la consulta con un veterinario.</p>

      <section aria-labelledby="an-rabies">
        <h3 id="an-rabies" className="m-0 text-xl font-extrabold">
          Vacunación antirrábica
        </h3>
        <p className="m-0 mt-1">El Ministerio de Salud de la Nación indica vacunar cada año a los perros y gatos contra la rabia, desde los 3 meses de edad y durante toda su vida.</p>
        <p className="m-0 mt-2">Ese cuidado también protege a las personas. Además, conviene evitar el contacto con animales silvestres.</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
            Campañas y servicios municipales
          </Link>
        </p>
      </section>

      <div className="rounded-2xl border-2 border-alert-card-line bg-alert-soft p-4">
        <p className="m-0 text-lg font-extrabold text-alert-text">Si un animal te mordió o te arañó</p>
        <p className="m-0 mt-1 text-ink">Acudí rápido a un centro de salud para que te evalúe un profesional. Si es una emergencia, mirá los números de emergencia.</p>
        <button
          type="button"
          onClick={revealEmergencies}
          className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-alert px-4 py-2 font-extrabold text-on-alert hover:bg-alert-dark"
        >
          <Phone aria-hidden="true" className="size-5 shrink-0" />
          Ver números de emergencia
        </button>
      </div>

      <section aria-labelledby="an-zoonosis">
        <h3 id="an-zoonosis" className="m-0 text-xl font-extrabold">
          Zoonosis: enfermedades que pasan de los animales a las personas
        </h3>
        <p className="m-0 mt-1">
          Una zoonosis es una enfermedad o infección que se da en los animales y que, en ciertas circunstancias, puede transmitirse a las personas. Senasa se ocupa de las vinculadas a animales de producción. Para perros y
          gatos, indica que se manejan a nivel municipal o provincial, con el centro de zoonosis local o el Ministerio de Salud.
        </p>
      </section>

      <SourceList sources={[RABIA, ZOONOSIS]} checkedAt={CHECKED_AT} note="Es información general: no es una indicación veterinaria ni médica." />
    </div>
  )
}
