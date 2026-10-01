import { Phone } from "lucide-react"
import type { ChatEmergencyCallsProps } from "./ChatEmergencyCalls.types"

/** Numbers to call straight from the chat (chosen for the situation), lined up with Auxi's bubble */
export const ChatEmergencyCalls = ({ numbers }: ChatEmergencyCallsProps) => (
  <li className="pl-11">
    <ul aria-label="Números para llamar" className="m-0 flex list-none flex-wrap gap-2 p-0">
      {numbers.map(({ number, label }) => (
        <li key={number}>
          <a
            // Digits only: "0800-333-0160" → tel:08003330160
            href={`tel:${number.replace(/\D/g, "")}`}
            aria-label={`Llamar al ${number}, ${label}`}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-alert px-3 py-1.5 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert"
          >
            <Phone aria-hidden="true" className="size-4 flex-none" />
            <b className="text-lg/tight font-extrabold whitespace-nowrap">{number}</b>
            <span className="text-sm font-semibold">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  </li>
)
