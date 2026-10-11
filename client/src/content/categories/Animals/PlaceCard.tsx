import type { ReactNode } from "react"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import type { AnimalPlace, CostStatus, Kind, Prestacion } from "./Animals.places"
import { READ_ON } from "./Animals.places"

const labelClass = "m-0 mt-3 text-base font-extrabold"

const COST_LABEL: Record<CostStatus, string> = {
  gratuita: "Gratuita, según la página",
  condicionada: "Gratuita solo en algunos casos",
  "no-informada": "La página no informa el costo",
  arancelada: "Arancelada",
  "no-aplica": "El servicio no existe, según la página",
}

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const Lines = ({ items }: { items: string[] }) => (
  <ul className="m-0 mt-1 flex list-disc flex-col gap-1.5 pl-5">
    {items.map((item) => (
      <li key={item} className="break-words">
        {item}
      </li>
    ))}
  </ul>
)

const Block = ({ label, items }: { label: string, items?: string[] }) =>
  items && items.length > 0 ? (
    <>
      <h6 className={labelClass}>{label}</h6>
      <Lines items={items} />
    </>
  ) : null

/** One prestación of a place: who, cost and conditions, where, when, how and contact, apart from the others */
const PrestacionBlock = ({ item }: { item: Prestacion }) => (
  <div className="rounded-xl border border-line-strong bg-card p-3">
    <h5 className="m-0 text-lg font-extrabold">{item.title}</h5>
    <p className="m-0 mt-1 text-sm font-bold text-ink-soft">{COST_LABEL[item.cost.status]}</p>
    <h6 className={labelClass}>Para quién</h6>
    <p className="m-0 mt-1">{item.who}</p>
    <h6 className={labelClass}>Costo</h6>
    <p className="m-0 mt-1">{item.cost.text}</p>
    <Block label="Condiciones" items={item.conditions} />
    <Block label="Dónde" items={item.where} />
    <Block label="Cuándo" items={item.when} />
    <Block label="Cómo acceder" items={item.how} />
    <Block label="Contacto" items={item.contact} />
    <Block label="Para confirmar" items={item.pending} />
  </div>
)

/**
 * A place and its prestaciones of the given kinds and cost statuses (the pages show them in separate groups: free, cost not confirmed, arancelados) (a page shows the castración and vacunación of a place, another one its consulta and
 * urgencias). The text is what the official page says; AuxiliAR did not verify it in person. `children` is for what changes often
 * (the agenda of the Ciudad), shown before the single link that completes the action or shows the updated schedule. A page that only
 * tells consulta and urgencias passes `showAction={false}`: the link lives once, in the card of castración and vacunación.
 */
export const PlaceCard = ({ place, kinds, statuses, title, showAction = true, children }: { place: AnimalPlace, kinds: Kind[], statuses?: CostStatus[], title?: string, showAction?: boolean, children?: ReactNode }) => {
  const shown = place.prestaciones.filter(({ kind, cost }) => kinds.includes(kind) && (!statuses || statuses.includes(cost.status)))
  if (shown.length === 0) return null
  return (
    <Disclosure title={title ?? `${place.place} · ${place.by}`} compact>
      <p className="m-0 text-ink-soft">{place.by}</p>
      <div className="mt-2 flex flex-col gap-3">
        {shown.map((item) => (
          <PrestacionBlock key={item.title} item={item} />
        ))}
      </div>
      {children}
      {showAction && place.action && (
        <div className="mt-3">
          <OutLink href={place.action.url}>{place.action.label}</OutLink>
        </div>
      )}
      <p className="m-0 mt-3 text-sm text-ink-soft">
        {`Datos de la página oficial de ese organismo, consultada el ${formatDate(READ_ON)}.${place.sourceDate ? ` Fecha de su contenido: ${place.sourceDate}.` : " La página no muestra fecha de actualización."} AuxiliAR no los verificó: confirmá requisitos, costo y horarios con el servicio.`}
      </p>
    </Disclosure>
  )
}
