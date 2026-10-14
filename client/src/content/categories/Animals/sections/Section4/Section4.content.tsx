import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { ANIMALS_SECTION_IDS, ANIMALS_VIEWS } from "../../Animals.model"

/** Atención veterinaria · Mordeduras y zoonosis, as the chosen model */
export default function Section4Content() {
  return <ModelSection view={ANIMALS_VIEWS["mordeduras"]} sectionIds={ANIMALS_SECTION_IDS} />
}
