import { Auxi } from "@/components/help/Auxi"
import type { AuxiSaysProps } from "./AuxiSays.types"

/** Auxi saying something, in a speech bubble next to it (like the Mi Salud greeting) */
export const AuxiSays = ({ children }: AuxiSaysProps) => (
  <div className="mt-2 flex items-end gap-3">
    <Auxi className="w-18 shrink-0" />
    <p className="relative m-0 min-w-0 max-w-[32rem] rounded-[1.25rem_1.25rem_1.25rem_0.35rem] border border-line-strong bg-card px-4 py-3 text-[0.95rem] shadow-[0_1px_2px_rgb(60_30_30/0.06),0_0.5rem_1.5rem_-0.75rem_rgb(60_30_30/0.18)] in-data-[theme=contrast]:shadow-none in-data-[theme=dark]:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_0.5rem_1.5rem_-0.75rem_rgb(0_0_0/0.6)]">{children}</p>
  </div>
)
