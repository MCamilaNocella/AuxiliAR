import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · Prevención y test de ITS, as the chosen model */
export default function Section4Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["its"]} sectionIds={SEX_EDUCATION_SECTION_IDS} />
}
