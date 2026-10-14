import { Ban, Scale } from "lucide-react"
import { BlockButton } from "@/components/sectionBlocks/BlockButton"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { NumberedCards } from "@/components/sectionBlocks/NumberedCards"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { blockIcon } from "@/utils/blockIcons"
import { MH_RIGHTS, MH_SOURCES } from "../../MentalHealth.model"

/** Salud mental · Tus derechos, as the chosen model: what the law 26.657 recognizes and what to do if they refuse to see you */
export default function Section6Content() {
  return (
    <SectionBody sources={MH_SOURCES.derechos} noNotice>
      <ToneBlock icon={Scale} tone={3} title="Lo que reconoce la ley">
        <NumberedCards balanced items={MH_RIGHTS.items.map(({ icon, short, text }) => ({ icon: blockIcon(icon), title: short, text }))} />
      </ToneBlock>
      <ToneBlock icon={Ban} tone={1} title="Si te rechazan la atención">
        <p className="m-0 pt-2 font-bold">{MH_RIGHTS.refused.rule}</p>
        <BlockNote>{MH_RIGHTS.refused.note}</BlockNote>
        <div className="mt-3">
          <BlockButton button={{ go: "section-1", label: "Buscar dónde atenderte" }} />
        </div>
      </ToneBlock>
      <p className="m-0 text-sm text-muted">{MH_RIGHTS.disclaimer}</p>
    </SectionBody>
  )
}
