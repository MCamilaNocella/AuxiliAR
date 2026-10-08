import { getEmergencyBarResources, getHelpLine, lineContact } from "@/data/resources"
import type { EmergencyNumber, FirstAidGuide } from "@/types/emergency"

/*
 * The numbers are NOT written here: they come from the verified help lines (data/resources/lines/nacional.json), the one
 * source for the emergency bar, the chat and everything else that names a number. Add or change a number there.
 */

/** The emergency bar, in its order: the first contact of each line, with the label the bar shows */
export const EMERGENCY_NUMBERS: EmergencyNumber[] = getEmergencyBarResources().map((line) => ({ number: lineContact(line).display, label: line.shortName ?? line.name }))

const numberOf = (id: string): EmergencyNumber => {
  const line = getHelpLine(id)
  return { number: lineContact(line).display, label: line.shortName ?? line.name }
}

/** The one that works all over the country (Central de Emergencias Nacional): what to say when only one number can be said */
export const GENERAL_EMERGENCY_NUMBER = numberOf("emergencias-911").number

/** The ambulance (SAME) line: it exists by jurisdiction, so it is never offered as the one number for everyone */
export const AMBULANCE_NUMBER = numberOf("emergencias-107").number

/** Fallback in the chat when Auxi says it is an emergency but picks no number: the general one and the ambulance */
export const BASIC_EMERGENCY_NUMBERS: EmergencyNumber[] = [numberOf("emergencias-107"), numberOf("emergencias-911")]

/** First aid guides (/primeros-auxilios/:slug) */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  { slug: "rcp", title: "RCP · no respira" },
  { slug: "atragantamiento", title: "Atragantamiento" },
  { slug: "quemaduras", title: "Quemaduras" },
]

/** Featured guides in the emergency bar (for now, all of them) */
export const FEATURED_FIRST_AID: FirstAidGuide[] = FIRST_AID_GUIDES
