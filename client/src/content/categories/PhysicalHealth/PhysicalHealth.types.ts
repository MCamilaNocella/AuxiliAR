import type { LucideIcon } from "lucide-react"
import type { CentersFilter } from "@/router/centersLink"

// The data of before for Alimentación and Actividad física (PhysicalHealth.food.ts / .activity.ts): "Sobre AuxiliAR" lists their sources

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
  intro: string
  blocks: SubsectionBlock[]
  /** The filter of the map this page opens, and what it shows ("Ver el mapa de {mapTopic}") */
  mapFilter: Extract<CentersFilter, "nutrition-food" | "physical-activity">
  mapTopic: string
  sources: SubsectionSource[]
}
