import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { SEX_EDUCATION_PLACES, SEX_EDUCATION_PROVINCES, SEX_EDUCATION_SECTION_IDS, SEX_EDUCATION_VIEWS } from "../../SexEducation.model"

/** Salud sexual y ESI · Orientación y ayuda, as the chosen model */
export default function Section2Content() {
  return <ModelSection view={SEX_EDUCATION_VIEWS["consultar"]} sectionIds={SEX_EDUCATION_SECTION_IDS} places={SEX_EDUCATION_PLACES} provinces={SEX_EDUCATION_PROVINCES} />
}
