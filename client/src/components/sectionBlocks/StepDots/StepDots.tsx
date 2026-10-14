import type { StepDotsProps } from "./StepDots.types"

/** A row of bars that light up as you go (decorative: the step is also said in words) */
export const StepDots = ({ total, done }: StepDotsProps) => (
  <ol aria-hidden="true" className="m-0 flex list-none gap-1.5 p-0">
    {Array.from({ length: total }, (_, k) => (
      <li key={k} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ease-out motion-reduce:transition-none ${k < done ? "bg-brand" : "bg-field"}`} />
    ))}
  </ol>
)
