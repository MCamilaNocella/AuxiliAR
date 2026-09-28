import { useEffect, useRef, useState } from "react"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import { AUXI_MOTION_POINT, Auxi } from "../Auxi"
import { HelpBubble } from "../HelpBubble"
import { BUBBLE_VISIBLE_MS, HELP_MESSAGE } from "./HelpBot.constants"
import type { HelpBotProps } from "./HelpBot.types"

/** Auxi, the help bot: floats above the bottom navigation, with a speech bubble that shows for a few seconds on load. */
export const HelpBot = ({ onOpen }: HelpBotProps) => {
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Auxi floats over the page: its wave lines follow whatever is behind them (e.g. bg-home vs. a card)
  const onDark = useIsOverDarkBackground(buttonRef, containerRef, AUXI_MOTION_POINT)

  useEffect(() => {
    const timer = setTimeout(() => setBubbleVisible(false), BUBBLE_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [])

  const hideBubble = () => setBubbleVisible(false)

  const handleOpen = () => {
    hideBubble()
    onOpen?.()
  }

  return (
    <div ref={containerRef} className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-30 flex items-center gap-3 sm:right-6">
      {bubbleVisible && <HelpBubble message={HELP_MESSAGE} onOpen={handleOpen} onClose={hideBubble} />}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        aria-label="Abrir chat de ayuda con Auxi"
        // No background: just Auxi. The focus ring gets a card-colored inner ring so it shows on any background
        className="size-14 flex-none lg:size-18 cursor-pointer rounded-full transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-card motion-reduce:transition-none"
      >
        <Auxi onDark={onDark} className="size-full" />
      </button>
    </div>
  )
}
