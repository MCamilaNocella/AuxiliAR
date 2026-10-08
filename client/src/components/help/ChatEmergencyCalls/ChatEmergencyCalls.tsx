import { Phone } from "lucide-react"
import { callButton, callButtonLabel } from "@/utils/helpLines"
import type { ChatEmergencyCallsProps } from "./ChatEmergencyCalls.types"

/**
 * Numbers to call straight from the chat (chosen for the situation), lined up with Auxi's bubble. Each button says what the
 * verified help lines say about its number: where it works, when it answers if it is not all day, and when nobody has checked it
 * again since its review date. A number that is not in the lines (the server's table still has a few by hand) is shown as it comes.
 */
export const ChatEmergencyCalls = ({ numbers }: ChatEmergencyCallsProps) => (
  <li className="pl-11">
    <ul aria-label="Números para llamar" className="m-0 flex list-none flex-wrap gap-2 p-0">
      {numbers.map(({ number, label }) => {
        const button = callButton(number, label)
        const detail = [button.scope, button.hours ? `de ${button.hours}` : undefined].filter(Boolean).join(" · ")
        return (
          <li key={button.dial}>
            <a
              // Digits only: "0800-333-0160" → tel:08003330160
              href={`tel:${button.dial}`}
              aria-label={callButtonLabel(button)}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-alert px-3 py-1.5 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert"
            >
              <Phone aria-hidden="true" className="size-4 flex-none" />
              <b className="text-lg/tight font-extrabold whitespace-nowrap">{button.number}</b>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{button.label}</span>
                {detail && <span className="text-xs/tight font-semibold">{detail}</span>}
                {button.stale && <span className="text-xs/tight font-bold underline decoration-dotted">sin nueva comprobación</span>}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  </li>
)
