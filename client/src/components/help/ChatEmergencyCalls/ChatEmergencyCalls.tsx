import { Phone } from "lucide-react"
import { GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
import { callButton, callButtonDetail, callButtonLabel, uncheckedNotice } from "@/utils/helpLines"
import type { ChatEmergencyCallsProps } from "./ChatEmergencyCalls.types"

/**
 * Numbers to call straight from the chat (chosen for the situation), lined up with Auxi's bubble. Each button says what the
 * verified help lines say about its number: where it works, when it answers if it is not all day, and that it is free only if
 * that is recorded. A number that is not in the lines (the server's table still has a few by hand) is shown, and said not to be
 * verified. The numbers that nobody has checked again since their review date are named once, above the buttons (so it is read first).
 */
export const ChatEmergencyCalls = ({ numbers }: ChatEmergencyCallsProps) => {
  const buttons = numbers.map(({ number, label }) => callButton(number, label))
  const notice = uncheckedNotice(buttons, GENERAL_EMERGENCY_NUMBER)
  return (
    <li className="pl-11">
      {notice && (
        <p className="m-0 mb-2 text-sm text-ink-soft">
          <span aria-hidden="true">* </span>
          {notice}
        </p>
      )}
      <ul aria-label="Números para llamar" className="m-0 flex list-none flex-wrap gap-2 p-0">
        {buttons.map((button) => (
          <li key={button.dial}>
            <a
              // Digits only: "0800-333-0160" → tel:08003330160
              href={`tel:${button.dial}`}
              aria-label={callButtonLabel(button)}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-alert px-3 py-1.5 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert"
            >
              <Phone aria-hidden="true" className="size-4 flex-none" />
              <b className="text-lg/tight font-extrabold whitespace-nowrap">
                {button.number}
                {button.stale && <span aria-hidden="true">*</span>}
              </b>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{button.label}</span>
                {callButtonDetail(button) && <span className="text-xs/tight font-semibold">{callButtonDetail(button)}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </li>
  )
}
