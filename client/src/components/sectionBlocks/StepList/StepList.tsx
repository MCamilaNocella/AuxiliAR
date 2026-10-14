import type { StepListProps } from "./StepList.types"

/** Numbered steps: each number in a soft circle of the category color (or, in an accent block, of the block's tone) */
export const StepList = ({ steps }: StepListProps) => (
  <ol className="m-0 grid list-none gap-[0.6rem] p-0 pt-3">
    {steps.map((step, index) => (
      <li key={index} className="grid grid-cols-[2rem_1fr] items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full bg-[var(--step-bg,color-mix(in_srgb,var(--category-light)_16%,transparent))] font-black text-[var(--step-ink,var(--category-accent))]"
        >
          {index + 1}
        </span>
        <span className="pt-1">{step}</span>
      </li>
    ))}
  </ol>
)
