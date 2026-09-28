import type { SettingGroupProps } from "./SettingGroup.types"

/** Sección del panel "Ver mejor": agrupa controles relacionados bajo un título. */
export const SettingGroup = ({ title, children, className = "" }: SettingGroupProps) => (
  <fieldset className={`m-0 flex min-w-0 flex-col gap-2 border-0 p-0 ${className}`}>
    <legend className="mb-2 p-0 text-xs font-bold tracking-widest text-muted uppercase">{title}</legend>
    {children}
  </fieldset>
)
