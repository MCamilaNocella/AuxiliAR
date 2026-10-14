import type { PriorityBannerProps } from "./PriorityBanner.types"

/** A message that stands out, on a hint of the category color: an icon, a title in that color and a bold phrase */
export const PriorityBanner = ({ icon: Icon, title, text }: PriorityBannerProps) => (
  <div className="flex items-center gap-4 rounded-3xl bg-[color-mix(in_srgb,var(--category-mid)_9%,transparent)] px-[1.4rem] py-5 in-data-[theme=dark]:bg-[color-mix(in_srgb,var(--category-light)_14%,transparent)] in-data-[theme=contrast]:bg-surface in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink">
    {Icon && <Icon aria-hidden="true" className="size-9 shrink-0 text-(--category-accent) in-data-[theme=contrast]:text-brand" />}
    <div>
      <h3 className="m-0 text-[1.2rem] font-black text-(--category-accent) in-data-[theme=contrast]:text-brand">{title}</h3>
      <p className="m-0 mt-[0.2rem] text-[1.05rem] leading-[1.35] font-bold">{text}</p>
    </div>
  </div>
)
