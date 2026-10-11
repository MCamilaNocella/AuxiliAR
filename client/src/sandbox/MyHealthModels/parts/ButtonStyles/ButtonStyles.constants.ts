import type { ButtonStyle } from "./ButtonStyles.types"

const base = "inline-flex min-h-10 cursor-pointer items-center gap-2 px-4 py-2 text-sm font-bold transition-colors"
const rowBase = "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left text-sm font-bold transition-colors"

/** Button styles to choose from (none of them pill-shaped). Theme tokens only, so they follow the 3 themes */
export const BUTTON_STYLES: ButtonStyle[] = [
  {
    id: "soft",
    name: "3 · Fondo suave, sin borde",
    description: "Rellenos con un tono clarito, sin bordes. Amables y blandos a la vista.",
    primary: `${base} rounded-lg bg-brand text-on-brand hover:bg-brand-dark`,
    secondary: `${base} rounded-lg bg-brand-soft text-brand hover:bg-field`,
    row: `${rowBase} rounded-lg bg-field text-ink hover:bg-brand-soft hover:text-brand`,
    chipOn: `${base} rounded-lg bg-brand-soft text-brand ring-2 ring-brand`,
    chipOff: `${base} rounded-lg bg-field text-ink hover:bg-brand-soft`,
  },
  {
    id: "ghost",
    name: "4 · Sin borde ni fondo",
    description: "Solo texto e ícono en bordó; el fondo aparece al pasar el mouse. Lo más limpio.",
    primary: `${base} rounded-md bg-brand text-on-brand hover:bg-brand-dark`,
    secondary: `${base} rounded-md bg-transparent text-brand hover:bg-brand-soft`,
    row: `${rowBase} rounded-md bg-transparent text-ink hover:bg-field hover:text-brand`,
    chipOn: `${base} rounded-md bg-transparent text-brand underline decoration-2 underline-offset-8`,
    chipOff: `${base} rounded-md bg-transparent text-muted hover:text-ink`,
  },
  {
    id: "link",
    name: "8 · Tipo link",
    description: "Las acciones secundarias como texto subrayado; solo la principal es un botón.",
    primary: `${base} rounded-lg bg-brand text-on-brand hover:bg-brand-dark`,
    secondary: `${base} rounded-sm bg-transparent px-1 text-brand underline underline-offset-4 hover:text-brand-dark`,
    row: `${rowBase} rounded-none border-b border-line-strong bg-transparent px-1 text-ink hover:text-brand`,
    chipOn: `${base} rounded-sm bg-transparent px-1 text-brand underline decoration-2 underline-offset-8`,
    chipOff: `${base} rounded-sm bg-transparent px-1 text-ink hover:text-brand`,
  },
]
