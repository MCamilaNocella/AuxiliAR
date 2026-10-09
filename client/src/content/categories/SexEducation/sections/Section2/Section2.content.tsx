import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { OutLink } from "@/components/health/OutLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import {
  CABA_COORDINACION,
  CABA_CONSEJERIAS,
  CABA_METODOS,
  CABA_TEST,
  CHECKED_AT_METHODS,
  HUESPED_METODOS,
  LINEA,
  PREGUNTAS,
  PRESERVATIVO_VAGINAL,
  PRESERVATIVOS,
} from "../../SexEducation.sources"
import { METHODS, NO_STI_PROTECTION, VAGINAL_CONDOM } from "./Section2.constants"

/**
 * Salud sexual y ESI · Anticoncepción y prevención. Explains, inside AuxiliAR, what the Ministerio de Salud de la Nación says
 * about each method and about the vaginal condom (see Section2.constants.ts), and what the Gobierno de la Ciudad says about
 * gratuity ("La atención y los métodos son gratuitos en el sistema público"). General information, never a personal indication.
 * It does NOT say where the vaginal condom is delivered: no source names a center (the Hospital Rivadavia is not confirmed).
 * The official pages are listed at the end as sources; the only way out of AuxiliAR for content is "Para leer más" (a complement).
 */
const detailsClass = "rounded-2xl border border-line-strong bg-card"
const summaryClass = "flex min-h-14 cursor-pointer items-center px-4 py-3 text-lg font-extrabold"

export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Información general del Ministerio de Salud de la Nación y del Gobierno de la Ciudad. No reemplaza la consulta con un profesional de la salud.</p>

      <section aria-labelledby="ss-free" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="ss-free" className="m-0 text-xl font-extrabold">
          Qué dicen las fuentes oficiales sobre el acceso y el costo
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>La Ley 25.673 incluye los métodos anticonceptivos en la cobertura médica obligatoria. El Ministerio indica que se retiran en centros de salud y hospitales, o se piden a la obra social o prepaga.</li>
          <li>
            En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa: «La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas».
          </li>
          <li>El mejor método anticonceptivo es el que cada persona elige, con información y asesoramiento.</li>
        </ul>
        <p className="m-0 mt-2 text-ink-soft">Que haya un método no asegura que haya turno o disponibilidad en un centro en particular: consultalo antes de ir. En el resto del país, preguntá en tu centro de salud.</p>
      </section>

      <section aria-labelledby="ss-methods">
        <h3 id="ss-methods" className="m-0 text-xl font-extrabold">
          Métodos anticonceptivos
        </h3>
        <p className="m-0 mt-1">
          Hay varios métodos y cuál conviene depende de cada persona: un profesional de la salud te ayuda a elegir. Abrí cada uno para ver qué es y cómo se usa, según el Ministerio. Esto es información general, no una indicación
          personal.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <details className={detailsClass}>
            <summary className={summaryClass}>Preservativos (peneano y vaginal)</summary>
            <div className="flex flex-col gap-2 px-4 pb-4">
              <p className="m-0">
                Es el único método anticonceptivo que además ayuda a reducir el riesgo de infecciones de transmisión sexual (ITS), incluido el VIH. No elimina el riesgo por completo. Se puede combinar con otro método para tener doble protección.
              </p>
              <p className="m-0">
                Hay dos tipos: el que se usa en el pene (el más conocido) y el vaginal, que se explica más abajo. Se usa siempre uno nuevo en cada práctica sexual, vaginal, anal u oral, y se tira a la basura, no al inodoro.
              </p>
              <p className="m-0">Para el preservativo peneano, el Ministerio recomienda:</p>
              <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
                <li>Verificar la fecha de vencimiento y controlar el envoltorio, y no exponerlo al sol ni al calor ni llevarlo en la billetera.</li>
                <li>Usarlo desde la erección y durante toda la relación sexual, porque antes de la eyaculación salen gotas de líquido preseminal que tienen espermatozoides.</li>
                <li>Abrir el sobre con cuidado, sin elementos cortantes ni con los dientes, y no usar nunca dos juntos.</li>
                <li>Apretar la punta para sacar el aire antes de apoyarlo en el pene erecto, y desenrollarlo hasta la base.</li>
                <li>Usar lubricantes a base de agua: la vaselina, el aceite y la crema de manos dañan el preservativo.</li>
                <li>Retirarlo con el pene todavía erecto, cuidando que no se derrame el semen.</li>
              </ul>
              <p className="m-0 text-ink-soft">Por la Ley 25.673, los preservativos están incluidos en la cobertura de salud obligatoria: se piden en hospitales, centros de salud, obras sociales y prepagas.</p>
            </div>
          </details>

          {METHODS.map(({ id, title, about }) => (
            <details key={id} className={detailsClass}>
              <summary className={summaryClass}>{title}</summary>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {about.map((paragraph) => (
                  <p key={paragraph} className="m-0">
                    {paragraph}
                  </p>
                ))}
                <p className="m-0 text-ink-soft">{id === "ahe" ? "La AHE no protege del VIH ni de otras ITS: se recomienda el uso de preservativo." : NO_STI_PROTECTION}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="ss-vaginal" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="ss-vaginal" className="m-0 text-xl font-extrabold">
          ¿Qué es el preservativo vaginal?
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          {VAGINAL_CONDOM.what.map((paragraph) => (
            <p key={paragraph} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>

        <h4 className="m-0 mt-4 text-base font-extrabold">Cómo se usa</h4>
        <ol className="m-0 mt-1 flex list-decimal flex-col gap-1 pl-5">
          {VAGINAL_CONDOM.how.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h4 className="m-0 mt-4 text-base font-extrabold">Tené en cuenta</h4>
        <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
          {VAGINAL_CONDOM.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <h4 className="m-0 mt-4 text-base font-extrabold">Si se rompió, se corrió o no lo usaste</h4>
        <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
          {VAGINAL_CONDOM.ifItFails.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <h4 className="m-0 mt-4 text-base font-extrabold">Dónde conseguirlo</h4>
        <div className="mt-1 flex flex-col gap-2">
          {VAGINAL_CONDOM.where.map((paragraph) => (
            <p key={paragraph} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="ss-tests">
        <h3 id="ss-tests" className="m-0 text-xl font-extrabold">
          Pruebas de VIH y sífilis
        </h3>
        <p className="m-0 mt-1">
          En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que los test de VIH y sífilis son análisis de sangre sencillos, confidenciales y gratuitos en el sistema público, y que no es necesario estar en
          ayunas ni ser mayor de edad. Los centros de testeo funcionan en CeSAC, hospitales y organizaciones comunitarias, donde también se retiran preservativos gratis y material informativo.
        </p>
        <p className="m-0 mt-2 text-ink-soft">Los centros atienden en distintos días y horarios: consultá por teléfono antes de ir. Si vivís en otro lugar, preguntá en tu centro de salud.</p>
        <p className="m-0 mt-2">
          <OutLink href={CABA_TEST.url}>Lista oficial de centros de testeo de la Ciudad</OutLink>
        </p>
      </section>

      <section aria-labelledby="ss-where">
        <h3 id="ss-where" className="m-0 text-xl font-extrabold">
          Dónde consultar
        </h3>
        <p className="m-0 mt-1">Los métodos y el asesoramiento se consultan en centros de salud y hospitales. En la Ciudad de Buenos Aires existen consejerías en salud sexual en CeSAC y hospitales, donde se accede a los métodos anticonceptivos.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionLink to={centersLink({ filter: "sexual-health" })} variant="primary">
            Ver el mapa
          </ActionLink>
        </div>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
          <li>
            <OutLink href={CABA_CONSEJERIAS.url}>Lista oficial de consejerías de la Ciudad</OutLink>
          </li>
          <li>
            <OutLink href={LINEA.url}>Línea nacional de salud sexual: horarios y contacto</OutLink>
          </li>
        </ul>
        <p className="m-0 mt-1 text-ink-soft">Son páginas oficiales para consultar horarios y contactos que cambian: la explicación de arriba no depende de ellas.</p>
      </section>

      <section aria-labelledby="ss-read">
        <h3 id="ss-read" className="m-0 text-xl font-extrabold">
          Para leer más
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Es una guía educativa de una organización civil, un complemento: no es una consulta ni un servicio de atención.</p>
        <p className="m-0 mt-2">
          <OutLink href={HUESPED_METODOS.url}>{`${HUESPED_METODOS.label} · Fundación Huésped`}</OutLink>
        </p>
      </section>

      <p className="m-0">
        <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-3`} className="inline-flex min-h-11 items-center font-bold">
          Derechos y ESI
        </Link>
      </p>

      <SourceList
        sources={[PRESERVATIVO_VAGINAL, PRESERVATIVOS, ...METHODS.map(({ source }) => source), PREGUNTAS, CABA_METODOS, CABA_CONSEJERIAS, CABA_TEST, CABA_COORDINACION]}
        checkedAt={CHECKED_AT_METHODS}
        note="Es información general: no es un diagnóstico ni indicaciones de tratamiento."
      />
    </div>
  )
}
