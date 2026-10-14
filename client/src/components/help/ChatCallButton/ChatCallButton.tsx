import { Phone } from "lucide-react"
import { GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
import { telHref } from "@/utils/helpLines"

/** The emergency number, always at hand at the top of a chat: it calls straight away */
export const ChatCallButton = () => (
  <a
    href={telHref(GENERAL_EMERGENCY_NUMBER)}
    aria-label={`Llamar al ${GENERAL_EMERGENCY_NUMBER}, emergencias`}
    className="flex min-h-11 flex-none items-center gap-1.5 rounded-lg bg-alert px-3 text-base font-extrabold text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert"
  >
    <Phone aria-hidden="true" className="size-4.5 flex-none" />
    {GENERAL_EMERGENCY_NUMBER}
  </a>
)
