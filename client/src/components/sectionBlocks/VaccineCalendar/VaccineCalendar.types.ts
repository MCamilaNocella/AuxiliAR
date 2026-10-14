export type VaccineStage = {
  id: string
  title: string
  short: string
  intro?: string
  groups: { heading: string | null, paragraphs: string[], items: { vaccine: string, dose: string, details: string[] }[] }[]
  notes: string[]
  confirm: { topic: string, what: string }[]
}

export type VaccineCalendarProps = {
  stages: VaccineStage[]
  remember: string[]
  /** The official calendar (PDF) */
  pdf: string
  /** Where "Encontrar vacunatorio" takes you */
  centersTo: string
}
