export type BreathingExercise = {
  name: string
  /** Its name on small screens */
  short: string
  lead: string
  before: string[]
  /** [what to do, seconds, "in" | "hold" | "out"] */
  phases: [string, number, string][]
  cycles: number
  note: string
}

export type BreathGuideProps = {
  /** The exercises, by id (the first one opens) */
  exercises: Record<string, BreathingExercise>
  /** The exercise a summary cell asked for (changes it when it is another) */
  pick?: { mode: string, at: number }
}
