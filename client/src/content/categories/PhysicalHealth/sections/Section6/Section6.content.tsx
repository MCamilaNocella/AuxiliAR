import { Footprints, Salad } from "lucide-react"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { NumberedCards } from "@/components/sectionBlocks/NumberedCards"
import { RuleRows } from "@/components/sectionBlocks/RuleRows"
import { SealNote } from "@/components/sectionBlocks/SealNote"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { SideCallout } from "@/components/sectionBlocks/SideCallout"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { TONE_CYCLE } from "@/types/tone"
import { blockIcon } from "@/utils/blockIcons"
import { PH_FOOD, PH_SOURCES } from "../../PhysicalHealth.model"

const guide = (k: number) => PH_FOOD.guides.items[k]

/** Salud general · Alimentación y nutrición, as the chosen model: the 10 messages, the black seals and where to ask for help */
export default function Section6Content() {
  return (
    <SectionBody sources={PH_SOURCES.alimentacion}>
      <SectionKey
        cells={[
          { icon: blockIcon(guide(1).icon), tone: 2, title: "Agua segura", value: "8 vasos", label: "por día", target: "guide-1" },
          { icon: blockIcon(guide(2).icon), tone: 4, title: "Frutas y verduras", value: "5 porciones", label: "por día, de varios colores", target: "guide-2" },
          { icon: Footprints, tone: 3, title: "Moverse", value: "30 minutos", label: "de actividad física, como mínimo", section: "section-7" },
          { icon: blockIcon(guide(3).icon), tone: 1, title: "Sal", value: "Menos", label: "y menos alimentos con sodio", target: "guide-3" },
        ]}
      />
      <ToneBlock icon={Salad} tone={4} title={PH_FOOD.guides.title} lead={[PH_FOOD.guides.lead]}>
        <NumberedCards items={PH_FOOD.guides.items.map((item, k) => ({ id: `guide-${k}`, icon: blockIcon(item.icon), title: item.short, text: item.text }))} />
      </ToneBlock>
      <SealNote title={PH_FOOD.labels.title} text={PH_FOOD.labels.text} />
      {PH_FOOD.blocks.map((block, k) => (
        <ToneBlock key={block.id} icon={blockIcon(block.icon)} tone={TONE_CYCLE[(k + 1) % TONE_CYCLE.length]} title={block.title} lead={[block.lead]}>
          <RuleRows rows={block.points.map((point) => ({ value: point }))} />
          {block.urgentNote ? (
            <div className="mt-3">
              <SideCallout>
                <p className="m-0">{block.note}</p>
              </SideCallout>
            </div>
          ) : (
            <BlockNote>{block.note}</BlockNote>
          )}
        </ToneBlock>
      ))}
    </SectionBody>
  )
}
