/** The exercise counted in minutes instead of cycles (10 seconds per cycle, 5 minutes) */
export const MINUTES_MODE = "slow"
export const MINUTES = 5

/** The bubble: soft shine spots over a see-through wash of the category color */
export const BALL =
  "absolute inset-0 rounded-full border border-white/55 [background:radial-gradient(circle_at_30%_26%,rgb(255_255_255/0.95)_0_6%,rgb(255_255_255/0)_13%),radial-gradient(circle_at_70%_78%,rgb(255_255_255/0.45)_0_4%,rgb(255_255_255/0)_10%),radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--b)_8%,transparent)_45%,color-mix(in_srgb,var(--b)_38%,transparent)_100%)] shadow-[inset_0.5rem_-0.4rem_1rem_color-mix(in_srgb,#2ec4b6_30%,transparent),inset_-0.5rem_0.5rem_1rem_color-mix(in_srgb,var(--b)_35%,transparent),0_0.75rem_1.5rem_-0.75rem_color-mix(in_srgb,var(--b)_60%,transparent)] transition-transform ease-in-out motion-reduce:transition-none in-data-[theme=contrast]:border-3 in-data-[theme=contrast]:border-[#ff0] in-data-[theme=contrast]:bg-black in-data-[theme=contrast]:[background:#000] in-data-[theme=contrast]:shadow-none"

/** A little floating bubble next to the big one */
export const FLOATER =
  "absolute animate-bg-float rounded-full [background:radial-gradient(circle_at_32%_30%,rgb(255_255_255/0.9)_0_12%,transparent_14%),color-mix(in_srgb,var(--b)_14%,transparent)] shadow-[inset_0_0_0.4rem_color-mix(in_srgb,var(--b)_45%,transparent)] motion-reduce:animate-none in-data-[theme=contrast]:hidden"

/** Auxi's happy face (closed ^^ eyes, brows and a smile), traced from the reference and placed on its eyes with the head's tilt */
export const HAPPY_FACE_PATHS = ["M14.5 36Q22 27.5 28.5 33.5", "M47.5 31.5Q54 25 62 32.5", "M16.5 48.5Q23 38.5 29.5 48", "M48 46Q54.5 35.5 60.5 45.5"]
export const HAPPY_SMILE = "M32 54.8C34 58.5 42 58.5 46.5 52.5"
