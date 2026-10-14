import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { ANIMALS_SECTION_IDS, ANIMALS_VIEWS } from "../../Animals.model"

/** Atención veterinaria · Calendario de vacunación, as the chosen model */
export default function Section2Content() {
  return <ModelSection view={ANIMALS_VIEWS["vacunas"]} sectionIds={ANIMALS_SECTION_IDS} />
}
