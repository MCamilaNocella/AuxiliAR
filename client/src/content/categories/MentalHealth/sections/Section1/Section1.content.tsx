import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { Disclosure } from "@/components/health/Disclosure"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CesacList, DirectoryList, HospitalList, NationalLine } from "../../DirectoryBlocks"
import { BONAPARTE, CESAC_MENTAL, CSM_1, GUARDIAS_CABA, GUARDIAS_CABA_INFANTIL, LINEAS_CABA } from "../../MentalHealth.directory"
import { DIRECTORY_CHECKED_AT, GUARDIAS_PAGINA } from "../../MentalHealth.sources"

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * Salud mental · Dónde buscar ayuda. Information and orientation: it offers no appointments and promises no place or availability. What it says and where it comes from:
 *  - "si no tenés cobertura podés acercarte a un hospital o centro de salud cercano a tu domicilio": argentina.gob.ar, Derechos Humanos
 *  - "ser atendida en el hospital general": Ley simple (Derecho Fácil); "equipo interdisciplinario…": Ley 26.657, art. 8
 *  - the national lines come from data/resources/lines (the same ones of the emergency bar); the lines, guardias, CeSAC and the Bonaparte hospital of the Ciudad come from
 *    MentalHealth.directory.ts (the team's research of 12 October 2026, confirmed from the official pages, not by phone)
 * Cost is said once and as what it is: the Ley 153 exempts from direct payment in the Ciudad's state services; it is a general norm, not a phrase of each center.
 * The map button only explores. The help numbers of the emergency bar stay where they are.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Estamos para ayudarte a encontrar orientación y recursos de salud mental. Acá vas a conocer tus derechos y descubrir dónde buscar atención. AuxiliAR no otorga turnos ni realiza consultas médicas
        directamente.
      </p>

      <section aria-labelledby="mh-lines">
        <h3 id="mh-lines" className="m-0 text-xl font-extrabold">
          Si necesitás hablar con alguien ahora
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Son líneas de escucha y orientación: no reemplazan una guardia ni la atención presencial.</p>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
          <NationalLine id="urgencias-salud-mental-0800" />
          <NationalLine id="prevencion-suicidio-cas" />
        </ul>
        <h4 className="m-0 mt-4 text-lg font-extrabold">En la Ciudad de Buenos Aires</h4>
        <div className="mt-2">
          <DirectoryList items={LINEAS_CABA.filter(({ id }) => id !== "linea-caba-108-3")} />
        </div>
        <p className="m-0 mt-3 text-ink-soft">
          Para otras provincias, mirá{" "}
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-5`} className="font-bold">
            Otras provincias
          </Link>
          . Para consumos de alcohol, drogas o medicamentos (líneas de orientación y centros de atención), mirá{" "}
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-4`} className="font-bold">
            Consumos y acompañamiento
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="mh-near">
        <h3 id="mh-near" className="m-0 text-xl font-extrabold">
          Un hospital o centro de salud cerca de tu casa
        </h3>
        <p className="m-0 mt-1">
          Si no tenés cobertura de salud, podés acercarte a un hospital o centro de salud cercano a tu domicilio. La ley establece que las personas con padecimiento mental tienen derecho a ser atendidas en el
          hospital general.
        </p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "mental-health" })} variant="primary">
            Ver el mapa
          </ActionLink>
        </div>
        <p className="m-0 mt-2 text-ink-soft">Consultá cada ficha para saber qué servicios gratuitos están confirmados. Todavía no cubrimos todo el país.</p>
      </section>

      <section aria-labelledby="mh-caba" className="flex flex-col gap-3">
        <div>
          <h3 id="mh-caba" className="m-0 text-xl font-extrabold">
            En la Ciudad de Buenos Aires
          </h3>
          <p className="m-0 mt-1">
            Los datos de esta parte salen de las páginas oficiales y se leyeron el {formatDate(DIRECTORY_CHECKED_AT)}: nadie llamó ni fue a los lugares. Antes de ir, confirmá con el servicio que sigue atendiendo.
          </p>
          <p className="m-0 mt-2 text-ink-soft">
            En los servicios estatales de la Ciudad no se paga de forma directa: lo dice la Ley 153 (arts. 2 y 3.g). Es una norma general, no una frase de cada centro.{" "}
            <Link to={`${PATHS.resources}?${SECTION_PARAM}=section-2`} className="font-bold">
              Más recursos
            </Link>{" "}
            explica tus derechos en salud y cómo pedir turno en un CeSAC.
          </p>
        </div>

        <Disclosure title="Guardias de salud mental, las 24 horas">
          <p className="m-0">Estos hospitales de la Ciudad tienen guardia de salud mental las 24 horas, todos los días del año. Se va sin turno, por una urgencia; la atención sigue la evaluación y la prioridad clínica.</p>
          <HospitalList items={GUARDIAS_CABA} url={GUARDIAS_PAGINA} />
          <h4 className="m-0 mt-2 text-base font-extrabold">Hospitales de niños</h4>
          <p className="m-0 text-ink-soft">Tienen la misma guardia, pero la página no dice hasta qué edad atienden: consultalo antes. Los demás hospitales no se presentan como atención para niñas y niños.</p>
          <HospitalList items={GUARDIAS_CABA_INFANTIL} url={GUARDIAS_PAGINA} />
          <p className="m-0 text-ink-soft">Este listado no incluye hospitales con guardia cuyo domicilio las páginas no muestran igual: se agregan cuando se aclare.</p>
        </Disclosure>

        <Disclosure title="Atención programada en los CeSAC">
          <p className="m-0">
            Estos CeSAC (centros de salud de la Ciudad) listan psicología o psiquiatría en su propia página. Las páginas no publican los horarios de estos servicios: llamá o acercate para saber cómo se pide turno.
          </p>
          <p className="m-0 text-ink-soft">
            Para turnos generales de los CeSAC se pide domicilio en la Ciudad, empadronamiento y documento de identidad; ese circuito no se aplica a una urgencia. Leé cómo se hace en{" "}
            <Link to={`${PATHS.resources}?${SECTION_PARAM}=section-2`} className="font-bold">
              Más recursos
            </Link>
            .
          </p>
          <CesacList items={CESAC_MENTAL} />
        </Disclosure>

        <Disclosure title="Centro de Salud Mental Nº 1">
          <DirectoryList items={CSM_1} />
        </Disclosure>

        <Disclosure title="Hospital Nacional Laura Bonaparte (Nación)">
          <p className="m-0">Es un hospital nacional, en la Ciudad. Tiene guardia y atención de adultos, y atención de niñas, niños y adolescentes.</p>
          <DirectoryList items={BONAPARTE} />
        </Disclosure>
      </section>

      <section aria-labelledby="mh-team">
        <h3 id="mh-team" className="m-0 text-xl font-extrabold">
          Quién te atiende
        </h3>
        <p className="m-0 mt-1">La ley establece que la atención en salud mental esté a cargo de un equipo interdisciplinario, integrado por profesionales y técnicos.</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-2`} className="font-bold">
            Conocé tus derechos
          </Link>
        </p>
      </section>
    </div>
  )
}
