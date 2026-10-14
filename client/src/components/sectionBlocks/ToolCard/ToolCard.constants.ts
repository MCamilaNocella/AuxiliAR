/** The buttons of the self-care tools, as in Mi Salud: barely rounded corners, small bold text; the main one in the brand */
export const TOOL_BUTTON =
  "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-brand px-3.5 py-1.5 text-sm font-bold text-on-brand no-underline hover:bg-brand-dark hover:text-on-brand disabled:cursor-default disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0"

/** ...and the rest, on the field */
export const TOOL_BUTTON_GHOST =
  "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-field px-3.5 py-1.5 text-sm font-bold text-ink no-underline enabled:hover:bg-brand-soft disabled:cursor-default disabled:opacity-45 in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)] [&_svg]:size-4 [&_svg]:shrink-0"

/** A toggle among options (which exercise, how to see it): pressed in the brand */
export const TOOL_TOGGLE = `${TOOL_BUTTON_GHOST} aria-pressed:bg-brand aria-pressed:text-on-brand aria-pressed:hover:bg-brand-dark`
