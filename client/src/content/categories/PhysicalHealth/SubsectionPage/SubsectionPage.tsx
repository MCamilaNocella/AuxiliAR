import type { LucideIcon } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { MapAccess } from "@/components/health/MapAccess"
import { PendingNotice } from "@/components/health/PendingNotice"
import type { CentersFilter } from "@/router/centersLink"

export type SubsectionBlock = {
  id: string
  icon: LucideIcon
  title: string
  /** What this block is, in a sentence */
  lead: string
  points: string[]
  /** One short caution under the points */
  note?: string
  /** A next step inside AuxiliAR */
  action?: { label: string, to: string }
}

/** A source named but not linked: its address has not been checked yet. Shown in "Sobre AuxiliAR", not in the page */
export type SubsectionSource = { organization: string, title: string }

export type Subsection = {
  /** What the page is not: shown in the notice of content pending validation */
  notice: string
  intro: string
  blocks: SubsectionBlock[]
  /** The filter of the map this page opens, and what it shows ("Ver el mapa de {mapTopic}") */
  mapFilter: Extract<CentersFilter, "nutrition-food" | "physical-activity">
  mapTopic: string
  sources: SubsectionSource[]
}

const cardClass = "rounded-2xl border border-line-strong bg-card p-4 sm:p-6"

/**
 * An informative subsection of Salud general (Alimentación y nutrición, Actividad física y bienestar): the notice of what is
 * pending, a short explanation, blocks that each say one thing, the way to the map and the sources. Stacked in one column at any width.
 * General orientation only, never a diagnosis; it names no place, hour or activity that has not been verified.
 */
export const SubsectionPage = ({ notice, intro, blocks, mapFilter, mapTopic }: Subsection) => (
  <div className="mt-2 flex max-w-3xl flex-col gap-6">
    <PendingNotice>{notice}</PendingNotice>

    <p className="m-0 text-lg text-ink">{intro}</p>

    {blocks.map(({ id, icon: Icon, title, lead, points, note, action }) => (
      <section key={id} aria-labelledby={`subsection-${id}`} className={cardClass}>
        <h3 id={`subsection-${id}`} className="m-0 flex items-center gap-2 text-xl font-extrabold">
          <Icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
          {title}
        </h3>
        <p className="m-0 mt-2">{lead}</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {note && <p className="m-0 mt-3 text-ink-soft">{note}</p>}
        {action && (
          <div className="mt-3 flex flex-col sm:flex-row">
            <ActionLink to={action.to}>{action.label}</ActionLink>
          </div>
        )}
      </section>
    ))}

    <MapAccess filter={mapFilter} topic={mapTopic} />


    <p className="m-0 text-sm text-muted">Esta información es orientativa y no reemplaza la consulta con un equipo de salud.</p>
  </div>
)
