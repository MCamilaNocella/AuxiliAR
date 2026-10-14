import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Heridas, as the chosen model */
export default function Section4Content() {
  return <ModelSection view={FIRST_AID_VIEWS["heridas"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
