export type EmergencyNumber = {
  number: string
  label: string
}

export type FirstAidGuide = {
  slug: string
  title: string
  /** What the guide explains, in a sentence. Write it once the guide has real content: only then does Auxi send people to it */
  summary?: string
}
