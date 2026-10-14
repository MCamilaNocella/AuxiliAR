/** Flags of the places that answer a filter with another name */
export const FLAG: Record<string, string> = { guard: "guard24", mental: "mental", kids: "kids", prog: "prog" }

const BRAIN =
  '<path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>'

/** The pin of the models: a drop in the brand color with an icon inside (as in the model, the brain icon) */
export const pinHtml = (alt: boolean) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" class="size-[34px] origin-bottom drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)] transition-transform duration-150 in-[.is-selected]:scale-130 motion-reduce:transition-none"><path class="${alt ? "fill-tint-ink-5" : "fill-brand"} stroke-on-category [stroke-width:1.5]" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><g transform="translate(6.8 4.6) scale(0.43)" fill="none" class="stroke-on-category" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${BRAIN}</g></svg>`
