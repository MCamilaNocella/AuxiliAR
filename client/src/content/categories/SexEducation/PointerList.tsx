import { OutLink } from "@/components/health/OutLink"
import type { Pointer } from "./SexEducation.sources"

/** Pages of other organizations the section points to: who runs each one, and nothing more than what it says about itself */
export const PointerList = ({ items }: { items: Pointer[] }) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-2.5 p-0">
    {items.map(({ label, by, url }) => (
      <li key={url} className="flex flex-col">
        <OutLink href={url}>{label}</OutLink>
        <span className="text-ink-soft">{by}</span>
      </li>
    ))}
  </ul>
)
