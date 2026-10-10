import { Link } from "react-router"
import { OutLink } from "@/components/health/OutLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { UBA_HOSPITAL, UNLP_HOSPITAL } from "../../Animals.sources"

/**
 * Salud animal · Atención veterinaria gratuita. Orientation only: AuxiliAR confirms no free veterinary clinic, guardia or
 * urgencias service, and promises no appointment or quota. It says what the sources document and how to ask:
 *  - dogs and cats are handled by the municipality or province; ask the local zoonosis center (ZOONOSIS)
 *  - the teaching hospitals of UBA and UNLP say on their own pages that their services are arancelados (SA07, SA08): belonging to a
 *    public university does not make a service free. No price is shown and they are not recommended
 * Not here on purpose: private clinics, the announced (not open) hospital of Córdoba (SA13), the civil organization's campaigns
 * without a confirmed free access (SA11) and the registry of professionals (SA12, not a free directory).
 * The shared map is not used: it has no veterinary services yet (it has the types, but no entry and no filter).
 */
export default function Section3Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Hoy conocemos campañas y servicios municipales de vacunación antirrábica y castración, el consultorio clínico del Instituto Pasteur (Ciudad de Buenos Aires) y la atención del hospital municipal de Salta, con
        condiciones. No confirmamos ninguna guardia ni atención de urgencia gratuita para animales.
      </p>

      <section aria-labelledby="an-how">
        <h3 id="an-how" className="m-0 text-xl font-extrabold">
          Cómo buscar atención veterinaria gratuita
        </h3>
        <ol className="m-0 mt-2 flex list-decimal flex-col gap-2 pl-5">
          <li>Consultá en tu municipalidad por el área de bienestar animal o por el centro de zoonosis de tu zona. Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial.</li>
          <li>Preguntá qué servicios son gratuitos, quién puede usarlos (por ejemplo, si piden domicilio en el municipio) y cómo se pide el turno.</li>
          <li>Pedí que te indiquen la página oficial donde figura, y leela antes de ir.</li>
        </ol>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
            Servicios que informan las páginas oficiales
          </Link>
        </p>
      </section>

      <section aria-labelledby="an-uni" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-uni" className="m-0 text-xl font-extrabold">
          Ser de una universidad pública no hace gratuito un servicio
        </h3>
        <p className="m-0 mt-1">Los hospitales escuela de veterinaria de la UBA y de la UNLP publican en sus páginas que sus servicios son arancelados. No los incluimos como atención gratuita.</p>
        <ul role="list" className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
          <li>
            <OutLink href={UBA_HOSPITAL.url}>{UBA_HOSPITAL.label}</OutLink>
          </li>
          <li>
            <OutLink href={UNLP_HOSPITAL.url}>{UNLP_HOSPITAL.label}</OutLink>
          </li>
        </ul>
      </section>

      <section aria-labelledby="an-limits">
        <h3 id="an-limits" className="m-0 text-xl font-extrabold">
          Lo que todavía no podemos decirte
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>No prometemos guardias, turnos ni cupos: dependen de cada servicio.</li>
          <li>El mapa de AuxiliAR todavía no incluye servicios veterinarios.</li>
          <li>No listamos clínicas veterinarias pagas.</li>
        </ul>
      </section>

      <p className="m-0 text-sm text-ink-soft">Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular.</p>
    </div>
  )
}
