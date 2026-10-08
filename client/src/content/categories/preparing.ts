import { centersLink } from "@/router/centersLink"
import type { CategoryPreparing } from "@/types/category"

/**
 * What the categories without published information say meanwhile (see CategoryPreparing). Each one names what it will have
 * and links only to what already exists in AuxiliAR on the topic. Remove the `preparing` of a category when its sections
 * have real content.
 */

export const SEX_EDUCATION_PREPARING: CategoryPreparing = {
  will: "Va a reunir información sobre anticoncepción, derechos y cómo acceder a atención, solo con información de fuentes oficiales.",
  meanwhile: [{ label: "Buscar en el mapa centros verificados con salud sexual y reproductiva", to: centersLink({ filter: "sexual-health" }) }],
}

export const ANIMALS_PREPARING: CategoryPreparing = {
  will: "Va a reunir cuidados preventivos y orientación veterinaria, solo con información de fuentes oficiales.",
  meanwhile: [],
}
