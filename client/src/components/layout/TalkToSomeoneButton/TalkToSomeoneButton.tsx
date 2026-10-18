import { HandHeart } from "lucide-react"
import { helpChatStore } from "@/stores/helpChatStore"
import type { TalkToSomeoneButtonProps } from "./TalkToSomeoneButton.types"

const LABEL = "¿Querés hablar con alguien?"

const COLORS =
  "cursor-pointer bg-brand-soft font-bold text-brand transition-colors hover:bg-brand hover:text-on-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"

/**
 * In the header, next to "Ajustes": opens Auxi's chat, where Auxi asks whether they want to talk with a volunteer.
 * Soft brand background with the corners of Mi Salud's buttons; "con alguien?" on a second line on phones. Measured on
 * the header (a container, in rem, so it follows the text size): with little room it drops the icon, and with less it
 * goes under the header, full width, a bit less tall, the question on one line. Screen readers get it all always.
 * `iconOnly`: the square one (same corners) the header shows next to the gear once that one has scrolled away.
 */
export const TalkToSomeoneButton = ({ iconOnly = false }: TalkToSomeoneButtonProps) =>
  iconOnly ? (
    <button
      type="button"
      onClick={helpChatStore.askAboutPerson}
      aria-haspopup="dialog"
      aria-label={LABEL}
      title={LABEL}
      className={`grid size-11 flex-none place-items-center rounded-lg ${COLORS}`}
    >
      <HandHeart aria-hidden="true" className="size-5" />
    </button>
  ) : (
    <button
      type="button"
      onClick={helpChatStore.askAboutPerson}
      aria-haspopup="dialog"
      className={`flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 @max-header-row:min-h-9 @max-header-row:w-full @max-header-row:justify-center @max-header-row:py-0.5 ${COLORS}`}
    >
      <HandHeart aria-hidden="true" className="size-5 flex-none @max-header-icon:hidden" />
      {/* Phones: "con alguien?" goes under "¿Querés hablar"; on its own row, all on one line */}
      <span className="flex flex-col text-left text-sm/tight @max-header-row:block @[36rem]:block @[36rem]:text-base">
        <span>¿Querés hablar</span> <span>con alguien?</span>
      </span>
    </button>
  )
