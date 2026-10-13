/** Items shown at once; the rest are reached by scrolling the list */
export const VISIBLE_STEPS = 3

/** How long a just-completed item stays, with its check, before it goes (= the step-done animation in index.css) */
export const DONE_VISIBLE_MS = 3200

/** Several completed at once: each one's check comes this long after the previous one's */
export const DONE_STAGGER_MS = 700

/** A completed item rising to the top over the rest (and the rest making room): calm, not slow */
export const MOVE_MS = 700
export const MOVE_EASING = "cubic-bezier(0.45, 0, 0.2, 1)"
