import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Intoxicaciones, as the chosen model */
export default function Section7Content() {
  return <ModelSection view={FIRST_AID_VIEWS["intoxicaciones"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
