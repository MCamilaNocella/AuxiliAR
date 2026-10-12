/** Longest name accepted (the chips and the greeting have to fit it) */
export const MAX_NAME_LENGTH = 40

export const ERRORS = {
  name: "Escribí el nombre.",
  age: "Escribí una edad en años, entre 1 y 130.",
}

/** Thin border that turns brand on focus, like the card's inputs; red when the data is wrong */
export const INPUT =
  "mt-1 block w-full min-w-0 rounded-lg border border-line-strong bg-field px-3 py-2 text-base text-ink transition-colors placeholder:text-muted focus:border-brand focus-visible:outline-none aria-invalid:border-alert in-data-[theme=contrast]:focus:ring-2 in-data-[theme=contrast]:focus:ring-brand"
