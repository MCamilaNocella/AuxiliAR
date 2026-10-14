import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { ANIMALS_SECTION_IDS, ANIMALS_VIEWS } from "../../Animals.model"

/** Atención veterinaria · Más recursos, as the chosen model */
export default function Section5Content() {
  return <ModelSection view={ANIMALS_VIEWS["recursos"]} sectionIds={ANIMALS_SECTION_IDS} />
}
