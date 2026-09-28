import auxiUrl from "@/assets/auxi.svg"
import { useSessionFlag } from "@/hooks/useSessionFlag"
import { HelpBubble } from "../HelpBubble"
import { BUBBLE_DISMISSED_KEY, HELP_MESSAGE } from "./HelpBot.constants"
import type { HelpBotProps } from "./HelpBot.types"

/** Auxi, the help bot: floats above the bottom navigation, with a dismissible speech bubble. */
export const HelpBot = ({ onOpen }: HelpBotProps) => {
  const [bubbleDismissed, dismissBubble] = useSessionFlag(BUBBLE_DISMISSED_KEY)

  const handleOpen = () => {
    dismissBubble()
    onOpen?.()
  }

  return (
    <div className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-30 flex items-center gap-3 sm:right-6">
      {!bubbleDismissed && <HelpBubble message={HELP_MESSAGE} onOpen={handleOpen} onClose={dismissBubble} />}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Abrir chat de ayuda con Auxi"
        className="size-14 flex-none cursor-pointer rounded-full border-2 border-control-line bg-card p-1 shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none"
      >
        <img src={auxiUrl} alt="" className="size-full" />
      </button>
    </div>
  )
}
