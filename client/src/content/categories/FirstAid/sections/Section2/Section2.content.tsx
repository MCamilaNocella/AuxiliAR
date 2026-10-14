import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Ahogos, as the chosen model */
export default function Section2Content() {
  return <ModelSection view={FIRST_AID_VIEWS["ahogos"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
