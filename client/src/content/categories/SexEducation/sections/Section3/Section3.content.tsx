import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · Métodos anticonceptivos, as the chosen model */
export default function Section3Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["metodos"]} sectionIds={SEX_EDUCATION_SECTION_IDS} />
}
