import { ModelSection } from "@/components/sectionBlocks/ModelSection"
import { ANIMALS_PLACES, ANIMALS_PROVINCES, ANIMALS_SECTION_IDS, ANIMALS_VIEWS } from "../../Animals.model"

/** Atención veterinaria · Dónde atenderlo, as the chosen model */
export default function Section3Content() {
  return <ModelSection view={ANIMALS_VIEWS["atencion"]} sectionIds={ANIMALS_SECTION_IDS} places={ANIMALS_PLACES} provinces={ANIMALS_PROVINCES} />
}
