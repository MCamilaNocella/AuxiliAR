import { Clock, Dumbbell, PersonStanding, Play, Wind } from "lucide-react"
import { MuscleSteps } from "@/components/sectionBlocks/MuscleSteps"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { MH_MUSCLES, MH_SOURCES } from "../../MentalHealth.model"

/** Salud mental · Relajación muscular, as the chosen model: the key facts and the exercise with a timer, part by part */
export default function Section3Content() {
  const { tense, relax, steps, before } = MH_MUSCLES
  return (
    <SectionBody sources={MH_SOURCES.musculos}>
      <SectionKey
        cells={[
          { icon: Dumbbell, tone: 1, title: "Tensás", value: `${tense} segundos`, label: "con fuerza, sin que duela" },
          { icon: Wind, tone: 2, title: "Soltás", value: `${relax} segundos`, label: "y notás la diferencia" },
          { icon: PersonStanding, tone: 3, title: "Todo el cuerpo", value: `${steps.length} partes`, label: "de la cara a las piernas" },
          { icon: Clock, tone: 4, title: "En total", value: "5 minutos", label: "más o menos" },
        ]}
      />
      <ToneBlock id="muscles" icon={Play} tone={3} title="Hacelo ahora, paso a paso">
        <MuscleSteps steps={steps} tense={tense} relax={relax} before={before} />
      </ToneBlock>
    </SectionBody>
  )
}
