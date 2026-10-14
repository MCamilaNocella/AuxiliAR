import { useState } from "react"
import { Check, RotateCcw } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { KIT_STORAGE_KEY } from "./KitChecklist.constants"
import type { KitChecklistProps } from "./KitChecklist.types"

const read = (): string[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KIT_STORAGE_KEY) ?? "[]")
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

const write = (list: string[]) => {
  try {
    localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Without storage it still works for the visit
  }
}

/** "Armá tu botiquín": tap what you already have; a count, a bar and the ticks, remembered on this device only */
export const KitChecklist = ({ id, title, lead, groups, tone }: KitChecklistProps) => {
  const [have, setHave] = useState(read)
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  const ids = groups.flatMap((group) => group.items.map((item) => item.id))
  const count = ids.filter((item) => have.includes(item)).length
  const update = (list: string[]) => {
    setHave(list)
    write(list)
  }
  return (
    <section id={`part-${id}`} tabIndex={-1} aria-labelledby={`part-${id}-title`} className={`tone-${tone} grid min-w-0 grid-cols-[minmax(0,1fr)] focus:outline-none`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-(--tone-ink) pb-3">
        <h3 id={`part-${id}-title`} className="m-0 mr-auto text-[1.3rem] leading-[1.2] font-black text-(--tone-ink)">
          {title}
        </h3>
      </div>
      {lead && <p className="m-0 pt-3 text-ink-soft">{lead}</p>}
      <p role="status" aria-live="polite" className="m-0 mt-4">
        {count === total ? (
          <>
            <b>¡Tu botiquín está completo!</b> Revisalo cada tanto.
          </>
        ) : (
          <>
            Tenés <b>{`${count} de ${total}`}</b>
            {count ? "." : ". Tocá lo que ya tenés."}
          </>
        )}
      </p>
      <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-field">
        <span className="block h-full rounded-full bg-success transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(count / total) * 100}%` }} />
      </div>
      {groups.map((group) => (
        <div key={group.title}>
          <h4 className="m-0 mt-5 text-[1.02rem] font-black text-(--tone-ink)">{group.title}</h4>
          <ul role="list" className="m-0 mt-[0.6rem] grid list-none gap-2 p-0 @[40rem]:grid-cols-2">
            {group.items.map((item) => {
              const pressed = have.includes(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => update(pressed ? have.filter((x) => x !== item.id) : [...have, item.id])}
                    className={`flex h-full min-h-11 w-full cursor-pointer items-start gap-3 rounded-2xl border-0 px-4 py-[0.8rem] text-left text-ink transition-colors duration-200 hover:bg-brand-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none in-data-[theme=contrast]:aria-pressed:outline-2 in-data-[theme=contrast]:aria-pressed:outline-brand ${pressed ? "bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]" : "bg-field"} ${CONTRAST_OUTLINE}`}
                  >
                    <span className={`mt-px grid size-[1.6rem] shrink-0 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none ${pressed ? "bg-success text-surface" : "text-transparent shadow-[inset_0_0_0_2px_var(--color-control-line)]"}`}>
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <span>
                      <b className="block font-extrabold">{item.name}</b>
                      {item.use && <small className="block text-[0.9rem] text-muted">{item.use}</small>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      {count > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => update([])}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-field px-3.5 py-1.5 text-sm font-bold text-ink hover:bg-brand-soft in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)]"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Desmarcar todo
          </button>
        </div>
      )}
    </section>
  )
}
