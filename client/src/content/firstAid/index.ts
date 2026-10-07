import { EMERGENCY_GUIDES } from "./guides/emergencies"
import { INJURY_GUIDES } from "./guides/injuries"
import { PREPARE_GUIDES } from "./guides/prepare"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import type { FirstAidGuideContent, GuideGroupId } from "./types"

export type * from "./types"
export { CALL_INFO } from "./call"

/** Every first aid guide, in the order they are shown. The only copy of the instructions */
export const FIRST_AID_GUIDE_CONTENT: FirstAidGuideContent[] = [...EMERGENCY_GUIDES, ...INJURY_GUIDES, ...PREPARE_GUIDES]

/**
 * Where the guides are listed. For now it is Salud general → Primeros auxilios: the Primeros auxilios category
 * (/primeros-auxilios) still has no content, so nothing links there. Change this one line when it hosts the guides.
 */
export const FIRST_AID_HUB_PATH = `${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-3`

export const getFirstAidGuide = (slug: string | undefined) => FIRST_AID_GUIDE_CONTENT.find((guide) => guide.slug === slug)

export const GUIDE_GROUPS: { id: GuideGroupId, title: string }[] = [
  { id: "now", title: "Necesito actuar ahora" },
  { id: "injuries", title: "Accidentes y lesiones frecuentes" },
  { id: "prepare", title: "Prepararte también ayuda" },
]

export const getGuidesOfGroup = (group: GuideGroupId) => FIRST_AID_GUIDE_CONTENT.filter((guide) => guide.group === group)

