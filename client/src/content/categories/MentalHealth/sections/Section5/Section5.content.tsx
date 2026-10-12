import { Link } from "react-router"
import { Disclosure } from "@/components/health/Disclosure"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { DirectoryList } from "../../DirectoryBlocks"
import { LINEAS_OTRAS, PROVINCIAS } from "../../MentalHealth.directory"
import { DIRECTORY_CHECKED_AT } from "../../MentalHealth.sources"

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * Salud mental · Otras provincias: the lines and places outside the Ciudad that the team's research of 12 October 2026 confirmed from official pages (MentalHealth.directory.ts).
 * It is NOT every service of the country: a province without an entry has not been checked, which does not mean it has no services, and the section says so. Each page says its own cost;
 * what a page calls free is the institution's statement. Nobody phoned or visited.
 */
export default function Section5Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Líneas y lugares de atención de salud mental fuera de la Ciudad de Buenos Aires, tomados de páginas oficiales y leídos el {formatDate(DIRECTORY_CHECKED_AT)}. Nadie llamó ni fue a los lugares: confirmá con el servicio antes de ir.
      </p>

      <section aria-labelledby="mh-prov-note" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="mh-prov-note" className="m-0 text-xl font-extrabold">
          Qué no está acá
        </h3>
        <p className="m-0 mt-1">
          Todavía no revisamos todas las provincias. Que una provincia no aparezca no quiere decir que no tenga servicios. Para todo el país, las líneas nacionales están en{" "}
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-1`} className="font-bold">
            Dónde buscar ayuda
          </Link>{" "}
          y en{" "}
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-4`} className="font-bold">
            Consumos y acompañamiento
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="mh-prov-lines">
        <h3 id="mh-prov-lines" className="m-0 text-xl font-extrabold">
          Líneas de escucha y orientación
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Cada línea es de su provincia. El 135, por ejemplo, no es la misma línea en todos lados: depende de quién la atiende.</p>
        <div className="mt-3">
          <DirectoryList items={LINEAS_OTRAS} />
        </div>
      </section>

      <section aria-labelledby="mh-prov-places" className="flex flex-col gap-3">
        <h3 id="mh-prov-places" className="m-0 text-xl font-extrabold">
          Lugares de atención y actividades, por provincia
        </h3>
        {PROVINCIAS.map(({ name, items }) => (
          <Disclosure key={name} title={`${name} (${items.length})`}>
            <DirectoryList items={items} />
          </Disclosure>
        ))}
      </section>
    </div>
  )
}
