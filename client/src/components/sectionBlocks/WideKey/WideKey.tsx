import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import type { WideKeyProps } from "./WideKey.types"

/** Wide summary cells side by side, each one a place or an option: what it is for, when, and examples */
export const WideKey = ({ cards }: WideKeyProps) => (
  <div className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgb(60_30_30/0.06),0_0.5rem_1.5rem_-0.75rem_rgb(60_30_30/0.18)] in-data-[theme=contrast]:shadow-none in-data-[theme=dark]:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_0.5rem_1.5rem_-0.75rem_rgb(0_0_0/0.6)] ${CONTRAST_OUTLINE}`}>
    {cards.map(({ icon: Icon, name, when, text, examples }, index) => (
      <div key={name} className={`tone-${TONE_CYCLE[index % 5]} grid content-start gap-[0.6rem] px-5 py-[1.1rem] shadow-[-1px_0_0_var(--color-line-strong),0_-1px_0_var(--color-line-strong)]`}>
        {Icon && (
          <span className={`flex size-10 items-center justify-center rounded-[0.8rem] bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
        <h3 className="m-0 text-[1.2rem] font-black">{name}</h3>
        <p className="m-0 font-extrabold">{when}</p>
        <p className="m-0">{text}</p>
        <p className="m-0 mt-2 text-xs font-extrabold tracking-[0.06em] text-muted uppercase">Por ejemplo</p>
        <p className="m-0">{examples.join(" · ")}</p>
      </div>
    ))}
  </div>
)
