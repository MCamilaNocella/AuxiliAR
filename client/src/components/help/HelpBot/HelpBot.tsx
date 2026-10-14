import { useLayoutEffect, useRef, useState } from "react"
import { useAuxiPreview } from "@/hooks/useAuxiPreview"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import { useLongPressDrag } from "@/hooks/useLongPressDrag"
import { AUXI_MOTION_POINT, Auxi } from "../Auxi"
import { HelpBubble } from "../HelpBubble"
import { HELP_BOT_POSITION_KEY, HELP_MESSAGE } from "./HelpBot.constants"
import type { HelpBotProps } from "./HelpBot.types"

/**
 * Auxi, the help bot: floats above the bottom navigation, with a speech bubble that stays until closed. Tapping either one opens the chat.
 * Keeping Auxi pressed a moment lets it be dragged anywhere on the screen (remembered in this browser).
 */
export const HelpBot = ({ onOpen }: HelpBotProps) => {
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  // Auxi and its bubble both stay on screen; sideways only Auxi counts, since the bubble flips to the roomier side
  const { offset, dragging, handlers } = useLongPressDrag([buttonRef, bubbleRef], HELP_BOT_POSITION_KEY, [buttonRef])
  // On the left half of the screen the bubble goes to Auxi's right, so it doesn't fall off the edge
  const [bubbleSide, setBubbleSide] = useState<"left" | "right">("left")
  // Auxi floats over the page: its wave lines follow whatever is behind them (e.g. bg-home vs. a card)
  const onDark = useIsOverDarkBackground(buttonRef, containerRef, AUXI_MOTION_POINT)
  // Only set while the "Modelos de Auxi" page is open
  const preview = useAuxiPreview()

  const hideBubble = () => setBubbleVisible(false)

  useLayoutEffect(() => {
    const pick = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) setBubbleSide(rect.left + rect.width / 2 < window.innerWidth / 2 ? "right" : "left")
    }
    pick()
    window.addEventListener("resize", pick)
    return () => window.removeEventListener("resize", pick)
  }, [offset])

  // The bubble stays until it's closed with its X or the chat is opened
  const handleOpen = () => {
    // The chat gives focus back to whatever had it; the bubble is about to go, so hand it to Auxi first
    buttonRef.current?.focus()
    hideBubble()
    onOpen?.()
  }

  return (
    // z-50: Auxi stays above every other layer (bars, menus, the "Ver mejor" button)
    <div
      ref={containerRef}
      className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-50 sm:right-6"
      style={{ translate: `${offset.x}px ${offset.y}px` }}
    >
      {/* Above Auxi and a bit to one side, its tail pointing at the head */}
      {bubbleVisible && (
        <div
          ref={bubbleRef}
          className={`absolute bottom-[calc(100%-0.25rem)] ${bubbleSide === "left" ? "right-1/2" : "left-1/2"}`}
        >
          <HelpBubble message={HELP_MESSAGE} onOpen={handleOpen} onClose={hideBubble} side={bubbleSide} />
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        {...handlers}
        aria-label="Abrir chat de ayuda con Auxi"
        // No background: just Auxi. The focus ring gets a card-colored inner ring so it shows on any background.
        // touch-none + select-none: a long press drags Auxi instead of scrolling the page or selecting it
        className={`block size-18 lg:size-22 touch-none select-none rounded-full transition-transform [-webkit-touch-callout:none] focus-visible:ring-3 focus-visible:ring-card motion-reduce:transition-none ${dragging ? "scale-110 cursor-grabbing drop-shadow-[0_8px_12px_rgba(0,0,0,.35)]" : "cursor-pointer hover:scale-105"}`}
      >
        <Auxi onDark={onDark} className="size-full" {...preview} />
      </button>
    </div>
  )
}
