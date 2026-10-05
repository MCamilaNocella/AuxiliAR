import { useRef, useState } from "react"
import { AUXI_MOTION_POINT, Auxi } from "@/components/help/Auxi"
import { useIsOverDarkBackground } from "@/hooks/useIsOverDarkBackground"
import { BUBBLE_VARIANTS } from "./AuxiBubbleVariants.constants"
import { BubbleLayer } from "./AuxiBubbleVariants.parts"
import { useBubblePreview } from "./AuxiBubbleVariants.store"

/** The real HelpBot's container is the parent of its button: hidden while the replica takes its place */
const HIDE_REAL_HELP_BOT = `div:has(> button[aria-label="Abrir chat de ayuda con Auxi"]) { display: none !important; }`

/** Replica of HelpBot's floating Auxi (same position, size and layer) with the chosen bubble */
const FloatingStage = ({ variantId }: { variantId: string }) => {
  const variant = BUBBLE_VARIANTS.find(({ id }) => id === variantId)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDark = useIsOverDarkBackground(buttonRef, containerRef, AUXI_MOTION_POINT)
  // Changing the key mounts the bubble again, so its entrance animation replays
  const [shown, setShown] = useState(0)
  const [visible, setVisible] = useState(true)

  if (!variant) return null

  return (
    <>
      <style>{HIDE_REAL_HELP_BOT}</style>
      {/* Same classes as HelpBot's container */}
      <div ref={containerRef} className="fixed right-4 bottom-[calc(var(--bottom-nav-h)+1rem)] z-50 sm:right-6">
        {visible && <BubbleLayer key={shown} variant={variant} onClose={() => setVisible(false)} />}
        <button
          ref={buttonRef}
          type="button"
          // Tapping Auxi pops the bubble out again (the chat does not open in this preview)
          onClick={() => {
            setShown((count) => count + 1)
            setVisible(true)
          }}
          aria-label="Mostrar la burbuja de nuevo (vista previa)"
          className="block size-18 lg:size-22 cursor-pointer rounded-full transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-card motion-reduce:transition-none"
        >
          <Auxi onDark={onDark} className="size-full" />
        </button>
      </div>
    </>
  )
}

/** Mounted once at the root of the router: renders nothing until a variant is chosen */
export const FloatingBubblePreview = () => {
  const variantId = useBubblePreview()
  return variantId ? <FloatingStage key={variantId} variantId={variantId} /> : null
}
