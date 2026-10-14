import { CircleAlert, Eye } from "lucide-react"
import { AuxiSays } from "@/components/sectionBlocks/AuxiSays"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { RuleRows } from "@/components/sectionBlocks/RuleRows"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { blockIcon } from "@/utils/blockIcons"
import { PH_CONTROLS, PH_SOURCES } from "../../PhysicalHealth.model"

/** Salud general · Controles de salud, as the chosen model: each check with how often, what to watch for and Auxi's advice */
export default function Section2Content() {
  return (
    <SectionBody sources={PH_SOURCES.controles}>
      <SectionKey
        cells={PH_CONTROLS.items.map((item, k) => ({ icon: blockIcon(item.icon), tone: item.tone, title: item.title, value: item.headline.value, label: item.headline.label, target: `ctrl-${k}` }))}
      />
      {PH_CONTROLS.items.map((item, k) => (
        <ToneBlock key={item.id} id={`ctrl-${k}`} icon={blockIcon(item.icon)} tone={item.tone} title={item.title} value={item.headline.value} valueLabel={item.headline.label}>
          <RuleRows rows={item.rows.map((row) => ({ key: row.who, value: row.what }))} />
          {item.watch && (
            <BlockNote icon={item.watch.urgent ? CircleAlert : Eye} alert={item.watch.urgent}>
              <b>{`${item.watch.title}:`}</b> {`${item.watch.points.join(" · ").toLowerCase()}.`}
            </BlockNote>
          )}
          {item.note && <BlockNote>{item.note}</BlockNote>}
        </ToneBlock>
      ))}
      <AuxiSays>{PH_CONTROLS.general}</AuxiSays>
    </SectionBody>
  )
}
