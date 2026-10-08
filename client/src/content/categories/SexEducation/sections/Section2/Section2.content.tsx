import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { OutLink } from "@/components/health/OutLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CABA_COORDINACION, CABA_TEST, CHECKED_AT, HUESPED_METODOS, LEY_25673, METODOS, PREGUNTAS } from "../../SexEducation.sources"

/**
 * Salud sexual y ESI · Anticoncepción y prevención. General information of the Ministerio de Salud de la Nación; it gives no
 * advice about medication, doses, efficacy or side effects (the official page has no such numbers, and they are left to a
 * health professional). What it says and where it comes from:
 *  - the nine methods named by the ministry (METODOS), as names only
 *  - "el preservativo es el único método que además de evitar un embarazo sirve para prevenir ITS" (METODOS, PREGUNTAS); said here as "ayuda a reducir el riesgo"
 *    and "no elimina el riesgo por completo", so it never suggests absolute protection
 *  - the intro to the methods is general: it gives no personal indication, only that a professional helps to choose
 *  - "se obtienen en centros de salud, hospitales, obras sociales y prepagas" (PREGUNTAS)
 *  - the right of access to information, orientation, methods and services: Ley 25.673, art. 2
 *  - the testing and the condoms of the Ciudad: said as "el Gobierno de la Ciudad informa", with its page; no center is listed
 *    here and no age, hour or result time is promised
 */
const METHODS = [
  "Preservativos",
  "Pastillas combinadas",
  "Pastillas de una sola hormona",
  "Anticonceptivos inyectables",
  "Implante subdérmico",
  "Dispositivo intrauterino (DIU)",
  "Anticoncepción de emergencia",
  "Ligadura tubaria",
  "Vasectomía",
]

export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Información general del Ministerio de Salud de la Nación. No reemplaza la consulta con un profesional de la salud.</p>

      <section aria-labelledby="ss-methods">
        <h3 id="ss-methods" className="m-0 text-xl font-extrabold">
          Métodos anticonceptivos
        </h3>
        <p className="m-0 mt-1">Los métodos anticonceptivos permiten evitar un embarazo. Hay varios, y cuál conviene depende de cada persona: un profesional de la salud te ayuda a elegir. Esto es información general, no una indicación personal.</p>
        <p className="m-0 mt-2">El Ministerio de Salud nombra estos métodos:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5">
          {METHODS.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
        <p className="m-0 mt-3">Cada método tiene condiciones de uso. Elegí uno con información y asesoramiento de un profesional, en un centro de salud o un hospital.</p>
        <p className="m-0 mt-2">La Ley 25.673 reconoce el derecho de toda la población a acceder a información, orientación, métodos y prestaciones de salud sexual y reproductiva. Qué método hay y cuándo, depende de cada centro: consultalo antes de ir.</p>
      </section>

      <section aria-labelledby="ss-condom" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="ss-condom" className="m-0 text-xl font-extrabold">
          El preservativo ayuda a reducir el riesgo de ITS
        </h3>
        <p className="m-0 mt-1">
          El preservativo es el único método anticonceptivo que además ayuda a reducir el riesgo de infecciones de transmisión sexual (ITS), incluido el VIH. No elimina el riesgo por completo. Se puede combinar con otro método.
        </p>
      </section>

      <section aria-labelledby="ss-tests">
        <h3 id="ss-tests" className="m-0 text-xl font-extrabold">
          Pruebas de VIH y sífilis
        </h3>
        <p className="m-0 mt-1">
          En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que el test de VIH y sífilis es sencillo, confidencial y gratuito en el sistema público, y que no hace falta estar en ayunas ni ser mayor de
          edad. También informa que ofrece preservativos gratis en bocas de distribución.
        </p>
        <p className="m-0 mt-2 text-ink-soft">Los centros atienden en distintos días y horarios: consultá por teléfono antes de ir. AuxiliAR no verificó cada centro de la lista oficial. Si vivís en otro lugar, preguntá en tu centro de salud.</p>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
          <li>
            <OutLink href={CABA_TEST.url}>Test de VIH y sífilis: qué es y lista de centros</OutLink>
          </li>
          <li>
            <OutLink href={CABA_COORDINACION.url}>Preservativos y salud sexual en la Ciudad</OutLink>
          </li>
        </ul>
      </section>

      <section aria-labelledby="ss-where">
        <h3 id="ss-where" className="m-0 text-xl font-extrabold">
          Dónde consultar
        </h3>
        <p className="m-0 mt-1">Los métodos y el asesoramiento se consultan en centros de salud y hospitales.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "sexual-health" })} variant="primary">
            Explorar centros de salud en el mapa
          </ActionLink>
        </div>
        <p className="m-0 mt-2 text-ink-soft">Consultá cada ficha para saber qué servicios gratuitos están confirmados.</p>
      </section>

      <section aria-labelledby="ss-read">
        <h3 id="ss-read" className="m-0 text-xl font-extrabold">
          Para leer más
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Es una guía educativa de una organización civil, no una consulta ni un servicio de atención.</p>
        <p className="m-0 mt-2">
          <OutLink href={HUESPED_METODOS.url}>{`${HUESPED_METODOS.label} · Fundación Huésped`}</OutLink>
        </p>
      </section>

      <p className="m-0">
        <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-3`} className="inline-flex min-h-11 items-center font-bold">
          Derechos y ESI
        </Link>
      </p>

      <SourceList sources={[METODOS, PREGUNTAS, LEY_25673, CABA_TEST, CABA_COORDINACION]} checkedAt={CHECKED_AT} note="Es información general: no es un diagnóstico ni indicaciones de tratamiento." />
    </div>
  )
}
