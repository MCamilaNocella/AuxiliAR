export type GroundingStep = {
  title: string
  text: string
  /** Circles to tap, one per thing found (e.g. 5 things you see) */
  count?: number
}

export type GroundingStepsProps = {
  steps: GroundingStep[]
}
