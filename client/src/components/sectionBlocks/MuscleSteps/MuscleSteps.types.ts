export type MuscleStepsProps = {
  /** [body part, what to do, seconds to tense when it isn't the usual] */
  steps: [string, string, number?][]
  /** Seconds to tense and to let go */
  tense: number
  relax: number
  /** What to know before starting */
  before: string[]
}
