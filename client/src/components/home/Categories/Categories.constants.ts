import { ALL_CATEGORIES } from "@/content/categories"
import type { Category } from "@/types/category"

/** Up to 3 cards per row; each needs ~20rem, so with larger text it drops to 2 or 1 */
export const CATEGORIES_GRID = "grid-cols-[repeat(auto-fill,minmax(min(100%,max(20rem,calc((100%_-_2rem)/3))),1fr))]"

/**
 * The six cards of the home, in this order. Each one is a category (its address and its content are the category's own, unchanged);
 * the title and the line under it are the home's wording. Primeros auxilios is not one of them: it has its own highlighted band.
 */
const HOME_CARD_WORDS: { id: string, title: string, description: string }[] = [
  { id: "centros", title: "Centros de atención", description: "Mapa de hospitales y centros de salud" },
  { id: "salud-fisica", title: "Salud general", description: "Controles, cuidados y calendario de vacunación" },
  { id: "esi", title: "Salud sexual - ESI", description: "Anticonceptivos, prevención y derechos sexuales" },
  { id: "animales", title: "Atención veterinaria", description: "Prevención, chequeos, castración gratuita y más" },
  { id: "salud-mental", title: "Salud mental", description: "Herramientas de autocuidado, y orientación: cómo pedir ayuda" },
  { id: "recursos", title: "Más recursos", description: "Derechos, leyes, FAQ, y trámites" },
]

export const HOME_CARDS: Category[] = HOME_CARD_WORDS.map(({ id, title, description }) => {
  const category = ALL_CATEGORIES.find((candidate) => candidate.id === id)
  if (!category) throw new Error(`Home card without category: ${id}`)
  return { ...category, title, description }
})
