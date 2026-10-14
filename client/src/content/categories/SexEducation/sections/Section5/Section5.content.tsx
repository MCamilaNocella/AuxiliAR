import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · Interrupción del embarazo, as the chosen model */
export default function Section5Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["ive"]} sectionIds={SEX_EDUCATION_SECTION_IDS} />
}
