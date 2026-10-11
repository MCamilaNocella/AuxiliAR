import { Phone } from "lucide-react"
import { THREE_GRID, wrappable } from "../../EmergencyNumberModels.constants"
import type { NumberModelProps } from "../../EmergencyNumberModels.types"

/** Text sizes of each version: name on top, phone icon and number below */
const SIZES = {
  bigNumber: { label: "text-xs/tight", icon: "size-4.5", number: "text-2xl/none" },
  bigTitle: { label: "text-sm/tight", icon: "size-4", number: "text-xl/none" },
}

type LabelOnTopCardsProps = NumberModelProps & { size: keyof typeof SIZES }

/** The name as the card's title, at the top; the number at the bottom with a phone before it, all numbers on the same line */
const LabelOnTopCards = ({ numbers, size }: LabelOnTopCardsProps) => {
  const { label: labelClass, icon: iconClass, number: numberClass } = SIZES[size]
  return (
    <ul role="list" className={`m-0 grid flex-1 auto-rows-fr list-none gap-2 p-0 ${THREE_GRID}`}>
      {numbers.map(({ number, label }) => (
        <li key={number}>
          <a
            href={`tel:${number}`}
            aria-label={`Llamar al ${number}, ${label}`}
            className="flex h-full flex-col justify-between gap-1 rounded-lg bg-alert px-3 py-2 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert"
          >
            <span className={`${labelClass} font-bold`}>{wrappable(label)}</span>
            <span className="flex items-center gap-1.5">
              <Phone aria-hidden="true" className={`${iconClass} flex-none`} />
              <b className={`${numberClass} font-extrabold`}>{number}</b>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** N3a: small name, big number */
export const LabelOnTopBigNumber = ({ numbers }: NumberModelProps) => <LabelOnTopCards numbers={numbers} size="bigNumber" />

/** N3b: bigger name, smaller number and icon */
export const LabelOnTopBigTitle = ({ numbers }: NumberModelProps) => <LabelOnTopCards numbers={numbers} size="bigTitle" />
