/** Same breakpoint as Tailwind's lg: from here on the sections are a fixed column instead of a drawer */
export const DESKTOP_QUERY = "(min-width: 64rem)"

/** Who opened the sections drawer: the auto-open (first category of the visit) doesn't move focus */
export type DrawerState = "closed" | "user" | "auto"
