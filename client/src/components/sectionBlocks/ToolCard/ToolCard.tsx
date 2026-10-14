import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { ToolCardProps } from "./ToolCard.types"

/** The card a self-care tool lives in (guided breathing, grounding, muscle relaxation) */
export const ToolCard = ({ className = "", children }: ToolCardProps) => <div className={`mt-3 grid gap-4 rounded-3xl bg-card px-5 py-6 sm:p-8 ${CONTRAST_OUTLINE} ${className}`}>{children}</div>
