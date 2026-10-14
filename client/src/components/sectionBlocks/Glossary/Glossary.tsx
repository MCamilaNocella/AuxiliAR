import { useState } from "react"
import { ScanSearch } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { GlossaryProps } from "./Glossary.types"

/** Lowercase and without accents, so "cesac" finds "CeSAC" and "vacunacion" finds "vacunación" */
const plain = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

/** The words of a glossary in alphabetical order, with a box that filters them as you type */
export const Glossary = ({ terms }: GlossaryProps) => {
  const [query, setQuery] = useState("")
  const wanted = plain(query.trim())
  const shown = [...terms].sort((a, b) => a.term.localeCompare(b.term, "es")).filter(({ term, text }) => !wanted || plain(`${term} ${text}`).includes(wanted))
  return (
    <div className="min-w-0">
      <label className={`mt-3 flex min-h-12 items-center gap-2 rounded-full bg-field px-4 text-muted focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-brand ${CONTRAST_OUTLINE}`}>
        <ScanSearch aria-hidden="true" className="size-[1.25em] shrink-0" />
        <span className="sr-only">Buscar una palabra</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscá una palabra"
          autoComplete="off"
          className="min-h-11 w-0 min-w-0 flex-1 border-0 bg-transparent text-ink outline-none placeholder:text-muted"
        />
      </label>
      <p role="status" aria-live="polite" className="m-0 mt-3 text-ink-soft empty:hidden">
        {shown.length ? "" : `No encontramos «${query.trim()}». Probá con otra palabra.`}
      </p>
      <dl className="m-0 mt-3 grid gap-[0.6rem] @[44rem]:grid-cols-2">
        {shown.map(({ term, text }) => (
          <div key={term} className={`rounded-[1.1rem] bg-card px-[1.1rem] py-[0.9rem] ${CONTRAST_OUTLINE}`}>
            <dt className="font-black text-(--tone-ink)">{term}</dt>
            <dd className="m-0 mt-[0.2rem] text-ink-soft">{text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
