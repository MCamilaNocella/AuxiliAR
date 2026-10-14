import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Golpes, as the chosen model */
export default function Section6Content() {
  return <ModelSection view={FIRST_AID_VIEWS["golpes"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
