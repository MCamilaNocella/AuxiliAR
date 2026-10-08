import { getEmergencyBarResources, getHelpLine, lineContact } from "@/data/resources/lines"
import { callButton } from "@/utils/helpLines"
import type { EmergencyNumber, FirstAidGuide } from "@/types/emergency"

/*
 * The numbers are NOT written here: they come from the verified help lines (data/resources/lines/nacional.json), the one
 * source for the emergency bar, the chat and everything else that names a number. Add or change a number there.
 * The label is the line's short name; where it works and when it answers (the part after " · " of the short name, and the
 * hours) are added by the buttons through callButton, so the same number says the same everywhere.
 */

const numberOf = (display: string): EmergencyNumber => ({ number: display, label: callButton(display).label })

/** The emergency bar, in its order: the first contact of each line */
export const EMERGENCY_NUMBERS: EmergencyNumber[] = getEmergencyBarResources().map((line) => numberOf(lineContact(line).display))

const displayOf = (id: string) => lineContact(getHelpLine(id)).display

/** The one that works all over the country (Central de Emergencias Nacional): what to say when only one number can be said */
export const GENERAL_EMERGENCY_NUMBER = displayOf("emergencias-911")

/** The ambulance (SAME) line: it exists by locality, so it is never offered as the one number for everyone */
export const AMBULANCE_NUMBER = displayOf("emergencias-107")

/** Fallback in the chat when Auxi says it is an emergency but picks no number: the ambulance (by locality) and the general one */
export const BASIC_EMERGENCY_NUMBERS: EmergencyNumber[] = [numberOf(AMBULANCE_NUMBER), numberOf(GENERAL_EMERGENCY_NUMBER)]

/** First aid guides (/primeros-auxilios/:slug) */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  { slug: "rcp", title: "RCP · no respira" },
  { slug: "atragantamiento", title: "Atragantamiento" },
  { slug: "quemaduras", title: "Quemaduras" },
]

/** Featured guides in the emergency bar (for now, all of them) */
export const FEATURED_FIRST_AID: FirstAidGuide[] = FIRST_AID_GUIDES
