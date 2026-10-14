import { Fold } from "@/components/sectionBlocks/Fold"
import { NEIGHBORHOOD_AGENDA } from "./Section2.constants"

const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

/** "Miércoles, 14 de octubre" */
const dayName = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  const text = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const cell = "border-b border-line px-2 py-[0.55rem] align-top [overflow-wrap:anywhere] max-sm:border-0 max-sm:px-0 max-sm:py-[0.1rem]"

/**
 * «Próximas fechas»: the operativos of the official cronograma from today on (by the viewer's own date). What already passed is not
 * shown; when nothing is left it sends to the official cronograma. `from` is a day YYYY-MM-DD, today by default.
 */
export const NeighborhoodAgenda = ({ from = today() }: { from?: string }) => {
  const upcoming = NEIGHBORHOOD_AGENDA.filter(({ date }) => date >= from)
  return (
    <Fold label="Próximas fechas" count={upcoming.length ? `${upcoming.length} ${upcoming.length === 1 ? "fecha" : "fechas"}` : undefined}>
      {upcoming.length ? (
        <table className="mt-3 w-full border-collapse text-[0.95rem]">
          <thead className="max-sm:hidden">
            <tr>
              {["Día", "Dónde", "Horario"].map((heading) => (
                <th key={heading} className="border-b-2 border-line-strong px-2 py-[0.4rem] text-left text-[0.8rem] tracking-[0.05em] text-muted uppercase">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upcoming.map(({ date, hours, place, note }) => (
              <tr key={`${date}-${place}`} className="max-sm:grid max-sm:border-b max-sm:border-line max-sm:py-2">
                <td className={`${cell} font-extrabold`}>{dayName(date)}</td>
                <td className={cell}>{note ? `${place} (${note})` : place}</td>
                <td className={cell}>{hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="m-0">Ya pasaron las fechas que teníamos: mirá las próximas en el cronograma oficial.</p>
      )}
    </Fold>
  )
}
