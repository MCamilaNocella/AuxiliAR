import { Phone } from "lucide-react"
import { EmergencyNumbers } from "@/components/layout/EmergencyNumbers"
import { NUMBERS } from "../../EmergencyNumberModels.constants"
import type { BarPreviewProps } from "./BarPreview.types"

/** The whole emergency bar as it is today (same grid, same number cards), with another first aid column */
export const BarPreview = ({ FirstAid }: BarPreviewProps) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-x-8 gap-y-4">
    <div className="flex flex-col gap-2.5">
      <h2 className="m-0 flex items-center gap-2 text-base font-extrabold text-alert-text">
        <Phone aria-hidden="true" className="size-4.5 flex-none" />
        ¿Es una emergencia? Llamá gratis
      </h2>
      <EmergencyNumbers numbers={NUMBERS} />
    </div>
    <FirstAid />
  </div>
)
