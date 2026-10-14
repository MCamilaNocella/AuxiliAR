import { HandHeart } from "lucide-react"
import { helpChatStore } from "@/stores/helpChatStore"

/** In the header, next to "Ajustes": opens Auxi's chat, where Auxi asks whether they want to talk with a volunteer */
export const TalkToSomeoneButton = () => (
  <button
    type="button"
    onClick={helpChatStore.askAboutPerson}
    aria-haspopup="dialog"
    className="flex min-h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-soft px-3.5 font-bold max-[22.5rem]:px-2.5 text-brand transition-colors hover:bg-brand hover:text-on-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
  >
    <HandHeart aria-hidden="true" className="size-5 flex-none" />
    {/* On phones the whole question doesn't fit next to the logo: a short one, and only the icon on the narrowest
        (screen readers always get the whole question) */}
    <span className="max-[22.5rem]:hidden sm:hidden" aria-hidden="true">
      ¿Hablamos?
    </span>
    <span className="sr-only sm:not-sr-only">¿Necesitás hablar con alguien?</span>
  </button>
)
