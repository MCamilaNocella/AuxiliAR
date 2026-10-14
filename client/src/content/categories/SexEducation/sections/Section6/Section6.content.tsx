import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · Derechos y recursos, as the chosen model */
export default function Section6Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["derechos"]} sectionIds={SEX_EDUCATION_SECTION_IDS} />
}
