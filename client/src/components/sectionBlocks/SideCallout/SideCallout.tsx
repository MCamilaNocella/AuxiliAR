import type { SideCalloutProps } from "./SideCallout.types"

/** A remark set apart by a thick line on its left: urgent (red) or to keep in mind (brand) */
export const SideCallout = ({ tone = "alert", title, icon: Icon, children }: SideCalloutProps) => (
  <div className={`grid gap-1 border-l-4 py-1 pl-4 ${tone === "alert" ? "border-alert" : "border-brand"}`}>
    {title && (
      <h3 className={`m-0 flex items-center gap-2 text-[1.05rem] font-black ${tone === "alert" ? "text-alert-text" : "text-brand"}`}>
        {Icon && <Icon aria-hidden="true" className="size-[1.25em] shrink-0" />}
        {title}
      </h3>
    )}
    {children}
  </div>
)
