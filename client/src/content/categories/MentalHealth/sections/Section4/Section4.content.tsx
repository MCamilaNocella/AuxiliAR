import { Lightbulb } from "lucide-react"
import { CalmCards } from "@/components/sectionBlocks/CalmCards"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SideCallout } from "@/components/sectionBlocks/SideCallout"
import { blockIcon } from "@/utils/blockIcons"
import { MH_CALM, MH_SOURCES } from "../../MentalHealth.model"

/** Salud mental · Ejercicios de calma, as the chosen model: four short exercises of the WHO guide, as colored cards */
export default function Section4Content() {
  return (
    <SectionBody sources={MH_SOURCES.ejercicios}>
      <CalmCards items={MH_CALM.items.map(({ icon, title, when, steps }) => ({ icon: blockIcon(icon), title, when, steps }))} />
      <SideCallout tone="brand" title="Estos ejercicios no borran lo que sentís" icon={Lightbulb}>
        <p className="m-0">Te ayudan a manejar mejor el estrés. Cuanto más los practicás, más fácil te salen.</p>
      </SideCallout>
    </SectionBody>
  )
}
