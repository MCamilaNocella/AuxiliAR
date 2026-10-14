import type { SubLabelProps } from "./SubLabel.types"

/** A small heading inside a block, in muted capitals (e.g. "Grupos de apoyo mutuo") */
export const SubLabel = ({ className = "", children }: SubLabelProps) => (
  <h4 className={`m-0 mb-[0.4rem] text-[0.8rem] font-black tracking-[0.06em] text-muted uppercase ${className}`}>{children}</h4>
)
