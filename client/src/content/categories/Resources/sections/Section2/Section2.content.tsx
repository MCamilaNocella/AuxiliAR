import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { OutLink } from "@/components/health/OutLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { REFUSED } from "../../../MentalHealth/MentalHealth.rights"
import { CHECKED_AT, TURNOS_CESAC, VACUNAS_PAGINA } from "../../Resources.sources"

/**
 * Más recursos · Trámites. What each procedure needs, explained here; the official page is a source and, for the appointment, the
 * place where the person does it (an action AuxiliAR cannot do for them). The CeSAC appointment text repeats the Gobierno de la
 * Ciudad's "Solicitud de turnos en CESAC" (read on 2026-10-08, saved in docs/investigacion/evidencia/caba-turnos-cesac-tramite.txt).
 * Phone numbers are not copied except the 147, the Ciudad's line named by that page for this procedure.
 */
const cardClass = "rounded-2xl border border-line-strong bg-card p-4 sm:p-6"
const linkClass = "inline-flex min-h-11 items-center font-bold"

export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Qué necesitás para los trámites más comunes de salud. AuxiliAR no saca turnos por vos ni te pide datos personales.</p>

      <section aria-labelledby="tr-cesac" className={cardClass}>
        <h3 id="tr-cesac" className="m-0 text-xl font-extrabold">
          Cómo pedir turno en un CeSAC
        </h3>
        <p className="m-0 mt-1">Para los Centros de Salud y Acción Comunitaria (CeSAC) de la Ciudad de Buenos Aires. El trámite es gratuito.</p>

        <h4 className="m-0 mt-4 text-base font-extrabold">1. Empadronate en el Sistema de Salud (una sola vez)</h4>
        <p className="m-0 mt-1">Se hace por el 147 o en persona, en cualquier centro de salud de la Ciudad, con un documento que acredite tu identidad. Sirven:</p>
        <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
          <li>DNI, cédulas extranjeras, cédula de la Policía Federal o pasaporte extranjero.</li>
          <li>Constancia de residencia precaria.</li>
          <li>Libreta cívica o libreta de enrolamiento.</li>
          <li>Partida de nacimiento original, o certificado de partida de nacimiento en trámite.</li>
        </ul>
        <p className="m-0 mt-2 text-ink-soft">Si cambia el documento con el que te empadronaste (por ejemplo, pasás de residencia precaria a DNI), tenés que acercarte a un puesto de empadronamiento para validar tus datos.</p>

        <h4 className="m-0 mt-4 text-base font-extrabold">2. Sacá el turno</h4>
        <p className="m-0 mt-1">Si ya te atendés en un CeSAC, podés sacar turno con un médico o médica de cabecera de estas maneras:</p>
        <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
          <li>Por la web, en el portal de turnos de la Ciudad (necesitás usuario y clave miBA).</li>
          <li>Por Boti, el WhatsApp de la Ciudad.</li>
          <li>Por teléfono, al 147, opción 1.</li>
          <li>En persona, en los centros de salud.</li>
        </ul>

        <h4 className="m-0 mt-4 text-base font-extrabold">Qué turnos hay</h4>
        <p className="m-0 mt-1">
          El primer nivel de atención lo forman los CeSAC y los Centros Médicos Barriales. Por teléfono se puede pedir turno de clínica médica o medicina general, pediatría y odontología. Para algunas especialidades piden
          estudios previos o una derivación.
        </p>
        <p className="m-0 mt-2 text-ink-soft">Que el trámite sea gratuito no asegura que haya turnos disponibles: consultalo en el centro.</p>

        <div className="mt-3">
          <OutLink href={TURNOS_CESAC.url}>Ir al trámite oficial para sacar el turno</OutLink>
        </div>
        <SourceList sources={[TURNOS_CESAC]} checkedAt={CHECKED_AT} />
      </section>

      <section aria-labelledby="tr-vaccines" className={cardClass}>
        <h3 id="tr-vaccines" className="m-0 text-xl font-extrabold">
          Vacunarte
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>Las vacunas del Calendario Nacional están disponibles en centros de salud y hospitales públicos de todo el país y no requieren una orden médica.</li>
          <li>Llevá tu carnet de vacunas, si lo tenés, para que puedan chequearlo.</li>
          <li>Si no sabés qué vacunas te faltan o no encontrás el carnet, consultá en un vacunatorio o centro de salud: te orientan.</li>
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionLink to={`${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-5`} variant="primary">
            Ver el Calendario de vacunación
          </ActionLink>
          <ActionLink to={centersLink({ filter: "vaccination" })}>Encontrar vacunatorio</ActionLink>
        </div>
        <SourceList sources={[VACUNAS_PAGINA]} checkedAt={CHECKED_AT} />
      </section>

      <section aria-labelledby="tr-refused" className={cardClass}>
        <h3 id="tr-refused" className="m-0 text-xl font-extrabold">
          Si te rechazan la atención en salud mental
        </h3>
        <p className="m-0 mt-1">{REFUSED.rule}</p>
        <p className="m-0 mt-2 text-ink-soft">{REFUSED.note}</p>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-2`} className={linkClass}>
            Ver tus derechos en salud mental
          </Link>
        </p>
      </section>
    </div>
  )
}
