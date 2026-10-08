/** Same breakpoint as Tailwind's lg: from here on the sections are a fixed column instead of a drawer */
export const DESKTOP_QUERY = "(min-width: 64rem)"

/** Up to this many sections are shown as tabs on small screens; more go in the drawer */
export const MAX_TABS = 3

/** Who opened the sections drawer: the auto-open (first category of the visit) doesn't move focus */
export type DrawerState = "closed" | "user" | "auto"
