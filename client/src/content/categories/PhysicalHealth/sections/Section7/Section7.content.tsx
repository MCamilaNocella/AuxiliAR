import { Activity, Footprints, ShieldCheck, Siren, Timer } from "lucide-react"
import { AmountRows } from "@/components/sectionBlocks/AmountRows"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { OptionTiles } from "@/components/sectionBlocks/OptionTiles"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { SideCallout } from "@/components/sectionBlocks/SideCallout"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { TONE_CYCLE } from "@/types/tone"
import { blockIcon } from "@/utils/blockIcons"
import { PH_ACTIVITY, PH_SOURCES } from "../../PhysicalHealth.model"

/** "de actividad moderada" → "De actividad moderada." */
const sentence = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}.`

/** Salud general · Actividad física y bienestar, as the chosen model: how much to move, free options, before starting and when to stop */
export default function Section7Content() {
  return (
    <SectionBody sources={PH_SOURCES.actividad}>
      <SectionKey
        cells={PH_ACTIVITY.groups.map((group, k) => ({ icon: blockIcon(group.icon), tone: TONE_CYCLE[k % TONE_CYCLE.length], title: group.who, value: group.value, label: group.unit || group.extra, target: `amount-${k}` }))}
      />
      <ToneBlock icon={Activity} tone={3} title="Cuánto moverse">
        <AmountRows rows={PH_ACTIVITY.groups.map((group, k) => ({ id: `amount-${k}`, value: group.value, unit: group.unit, who: group.who, text: sentence(group.detail) + (group.extra ? ` ${group.extra}` : "") }))} />
        <BlockNote icon={Timer}>{PH_ACTIVITY.sitLess}</BlockNote>
      </ToneBlock>
      <ToneBlock icon={Footprints} tone={4} title={PH_ACTIVITY.free.title}>
        <OptionTiles items={PH_ACTIVITY.free.items.map((item) => ({ icon: blockIcon(item.icon), text: item.text }))} />
        <BlockNote>{PH_ACTIVITY.free.note}</BlockNote>
      </ToneBlock>
      <SideCallout tone="brand" title={PH_ACTIVITY.before.title} icon={ShieldCheck}>
        <p className="m-0">{PH_ACTIVITY.before.points.join(" ")}</p>
      </SideCallout>
      <SideCallout title="Pará y pedí ayuda" icon={Siren}>
        <p className="m-0">{PH_ACTIVITY.alarm}</p>
      </SideCallout>
    </SectionBody>
  )
}
