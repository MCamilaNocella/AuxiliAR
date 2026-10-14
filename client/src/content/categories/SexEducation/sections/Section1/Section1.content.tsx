import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · ¿Qué es la ESI?, as the chosen model */
export default function Section1Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["que-es"]} sectionIds={SEX_EDUCATION_SECTION_IDS} />
}
