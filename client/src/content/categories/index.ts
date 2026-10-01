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
export const CATEGORIES: Category[] = [PHYSICAL_HEALTH, MENTAL_HEALTH, SEX_EDUCATION, ANIMALS, HEALTH_CENTERS, RESOURCES]

/** Sections that use the category screen but aren't home cards */
const OTHER_CATEGORIES: Category[] = [FIRST_AID, ABOUT]

/** Every screen rendered with the category layout */
export const ALL_CATEGORIES: Category[] = [...CATEGORIES, ...OTHER_CATEGORIES]
