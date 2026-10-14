import { PetsArt } from "@/components/illustrations/PetsArt"
import type { PictureBannerProps } from "./PictureBanner.types"

/** A message with the dog and cat drawing, on a hint of the category color (on narrow screens the drawing goes on top) */
export const PictureBanner = ({ title, text }: PictureBannerProps) => (
  <div className="flex items-center gap-5 rounded-3xl bg-[color-mix(in_srgb,var(--category-mid)_9%,transparent)] px-[1.4rem] py-4 max-[30rem]:flex-col max-[30rem]:items-start in-data-[theme=dark]:bg-[color-mix(in_srgb,var(--category-light)_14%,transparent)] in-data-[theme=contrast]:bg-surface in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink">
    <PetsArt className="h-auto w-[9.5rem] shrink-0 max-[30rem]:w-32" />
    <div>
      <h3 className="m-0 text-[1.2rem] font-black text-(--category-accent) in-data-[theme=contrast]:text-brand">{title}</h3>
      <p className="m-0 mt-[0.2rem] text-[1.05rem] leading-[1.35] font-bold">{text}</p>
    </div>
  </div>
)
