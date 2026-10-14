import { Phone, Siren } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { CallCardProps } from "./CallCard.types"

const LOOK = {
  plain: { card: "bg-card text-ink hover:text-ink", icon: "bg-brand-soft text-brand", number: "", text: "text-ink-soft", chip: "bg-field text-ink-soft" },
  urgent: { card: "bg-alert-soft text-ink hover:text-ink", icon: "bg-alert text-on-alert", number: "text-alert-text", text: "text-ink-soft", chip: "bg-field text-ink-soft" },
  main: { card: "bg-brand text-on-brand hover:text-on-brand", icon: "bg-white/18 text-inherit", number: "", text: "opacity-90", chip: "bg-white/18 text-inherit" },
}

/** A phone line as a card you can tap to call: the number, its name, what it does and small facts */
export const CallCard = ({ number, dial, name, text, meta, variant }: CallCardProps) => {
  const look = LOOK[variant ?? "plain"]
  const Icon = variant === "urgent" ? Siren : Phone
  return (
    <a
      href={`tel:${dial}`}
      aria-label={`Llamar al ${number}, ${name}`}
      className={`flex items-center gap-[0.9rem] rounded-[1.1rem] px-4 py-[0.9rem] no-underline transition-transform duration-150 hover:-translate-y-px motion-reduce:transition-none ${look.card} ${CONTRAST_OUTLINE}`}
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${look.icon}`}>
        <Icon aria-hidden="true" className="size-[1.35rem]" />
      </span>
      <span className="grid min-w-0 flex-1 gap-[0.1rem]">
        <span className={`text-[1.3rem] leading-[1.15] font-black [overflow-wrap:anywhere] sm:whitespace-nowrap ${look.number}`}>{number}</span>
        <span className="font-extrabold [overflow-wrap:anywhere]">{name}</span>
        <span className={`text-[0.925rem] [overflow-wrap:anywhere] ${look.text}`}>{text}</span>
        {meta.length > 0 && (
          <span className="mt-[0.35rem] flex flex-wrap gap-[0.3rem]">
            {meta.map((item) => (
              <span key={item} className={`rounded-full px-[0.55rem] py-[0.15rem] text-[0.8rem] font-bold ${look.chip}`}>
                {item}
              </span>
            ))}
          </span>
        )}
      </span>
    </a>
  )
}
