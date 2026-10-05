import { useRef, useState } from "react"
import { useAuxiPreview } from "@/hooks/useAuxiPreview"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import { AUXI_MOTION_POINT, Auxi } from "../Auxi"
import { HelpBubble } from "../HelpBubble"
import { HELP_LABEL, HELP_MESSAGE } from "./HelpBot.constants"
import type { HelpBotProps } from "./HelpBot.types"

/** Center of the "Auxi" label, as a fraction of its own box (where its background is sampled) */
const LABEL_CENTER = { x: 0.5, y: 0.5 }

/** Auxi, the help bot: floats above the bottom navigation, with a speech bubble that stays until closed. Tapping either one opens the chat. */
export const HelpBot = ({ onOpen }: HelpBotProps) => {
  const [bubbleVisible, setBubbleVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Auxi floats over the page: its wave lines follow whatever is behind them (e.g. bg-home vs. a card)
  const onDark = useIsOverDarkBackground(buttonRef, containerRef, AUXI_MOTION_POINT)
  // The label sits elsewhere, so it samples the background right behind itself
  const labelRef = useRef<HTMLSpanElement>(null)
  const labelOnDark = useIsOverDarkBackground(labelRef, containerRef, LABEL_CENTER)
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
    <div ref={containerRef} className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1.5rem)] z-50 sm:right-6">
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
      {/*
        Visual only (the button already has its aria-label), out of the flow so Auxi does not move.
        Centered on Auxi's body/head (~62% of the box: the raised hand and wave lines pull the box center to the left).
        Color follows the background right behind the label: light text on dark/colored areas (no shadow),
        text-ink with a faint card-colored shadow on light ones.
      */}
      <span
        ref={labelRef}
        aria-hidden="true"
        className={`pointer-events-none absolute top-full left-[62%] mt-0.5 -translate-x-1/2 font-sans text-sm/none font-extrabold select-none ${
          labelOnDark ? "text-on-home" : "text-ink [text-shadow:0_0_3px_var(--color-card)]"
        }`}
      >
        {HELP_LABEL}
      </span>
    </div>
  )
}
