import { BlockQuiz } from "@/components/sectionBlocks/BlockQuiz"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { PH_QUIZ } from "../../PhysicalHealth.model"

/** Salud general · Quiz, as the chosen model: 8 everyday situations, one at a time (no sources nor notice) */
export default function Section4Content() {
  return (
    <SectionBody noNotice>
      <BlockQuiz questions={PH_QUIZ} />
    </SectionBody>
  )
}
