import type { StationsListProps } from "./StationsList.types"

/** A long list of places with only a name and an address, in up to three columns */
export const StationsList = ({ items }: StationsListProps) => (
  <ul role="list" className="m-0 grid list-none gap-x-6 p-0 @[34rem]:grid-cols-2 @[50rem]:grid-cols-3">
    {items.map(({ name, address }) => (
      <li key={name} className="grid border-b border-line py-[0.55rem]">
        <b className="font-extrabold">{name}</b>
        <span className="text-[0.9rem] text-ink-soft">{address}</span>
      </li>
    ))}
  </ul>
)
