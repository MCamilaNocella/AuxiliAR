import { MapPin } from "lucide-react"
import { serviceHighlights, serviceName, shortAddress } from "@/utils/places"
import type { PlaceEntry } from "@/utils/places"
import { HighlightBadges } from "../HighlightBadges"

/** Services listed on a card; the rest are counted */
const MAX_SERVICES = 4

type PlaceCardProps = {
  entry: PlaceEntry
  onOpen: (placeId: string) => void
}

/** Summary of a place: where it is, its main services and what its verified data highlights. Details open in the panel. */
export const PlaceCard = ({ entry: { place, services }, onOpen }: PlaceCardProps) => {
  const address = shortAddress(place.address)
  const shown = services.slice(0, MAX_SERVICES)
  const hidden = services.length - shown.length

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line-strong bg-card p-4">
      <div>
        <h3 className="m-0 text-lg font-extrabold">{place.name}</h3>
        {address && (
          <p className="m-0 mt-1 flex items-start gap-1.5 text-muted">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{address}</span>
          </p>
        )}
      </div>

      <ul role="list" aria-label="Prestaciones" className="m-0 flex list-none flex-col gap-2 p-0">
        {shown.map((service) => {
          const highlights = serviceHighlights(service, place)
          return (
            <li key={service.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-ink">{serviceName(service)}</span>
              <HighlightBadges items={highlights} />
            </li>
          )
        })}
      </ul>
      {hidden > 0 && <p className="m-0 text-muted">{`+${hidden} ${hidden === 1 ? "servicio más" : "servicios más"}`}</p>}

      <button
        type="button"
        data-place-trigger={place.id}
        onClick={() => onOpen(place.id)}
        className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center self-start rounded-xl border border-control-line bg-brand px-4 py-2 font-extrabold text-on-brand hover:bg-brand-dark"
      >
        Ver información<span className="sr-only">{` de ${place.name}`}</span>
      </button>
    </article>
  )
}
