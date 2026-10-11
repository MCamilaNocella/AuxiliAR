import { NEIGHBORHOOD_AGENDA, NEIGHBORHOOD_AGENDA_READ_ON, NEIGHBORHOOD_AGENDA_UNTIL } from "./Section2.constants"

const longDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const weekday = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

/**
 * The operativos of «Más servicios en tu barrio» that the official cronograma lists, shown from today on, with the day it was read. It changes
 * every week and the operativos can be suspended by weather: what already passed is not shown, and when nothing is left it says so.
 * `from` is a day YYYY-MM-DD, today by default.
 */
export const NeighborhoodAgenda = ({ from = today() }: { from?: string }) => {
  const upcoming = NEIGHBORHOOD_AGENDA.filter(({ date }) => date >= from)
  const expired = from > NEIGHBORHOOD_AGENDA_UNTIL
  return (
    <div className="rounded-xl border border-line-strong bg-field p-3">
      <h4 className="m-0 text-base font-extrabold">Próximos operativos del cronograma</h4>
      <p className="m-0 mt-1 text-sm text-ink-soft">
        {`Leído el ${longDate(NEIGHBORHOOD_AGENDA_READ_ON)}: el cronograma llega hasta el ${longDate(NEIGHBORHOOD_AGENDA_UNTIL)}. Las fechas pasadas no se muestran. Los operativos pueden suspenderse: confirmá en las redes del programa.`}
      </p>
      {expired || upcoming.length === 0 ? (
        <p className="m-0 mt-2 font-bold">El cronograma que leímos ya venció: consultá el actual en la página oficial.</p>
      ) : (
        <ul role="list" className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
          {upcoming.map(({ date, hours, place, note }) => (
            <li key={`${date}-${place}`} className="break-words">
              <b className="capitalize">{weekday(date)}</b>
              {`, de ${hours}: ${place}${note ? ` (${note})` : ""}`}
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-2 text-sm text-ink-soft">Cada semana la página también lista qué servicios hay y qué días. Odontología y oftalmología son con turno y cupos limitados.</p>
    </div>
  )
}
