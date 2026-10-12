import { CARD_FIELDS } from "@/data/myHealth"
import type { CardFieldKey } from "@/types/myHealth"

/** Buttons on the red band (Editar / Cancelar) */
export const BAND_BUTTON =
  "flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-on-alert/15 px-3.5 py-1.5 text-sm font-bold text-on-alert transition-colors hover:bg-on-alert/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"

/** Whatever appears when switching between showing and editing (tiles, band buttons) fades in calmly */
export const CALM_IN = "animate-calm-in motion-reduce:animate-none"

/** "Agregar perfil" on the band when there's no profile: brand colored like Auxi's button, to stand out */
export const ADD_PROFILE_BUTTON =
  "flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"

/** Buttons under the tiles (Mostrar en pantalla completa / Descargar) */
export const ACTION_BUTTON =
  "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-soft px-4 py-1.5 text-sm font-bold text-brand transition-colors hover:bg-field in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"

/** 2 tiles per row while they fit (1 with very big text). The same in edit mode, so the card keeps its shape */
export const TILES_GRID = "grid grid-cols-[repeat(auto-fill,minmax(max(min(100%,7rem),calc((100%-0.75rem)/2)),1fr))] gap-3"

/**
 * Inputs in edit mode: the same size and type as the value they replace (the tile doesn't change shape), with a
 * thin line underneath drawn as an inset shadow (it takes no room) that turns brand colored and thicker on focus.
 * At least 16px: prevents iOS from auto-zooming on focus. Full width of its column
 */
export const INPUT =
  "block min-w-0 border-0 bg-transparent p-0 text-lg font-extrabold text-ink shadow-[inset_0_-1px_0_var(--color-line-strong)] transition-shadow duration-300 placeholder:font-normal placeholder:text-muted focus:shadow-[inset_0_-2px_0_var(--color-brand)] focus-visible:outline-none"

/** Edit mode, name and age side by side in their tile: the age column just wide enough for "Edad" and 3 digits */
export const INPUT_WIDTH: Partial<Record<CardFieldKey, string>> = { age: "w-14 flex-none" }

/** The card's tiles: name and age share the first one; the rest, one each, in the card's order */
export const CARD_TILES: { label: string; keys: CardFieldKey[] }[] = [
  { label: "Nombre y edad", keys: ["name", "age"] },
  ...CARD_FIELDS.filter(({ key }) => key !== "name" && key !== "age").map(({ key, label }) => ({ label, keys: [key] })),
]

/** Texts of the confirmation over the card */
export const CONFIRM_TEXTS = {
  save: { title: "¿Guardar cambios?", message: "Se van a actualizar los datos de tu ficha.", confirmLabel: "Guardar" },
  cancel: { title: "¿Cancelar cambios?", message: "Lo que escribiste no se va a guardar.", confirmLabel: "Sí, cancelar" },
} as const
