import { useRef, useState } from "react"
import { X } from "lucide-react"
import { AUXI_MOTION_POINT, Auxi } from "@/components/help/Auxi"
import { HELP_MESSAGE } from "@/components/help/HelpBot/HelpBot.constants"
import { HelpBubble } from "@/components/help/HelpBubble"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import type { BubbleVariant } from "./AuxiBubbleVariants.types"

/*
 * Sketch copy of HelpBubble's markup (same classes) with the options being compared.
 * Where a class differs from the real one, it is marked "DIFF". If HelpBubble changes, copy it here.
 * Variant 1 uses the real HelpBubble instead.
 */
const SketchBubble = ({ compact = false, inverted = false, onClose }: { compact?: boolean, inverted?: boolean, onClose: () => void }) => (
  <div
    className={`relative w-max origin-bottom-right animate-bubble-in rounded-2xl border px-3.5 py-2 shadow-[0_6px_20px_rgba(0,0,0,.28)] motion-reduce:animate-none in-data-[theme=contrast]:border-2 ${
      // Same max width as the real one; when compact the width is set by the two lines (w-max), see the line break below
      "max-w-[calc(100vw-5rem)]"
    } ${
      // DIFF when inverted: ink background and card text; high contrast keeps the real colors
      inverted
        ? "border-ink bg-ink text-card in-data-[theme=contrast]:border-control-line in-data-[theme=contrast]:bg-card in-data-[theme=contrast]:text-ink"
        : "border-control-line bg-card text-ink"
    }`}
  >
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      className="cursor-pointer text-left text-base/snug font-bold wrap-break-word"
    >
      {/* DIFF when compact: explicit line break after the comma, so the bubble is as wide as its longest line (no spare space on the right) */}
      {compact ? (
        <>
          {HELP_MESSAGE.slice(0, HELP_MESSAGE.indexOf(",") + 1)}
          <br />
          {HELP_MESSAGE.slice(HELP_MESSAGE.indexOf(",") + 2)}
        </>
      ) : (
        HELP_MESSAGE
      )}
    </button>
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar mensaje"
      // DIFF when inverted: the badge swaps colors so it does not blend with the bubble (not in high contrast)
      className={`absolute -top-2.5 -left-2.5 flex size-6.5 cursor-pointer items-center justify-center rounded-full border-2 shadow-[0_2px_6px_rgba(0,0,0,.35)] transition-colors ${
        inverted
          ? "border-ink bg-card text-ink hover:bg-field in-data-[theme=contrast]:border-card in-data-[theme=contrast]:bg-ink in-data-[theme=contrast]:text-card in-data-[theme=contrast]:hover:bg-ink-soft"
          : "border-card bg-ink text-card hover:bg-ink-soft"
      }`}
    >
      <X aria-hidden="true" className="stroke-3 size-3.5" />
    </button>
    <span
      aria-hidden="true"
      className={`absolute right-4 -bottom-1.5 size-3 rotate-45 border-r border-b in-data-[theme=contrast]:-bottom-2 in-data-[theme=contrast]:border-r-2 in-data-[theme=contrast]:border-b-2 ${
        inverted
          ? "border-ink bg-ink in-data-[theme=contrast]:border-control-line in-data-[theme=contrast]:bg-card"
          : "border-control-line bg-card"
      }`}
    />
  </div>
)

/** The bubble of a variant, placed above Auxi's box as HelpBot places it (real HelpBubble for variant 1) */
export const BubbleLayer = ({ variant, onClose }: { variant: BubbleVariant, onClose: () => void }) => (
  <div
    // DIFF in "air": bottom-[calc(100%+0.25rem)] instead of the real bottom-[calc(100%-0.25rem)]
    className={`absolute right-1/2 ${variant.air ? "bottom-[calc(100%+0.25rem)]" : "bottom-[calc(100%-0.25rem)]"}`}
  >
    {variant.real ? (
      <HelpBubble message={HELP_MESSAGE} onOpen={() => {}} onClose={onClose} />
    ) : (
      <SketchBubble compact={variant.compact} inverted={variant.inverted} onClose={onClose} />
    )}
  </div>
)

/**
 * Auxi (real) with a bubble above it, placed as HelpBot places it: container at the bottom right,
 * bubble's right edge at the center of Auxi's box. Closing hides the bubble; the button pops it out again.
 */
export const BubbleStage = ({ variant, withCard }: { variant: BubbleVariant, withCard: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const robotRef = useRef<HTMLDivElement>(null)
  const onDark = useIsOverDarkBackground(robotRef, containerRef, AUXI_MOTION_POINT)
  // Changing the key mounts the bubble again, so its entrance animation replays
  const [shown, setShown] = useState(0)
  const [visible, setVisible] = useState(true)
  const close = () => setVisible(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 p-3">
        {/* Room above for the bubble */}
        <div className={`relative min-h-60 ${withCard ? "rounded-2xl border border-line bg-card p-4 text-ink" : ""}`}>
          {withCard && (
            <>
              <p className="m-0 text-lg font-extrabold">Mis recursos</p>
              <p className="m-0 text-sm text-muted">Donaciones, derechos y trámites</p>
            </>
          )}
          <div ref={containerRef} className="absolute right-4 bottom-4">
            {visible && <BubbleLayer key={shown} variant={variant} onClose={close} />}
            <div ref={robotRef} className="size-18 lg:size-22">
              <Auxi onDark={onDark} className="size-full" />
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setShown((count) => count + 1)
          setVisible(true)
        }}
        className="mb-3 ml-3 cursor-pointer self-start rounded-full bg-card px-3 py-1 text-sm font-bold text-ink shadow-sm"
      >
        Ver la burbuja de nuevo
      </button>
    </div>
  )
}
