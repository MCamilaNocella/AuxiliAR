/** Where a guide sits in the first aid hub */
export type GuideGroupId = "now" | "injuries" | "prepare"

export type GuideSource = {
  /** Name of the official document or page */
  label: string
  url: string
}

export type GuideStepSet = {
  /** Only when the guide has several (e.g. "Adultos y niños" / "Bebés"); a single set has none */
  label?: string
  /** One clear action each, in order */
  steps: string[]
}

export type GuideAction = {
  label: string
  /** A phone line to call (digits only, as in tel:) */
  tel?: string
  /** An internal route */
  to?: string
}

/**
 * A first aid guide. One definition, many places: the Primeros auxilios category, the Salud física door and the
 * emergency bar all read it from here (src/content/firstAid), so there is a single copy of every instruction.
 *
 * Rules for the content: it says only what the official sources say (DINESA / Ministerio de Salud de la Nación, see
 * `sources`), in everyday language; it never diagnoses and writes no instruction of its own. What an official
 * source doesn't cover is left out or said so in `note`. Emergency numbers are never written here: they differ by
 * place, so the guide points to the emergency numbers of the app.
 */
export type FirstAidGuideContent = {
  slug: string
  title: string
  group: GuideGroupId
  /** What it is, in a sentence or two */
  summary: string
  /** Shows the call-for-help block first and what to say when calling */
  callFirst?: boolean
  /** Señales importantes */
  signs?: { title: string, items: string[] }
  /** Heading of the steps; "¿Qué hago ahora?" when missing */
  stepsTitle?: string
  stepSets?: GuideStepSet[]
  /** Qué NO hacer */
  dont?: string[]
  /** Cuándo pedir ayuda */
  whenToCall?: string[]
  /** Mientras llega la ayuda */
  whileWaiting?: string[]
  /** Extra next steps (e.g. call the poison center) */
  actions?: GuideAction[]
  /** Lists of things (e.g. what goes in a first aid kit) */
  checklists?: { title: string, items: { name: string, use?: string }[] }[]
  /** An honest remark about the limits of the sources */
  note?: string
  /** Slugs of guides worth opening next */
  related?: string[]
  sources: GuideSource[]
  /** YYYY-MM-DD: when the guide was last compared with its sources */
  checkedAt: string
}
