import type { AgendaEntry } from "./Animals.places"
import { CABA_AGENDA, CABA_AGENDA_UNTIL, READ_ON } from "./Animals.places"

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const longDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

const Group = ({ title, entries, empty }: { title: string, entries: AgendaEntry[], empty: string }) => (
  <div>
    <h6 className="m-0 text-base font-extrabold">{title}</h6>
    {entries.length === 0 ? (
      <p className="m-0 mt-1">{empty}</p>
    ) : (
      <ul role="list" className="m-0 mt-1 flex list-none flex-col gap-1.5 p-0">
        {entries.map(({ date, place, hours, kind }) => (
          <li key={`${date}-${place}`} className="break-words">
            <b className="capitalize">{formatDate(date)}</b>
            {`: ${place}${hours ? `, de ${hours}` : ""}${kind === "fijo" ? " (centro fijo)" : " (unidad móvil)"}`}
          </li>
        ))}
      </ul>
    )}
  </div>
)

/**
 * The cronograma that the Ciudad publishes, shown only from today on: it changes every week, so what already passed is not shown, and when
 * nothing is left it says so and sends to the official page (the card's single link). `from` is a day YYYY-MM-DD, today by default.
 */
export const CabaAgenda = ({ from = today() }: { from?: string }) => {
  const upcoming = CABA_AGENDA.filter(({ date }) => date >= from)
  const expired = from > CABA_AGENDA_UNTIL
  return (
    <div className="mt-3 rounded-xl border border-line-strong bg-field p-3">
      <h5 className="m-0 text-lg font-extrabold">Cronograma publicado</h5>
      <p className="m-0 mt-1 text-sm text-ink-soft">
        {`Leído el ${longDate(READ_ON)}: llega hasta el ${longDate(CABA_AGENDA_UNTIL)} y cambia cada semana. Las fechas pasadas no se muestran. Para ver el cronograma vigente usá el enlace de abajo.`}
      </p>
      {expired ? (
        <p className="m-0 mt-2 font-bold">El cronograma que leímos ya venció: consultá el actual en la página oficial.</p>
      ) : (
        <div className="mt-2 flex flex-col gap-3">
          <Group title="Vacunación antirrábica (sin turno)" entries={upcoming.filter(({ service }) => service === "vacunacion")} empty="No quedan operativos de vacunación en el cronograma que leímos: consultá el vigente en la página oficial." />
          <Group title="Castración (con turno online)" entries={upcoming.filter(({ service }) => service === "castracion")} empty="No quedan fechas de castración en el cronograma que leímos: consultá el vigente en la página oficial." />
        </div>
      )}
    </div>
  )
}
