import { use } from "react"
import { blockIcon } from "@/utils/blockIcons"
import { TONE_CYCLE, toneOf } from "@/types/tone"
import { guideTones } from "@/utils/guideTones"
import { BlockList } from "../BlockList"
import { SectionNavContext } from "../BlockLook"
import { SectionBody } from "../SectionBody"
import { SectionKey } from "../SectionKey"
import type { ModelSectionProps } from "./ModelSection.types"

/** A section built from a category model's data: its summary, its blocks, "Fuentes oficiales" and the general notice */
export const ModelSection = ({ view, sectionIds, places, provinces }: ModelSectionProps) => {
  const openSection = use(SectionNavContext)
  const open = (modelId: string) => openSection(sectionIds[modelId] ?? modelId)
  // Sections with guides (Primeros auxilios): each summary cell takes the tone of the guide it opens, on a tinted background
  const tones = guideTones(view.blocks)
  const tinted = Object.keys(tones).length > 0
  return (
    <SectionNavContext value={open}>
      <SectionBody sources={view.sources}>
        {view.key && (
          <SectionKey
            tinted={tinted}
            cells={view.key.map((cell, index) => ({
              icon: blockIcon(cell.icon),
              title: cell.title,
              value: cell.value,
              label: cell.label,
              target: cell.to,
              section: cell.section,
              tone: (cell.to && tones[cell.to]) || (cell.tone ? toneOf(cell.tone) : TONE_CYCLE[index % 5]),
            }))}
          />
        )}
        <BlockList blocks={view.blocks} places={places} provinces={provinces} />
      </SectionBody>
    </SectionNavContext>
  )
}
