import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { ANIMALS_SECTION_IDS, ANIMALS_VIEWS } from "../../Animals.model"

/** Atención veterinaria · Bienestar y cuidados, as the chosen model */
export default function Section1Content() {
  return <ModelSection view={ANIMALS_VIEWS["cuidados"]} sectionIds={ANIMALS_SECTION_IDS} />
}
