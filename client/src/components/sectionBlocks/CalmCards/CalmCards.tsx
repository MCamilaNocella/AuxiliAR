import type { CalmCardsProps } from "./CalmCards.types"

/**
 * The app's own inks (brand maroon, blue, green, the category color) on a see-through wash of the same color, so the cards sit
 * well on the light and the dark background; yellow on black in high contrast
 */
const INKS = [
  "[--ti:var(--color-brand)] in-data-[theme=dark]:[--ti:var(--color-tint-ink-1)]",
  "[--ti:var(--color-tint-ink-2)]",
  "[--ti:var(--color-tint-ink-4)]",
  "[--ti:var(--category-mid)] in-data-[theme=dark]:[--ti:#a9b6ff]",
]

/** Short exercises as colored cards: an icon, the name, when it helps and its numbered steps */
export const CalmCards = ({ items }: CalmCardsProps) => (
  <ul role="list" className="m-0 grid list-none gap-4 p-0 @[34rem]:grid-cols-2">
    {items.map(({ icon: Icon, title, when, steps }, k) => (
      <li
        key={title}
        className={`grid content-start gap-[0.6rem] rounded-3xl bg-[color-mix(in_srgb,var(--ti)_10%,transparent)] px-5 py-[1.35rem] text-(--ti) in-data-[theme=contrast]:bg-black in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-white in-data-[theme=contrast]:[--ti:#ff0] in-data-[theme=dark]:bg-[color-mix(in_srgb,var(--ti)_14%,transparent)] ${INKS[k % INKS.length]}`}
      >
        {Icon && <Icon aria-hidden="true" className="size-8" />}
        <h3 className="m-0 text-[1.3rem] leading-[1.2] font-black">{title}</h3>
        <p className="m-0 text-[1.05rem] font-extrabold text-ink">{when}</p>
        <ol className="m-0 mt-[0.35rem] grid list-decimal gap-[0.4rem] pl-[1.4rem] text-ink marker:font-black marker:text-(--ti)">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </li>
    ))}
  </ul>
)
