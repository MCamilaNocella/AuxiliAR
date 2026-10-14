import { Bookmark, Calendar, Check, HandHeart } from "lucide-react"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { VaccineCalendar } from "@/components/sectionBlocks/VaccineCalendar"
import { centersLink } from "@/router/centersLink"
import { PH_SOURCES, PH_VACCINES } from "../../PhysicalHealth.model"

/** Salud general · Calendario de vacunación, as the chosen model: the key facts, the calendar by stage of life and what to remember */
export default function Section5Content() {
  return (
    <SectionBody sources={PH_SOURCES.vacunas}>
      <SectionKey
        cells={[
          { icon: Calendar, tone: 1, title: "Calendario Nacional", value: `${PH_VACCINES.stages.length} etapas`, label: "de la vida, del bebé a +65", target: "cal" },
          { icon: HandHeart, tone: 4, title: "Cuánto cuestan", value: "Gratis", label: "en centros de salud y hospitales públicos" },
          { icon: Check, tone: 2, title: "Orden médica", value: "No hace falta", label: "para las vacunas del Calendario" },
          { icon: Bookmark, tone: 5, title: "Al ir", value: "Tu carnet", label: "para que lo revisen" },
        ]}
      />
      <VaccineCalendar stages={PH_VACCINES.stages} remember={PH_VACCINES.remember} pdf={PH_VACCINES.pdf} centersTo={centersLink({ filter: "vaccination" })} />
    </SectionBody>
  )
}
