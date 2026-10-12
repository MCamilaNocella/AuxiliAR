import { useRef, useState } from "react"
import { useAuxiPreview } from "@/hooks/useAuxiPreview"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import { AUXI_MOTION_POINT, Auxi } from "../Auxi"
import { HelpBubble } from "../HelpBubble"
import { HELP_MESSAGE } from "./HelpBot.constants"
import type { HelpBotProps } from "./HelpBot.types"

/** Auxi, the help bot: floats above the bottom navigation, with a speech bubble that stays until closed. Tapping either one opens the chat. */
export const HelpBot = ({ onOpen }: HelpBotProps) => {
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Auxi floats over the page: its wave lines follow whatever is behind them (e.g. bg-home vs. a card)
  const onDark = useIsOverDarkBackground(buttonRef, containerRef, AUXI_MOTION_POINT)
  // Only set while the "Modelos de Auxi" page is open
  const preview = useAuxiPreview()

  const hideBubble = () => setBubbleVisible(false)

  // The bubble stays until it's closed with its X or the chat is opened
  const handleOpen = () => {
    // The chat gives focus back to whatever had it; the bubble is about to go, so hand it to Auxi first
    buttonRef.current?.focus()
    hideBubble()
    onOpen?.()
  }

  return (
    // z-50: Auxi stays above every other layer (bars, menus, the "Ver mejor" button)
    <div ref={containerRef} className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-50 sm:right-6">
      {/* Above Auxi and a bit to the left, its tail pointing at the head */}
      {bubbleVisible && (
        <div className="absolute right-1/2 bottom-[calc(100%-0.25rem)]">
          <HelpBubble message={HELP_MESSAGE} onOpen={handleOpen} onClose={hideBubble} />
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        aria-label="Abrir chat de ayuda con Auxi"
        // No background: just Auxi. The focus ring gets a card-colored inner ring so it shows on any background
        className="block size-18 lg:size-22 cursor-pointer rounded-full transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-card motion-reduce:transition-none"
      >
        <Auxi onDark={onDark} className="size-full" {...preview} />
      </button>
    </div>
  )
}
