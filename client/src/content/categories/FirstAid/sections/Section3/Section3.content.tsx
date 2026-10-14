import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Malestares, as the chosen model */
export default function Section3Content() {
  return <ModelSection view={FIRST_AID_VIEWS["malestares"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
