import { Link } from "react-router"
import { Disclosure } from "@/components/health/Disclosure"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { DirectoryList, NationalLine } from "../../DirectoryBlocks"
import { APOYO_MUTUO, CONSUMOS_CABA, CSM_3, LINEAS_CABA } from "../../MentalHealth.directory"
import { DIRECTORY_CHECKED_AT, RED_ADICCIONES } from "../../MentalHealth.sources"

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * Salud mental · Consumos y acompañamiento: lines, the Ciudad's network of care for problematic use of substances and the mutual-help groups. The 141 line comes from
 * data/resources/lines; the rest from MentalHealth.directory.ts (research of 12 October 2026, from the official pages). The mutual-help groups are not clinical care and
 * the section says so. No place is promised: admission, turns and beds depend on each center.
 */
export default function Section4Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Si vos o alguien cercano tiene un consumo de alcohol, drogas o medicamentos que preocupa, acá hay líneas, centros de atención y grupos de apoyo. Los datos salen de páginas oficiales y se leyeron el{" "}
        {formatDate(DIRECTORY_CHECKED_AT)}: nadie llamó ni fue a los lugares.
      </p>

      <section aria-labelledby="mh-cons-lines">
        <h3 id="mh-cons-lines" className="m-0 text-xl font-extrabold">
          Líneas de orientación
        </h3>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
          <NationalLine id="consumos-problematicos-141" />
        </ul>
        <div className="mt-3">
          <DirectoryList items={LINEAS_CABA.filter(({ id }) => id === "linea-caba-108-3")} />
        </div>
        <p className="m-0 mt-2 text-ink-soft">Una línea orienta y acompaña: no equivale a una cama ni a un tratamiento garantizado en un centro.</p>
      </section>

      <section aria-labelledby="mh-cons-caba" className="flex flex-col gap-3">
        <div>
          <h3 id="mh-cons-caba" className="m-0 text-xl font-extrabold">
            Atención en la Ciudad de Buenos Aires
          </h3>
          <p className="m-0 mt-1 text-ink-soft">Cada página indica cómo es la admisión; no asegura internación ni cupos.</p>
        </div>
        <Disclosure title="Centros y hospitales de la Red de adicciones">
          <DirectoryList items={[...CSM_3, ...CONSUMOS_CABA]} />
          <a href={RED_ADICCIONES} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold">
            Ver la Red de adicciones de la Ciudad (se abre en una pestaña nueva)
          </a>
        </Disclosure>
      </section>

      <section aria-labelledby="mh-cons-mutual" className="flex flex-col gap-3">
        <div>
          <h3 id="mh-cons-mutual" className="m-0 text-xl font-extrabold">
            Grupos de apoyo mutuo
          </h3>
          <p className="m-0 mt-1">Son reuniones de personas que se acompañan entre sí. No son atención profesional.</p>
        </div>
        <DirectoryList items={APOYO_MUTUO} />
      </section>

      <p className="m-0 text-ink-soft">
        Si buscás atención en otro lugar del país, mirá{" "}
        <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-5`} className="font-bold">
          Otras provincias
        </Link>
        .
      </p>
    </div>
  )
}
