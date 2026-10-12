import { NUMBERS_GRID } from "./EmergencyNumbers.constants"
import type { EmergencyNumbersProps } from "./EmergencyNumbers.types"

/** Emergency phone cards: tapping one calls that number */
export const EmergencyNumbers = ({ numbers }: EmergencyNumbersProps) => (
  <ul role="list" className={`m-0 grid flex-1 auto-rows-fr list-none gap-2 p-0 ${NUMBERS_GRID}`}>
    {numbers.map(({ number, label }) => (
      <li key={number}>
        <a
          href={`tel:${number}`}
          aria-label={`Llamar al ${number}, ${label}`}
          className="flex h-full min-h-11 flex-col justify-center rounded-lg bg-alert px-3 py-1.5 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert sm:flex-row sm:items-center sm:justify-start sm:gap-2"
        >
          <b className="text-lg/tight font-extrabold">{number}</b>
          <span className="text-xs font-semibold sm:text-sm">{label}</span>
        </a>
      </li>
    ))}
  </ul>
)
