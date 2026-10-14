import { useState } from "react"
import { Eye, Footprints, Repeat, Timer, Wind } from "lucide-react"
import { BreathGuide } from "@/components/sectionBlocks/BreathGuide"
import { GroundingSteps } from "@/components/sectionBlocks/GroundingSteps"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { MH_BREATHING, MH_GROUNDING, MH_SOURCES } from "../../MentalHealth.model"

/** Salud mental · Respirá y conectá, as the chosen model: guided breathing (two exercises, two looks) and grounding, step by step */
export default function Section2Content() {
  const [pick, setPick] = useState<{ mode: string, at: number }>()
  const choose = (mode: string) => () => setPick({ mode, at: Date.now() })
  return (
    <SectionBody sources={MH_SOURCES.calma}>
      <SectionKey
        cells={[
          { icon: Wind, tone: 1, title: "Respiración 4-7-8", value: "4 · 7 · 8", label: "inhalá, mantené, soltá", target: "breath", onOpen: choose("478") },
          { icon: Timer, tone: 2, title: "Respiración lenta", value: "5 y 5", label: "al menos 5 minutos", target: "breath", onOpen: choose("slow") },
          { icon: Eye, tone: 3, title: "Poner los pies en la tierra", value: "5 cosas", label: "que ves, para volver al presente", target: "ground" },
          { icon: Repeat, tone: 4, title: "Cuándo", value: "Todos los días", label: "rinde más si lo practicás" },
        ]}
      />
      <ToneBlock id="breath" icon={Timer} tone="category" title="Respiración guiada">
        <BreathGuide exercises={MH_BREATHING} pick={pick} />
      </ToneBlock>
      <ToneBlock id="ground" icon={Footprints} tone={2} title={MH_GROUNDING.name} lead={[MH_GROUNDING.lead]}>
        <GroundingSteps steps={MH_GROUNDING.steps} />
      </ToneBlock>
    </SectionBody>
  )
}
