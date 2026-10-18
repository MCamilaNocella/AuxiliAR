import { HandHeart } from "lucide-react"
import { helpChatStore } from "@/stores/helpChatStore"

/**
 * In the header, next to "Ajustes": opens Auxi's chat, where Auxi asks whether they want to talk with a volunteer.
 * Soft brand background with the corners of Mi Salud's buttons; "con alguien?" on a second line on phones, only the
 * icon on the narrowest (screen readers always get the whole question).
 */
export const TalkToSomeoneButton = () => (
  <button
    type="button"
    onClick={helpChatStore.askAboutPerson}
    aria-haspopup="dialog"
    className="flex min-h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-soft px-3 py-1 font-bold text-brand transition-colors max-[22.5rem]:px-2.5 hover:bg-brand hover:text-on-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
  >
    <HandHeart aria-hidden="true" className="size-5 flex-none" />
    {/* Phones: "con alguien?" goes under "¿Querés hablar" */}
    <span className="flex flex-col text-left text-sm/tight max-[22.5rem]:sr-only sm:block sm:text-base">
      <span>¿Querés hablar</span> <span>con alguien?</span>
    </span>
  </button>
)
