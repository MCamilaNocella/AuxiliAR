/** Buttons on the red band (Editar / Cancelar) */
export const BAND_BUTTON =
  "flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-on-alert/15 px-3.5 py-1.5 text-sm font-bold text-on-alert transition-colors hover:bg-on-alert/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"

/** Buttons under the tiles (Mostrar en pantalla completa / Imprimir) */
export const ACTION_BUTTON =
  "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-soft px-4 py-1.5 text-sm font-bold text-brand transition-colors hover:bg-field in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"

/** 2 tiles per row while they fit (1 with very big text) */
export const TILES_GRID = "grid grid-cols-[repeat(auto-fill,minmax(max(min(100%,7rem),calc((100%-0.75rem)/2)),1fr))] gap-3"

/** Edit mode: 2 inputs per row only when each gets ~12rem; on a phone, one below the other so they're easy to fill in */
export const EDIT_GRID = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,12rem),1fr))] gap-3"

/**
 * Inputs in edit mode: a thin border that only changes color on focus (no glow, no global outline).
 * High contrast adds a solid ring, since that theme needs it.
 */
export const INPUT =
  "mt-1 block w-full min-w-0 rounded-lg border border-line-strong bg-field px-2 py-0.5 text-base font-bold text-ink transition-colors placeholder:font-normal placeholder:text-muted focus:border-brand focus-visible:outline-none in-data-[theme=contrast]:focus:ring-2 in-data-[theme=contrast]:focus:ring-brand"

/** Texts of the confirmation over the card */
export const CONFIRM_TEXTS = {
  save: { title: "¿Guardar cambios?", message: "Se van a actualizar los datos de tu ficha.", confirmLabel: "Guardar" },
  cancel: { title: "¿Cancelar cambios?", message: "Lo que escribiste no se va a guardar.", confirmLabel: "Sí, cancelar" },
} as const
