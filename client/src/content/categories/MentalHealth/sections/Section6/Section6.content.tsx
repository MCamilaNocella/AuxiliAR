import { Link } from "react-router"
import { Disclosure } from "@/components/health/Disclosure"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CesacList, DirectoryList } from "../../DirectoryBlocks"
import { BONAPARTE, CESAC_MENTAL, CSM_1 } from "../../MentalHealth.directory"
import { DIRECTORY_CHECKED_AT } from "../../MentalHealth.sources"

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * Salud mental · Atención en la Ciudad: where to ask for programmed care (CeSAC, Centro de Salud Mental Nº 1, Hospital Bonaparte). Data of MentalHealth.directory.ts (the team's research of
 * 12 October 2026, from the official pages, not by phone). The notice about how it was read is said once, here. The cost is not repeated on the page (AuxiliAR is a list of free resources): its basis, the
 * Ley 153, a general norm and not a phrase of each center, is kept in Sobre AuxiliAR. No appointment, place or schedule is promised.
 */
export default function Section6Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Dónde pedir atención programada de salud mental en la Ciudad de Buenos Aires. Los datos salen de páginas oficiales leídas el {formatDate(DIRECTORY_CHECKED_AT)}: nadie llamó ni fue a los lugares, así que
        confirmá con el servicio antes de ir.
      </p>

      <p className="m-0 text-ink-soft">
        <Link to={`${PATHS.resources}?${SECTION_PARAM}=section-2`} className="font-bold">
          Más recursos
        </Link>{" "}
        explica tus derechos en salud y cómo pedir turno en un CeSAC. Si es una urgencia, mirá las guardias en{" "}
        <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-1`} className="font-bold">
          Dónde buscar ayuda
        </Link>
        .
      </p>

      <Disclosure title={`CeSAC con psicología o psiquiatría (${CESAC_MENTAL.length})`}>
        <p className="m-0 text-ink-soft">Los CeSAC son los centros de salud de la Ciudad. Las páginas no publican los horarios de estos servicios: llamá o acercate para saber cómo se pide turno.</p>
        <CesacList items={CESAC_MENTAL} />
      </Disclosure>

      <Disclosure title="Centro de Salud Mental Nº 1">
        <DirectoryList items={CSM_1} />
      </Disclosure>

      <Disclosure title="Hospital Nacional Laura Bonaparte (Nación)">
        <p className="m-0">Es un hospital nacional, en la Ciudad. Tiene guardia y atención de adultos, y atención de niñas, niños y adolescentes.</p>
        <DirectoryList items={BONAPARTE} />
      </Disclosure>
    </div>
  )
}
