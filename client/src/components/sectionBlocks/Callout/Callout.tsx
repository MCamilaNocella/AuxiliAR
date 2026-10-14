import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { CalloutProps } from "./Callout.types"

const TONES = {
  soft: "bg-field",
  brand: "bg-[color-mix(in_srgb,var(--category-light)_10%,transparent)]",
  alert: "bg-alert-soft",
}

const TITLES = {
  soft: "",
  brand: "text-(--category-mid) in-data-[theme=dark]:text-(--category-light) in-data-[theme=contrast]:text-ink",
  alert: "text-alert-text",
}

/** A box that stands out from the text: something to keep in mind or to do (no border: only its background) */
export const Callout = ({ tone = "soft", id, title, icon: Icon, children }: CalloutProps) => (
  <div id={id ? `part-${id}` : undefined} tabIndex={id ? -1 : undefined} className={`grid gap-2 rounded-[1.25rem] px-5 py-[1.1rem] focus:outline-none [&_ul]:m-0 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-[0.3rem] [&_ul]:pl-[1.15rem] ${TONES[tone]} ${CONTRAST_OUTLINE}`}>
    {title && (
      <h4 className={`m-0 flex items-center gap-2 text-[1.08rem] font-black ${TITLES[tone]}`}>
        {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
        {title}
      </h4>
    )}
    {children}
  </div>
)
