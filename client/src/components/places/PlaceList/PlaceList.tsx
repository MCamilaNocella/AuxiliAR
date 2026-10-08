import type { PlaceEntry } from "@/utils/places"
import { PlaceCard } from "../PlaceCard"

type PlaceListProps = {
  entries: PlaceEntry[]
  onOpen: (placeId: string) => void
}

export const PlaceList = ({ entries, onOpen }: PlaceListProps) => (
  <ul role="list" aria-label="Lugares" className="m-0 grid list-none grid-cols-1 gap-4 p-0 xl:grid-cols-2">
    {entries.map((entry) => (
      <li key={entry.place.id}>
        <PlaceCard entry={entry} onOpen={onOpen} />
      </li>
    ))}
  </ul>
)
