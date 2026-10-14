import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · RCP, as the chosen model */
export default function Section1Content() {
  return <ModelSection view={FIRST_AID_VIEWS["rcp"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
