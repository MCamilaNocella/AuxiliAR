import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { FIRST_AID_SECTION_IDS, FIRST_AID_VIEWS } from "../../FirstAid.model"

/** Primeros auxilios · Quemaduras, as the chosen model */
export default function Section5Content() {
  return <ModelSection view={FIRST_AID_VIEWS["quemaduras"]} sectionIds={FIRST_AID_SECTION_IDS} />
}
