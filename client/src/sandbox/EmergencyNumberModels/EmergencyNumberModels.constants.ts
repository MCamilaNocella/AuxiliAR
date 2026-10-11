import { EMERGENCY_NUMBERS } from "@/data/emergency"
import type { Frame } from "./EmergencyNumberModels.types"

/** The same 6 cards the emergency bar shows */
export const NUMBERS = EMERGENCY_NUMBERS

/*
 * Previews: the cards get exactly the width they have in the real bar, on a 1280px
 * computer (35rem) and a 390px phone (21.9375rem). The frame adds its padding and border on top.
 */
export const NUMBER_FRAMES: Frame[] = [
  { label: "Compu", width: "w-[min(100%,calc(35rem+1.5rem+2px))]" },
  { label: "Celu", width: "w-[min(100%,calc(21.9375rem+1.5rem+2px))]" },
]

/** Same idea for the whole bar: its content width on a 1280px computer (72rem) and a 390px phone (21.875rem) */
export const BAR_FRAMES: Frame[] = [
  { label: "Compu", width: "w-[min(100%,calc(72rem+1.5rem+2px))]" },
  { label: "Celu", width: "w-[min(100%,calc(21.875rem+1.5rem+2px))]" },
]

/** Always 3 per row while they fit (the cards are narrow) */
export const THREE_GRID = "grid-cols-[repeat(auto-fill,minmax(min(100%,max(6.5rem,calc((100%_-_1rem)/3))),1fr))]"

/** Lets "emocional/crisis" wrap after the slash instead of overflowing a narrow card */
export const wrappable = (label: string) => label.replaceAll("/", "/\u200B")
