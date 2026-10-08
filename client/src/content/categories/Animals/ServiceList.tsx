import { OutLink } from "@/components/health/OutLink"
import type { MunicipalService } from "./Animals.sources"

/**
 * Services of a municipality as its own page describes them: where it applies, what it offers, who can use it, how it is asked for,
 * and the limit the page leaves open. AuxiliAR copies no phone, address or schedule, and the link goes to the page itself.
 */
export const ServiceList = ({ items }: { items: MunicipalService[] }) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-5 p-0">
    {items.map(({ id, place, by, offers, who, how, limit, url }) => (
      <li key={id} className="flex flex-col gap-1 border-l-4 border-line-strong pl-3">
        <b className="text-lg">{place}</b>
        <span className="text-ink-soft">{by}</span>
        <p className="m-0 mt-1">{offers}</p>
        <p className="m-0">
          <b>Quién: </b>
          {who}
        </p>
        <p className="m-0">
          <b>Cómo: </b>
          {how}
        </p>
        {limit && (
          <p className="m-0 text-ink-soft">
            <b>Ojo: </b>
            {limit}
          </p>
        )}
        <p className="m-0">
          <OutLink href={url}>{`Página oficial: ${by}`}</OutLink>
        </p>
      </li>
    ))}
  </ul>
)
