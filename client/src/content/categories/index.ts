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

/** Categories shown as cards on the home screen, in this order */
export const CATEGORIES: Category[] = [HEALTH_CENTERS, PHYSICAL_HEALTH, SEX_EDUCATION, ANIMALS, MENTAL_HEALTH, RESOURCES]

/** Screens that use the category layout but aren't home cards: Sobre AuxiliAR (linked from the footer) and Primeros auxilios */
const OTHER_CATEGORIES: Category[] = [ABOUT, FIRST_AID]

/** Every screen rendered with the category layout */
export const ALL_CATEGORIES: Category[] = [...CATEGORIES, ...OTHER_CATEGORIES]
