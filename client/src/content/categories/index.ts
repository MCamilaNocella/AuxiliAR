import type { Category } from "@/types/category"
import { ABOUT } from "./About"
import { ANIMALS } from "./Animals"
import { FIRST_AID } from "./FirstAid"
import { HEALTH_CENTERS } from "./HealthCenters"
import { MENTAL_HEALTH } from "./MentalHealth"
import { PHYSICAL_HEALTH } from "./PhysicalHealth"
import { RESOURCES } from "./Resources"
import { SEX_EDUCATION } from "./SexEducation"

// Each category (texts, illustration, sections and their content) is defined in its own folder next to this file

/** Categories shown as cards on the home screen */
export const CATEGORIES: Category[] = [HEALTH_CENTERS, PHYSICAL_HEALTH, MENTAL_HEALTH, SEX_EDUCATION, ANIMALS, FIRST_AID]

/**
 * Screens that use the category layout but aren't home cards: Sobre AuxiliAR (linked from the footer) and Más recursos
 * (not shown anywhere while it is empty: its address redirects to the home, see the router)
 */
const OTHER_CATEGORIES: Category[] = [ABOUT, RESOURCES]

/** Every screen rendered with the category layout */
export const ALL_CATEGORIES: Category[] = [...CATEGORIES, ...OTHER_CATEGORIES]
