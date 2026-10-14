import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Botiquín, as the chosen model */
export default function Section8Content() {
  return <ModelSection view={FIRST_AID_VIEWS["botiquin"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
