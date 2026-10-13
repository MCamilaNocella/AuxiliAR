import { getHelpLine, lineContact } from "@/data/resources/lines"
import { callButton } from "@/utils/helpLines"
import type { EmergencyNumber, FirstAidGuide } from "@/types/emergency"

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { number: "107", label: "SAME" },
  { number: "911", label: "Policía" },
  { number: "100", label: "Bomberos" },
  { number: "135", label: "Apoyo emocional/crisis" },
  { number: "102", label: "Protección al menor" },
  { number: "144", label: "Violencia de género" },
]

/*
 * Numbers named in the chat, the map's urgent help and the call notices. They come from the verified help lines
 * (data/resources/lines/nacional.json), so the same number says the same everywhere.
 */
const numberOf = (display: string): EmergencyNumber => ({ number: display, label: callButton(display).label })
const displayOf = (id: string) => lineContact(getHelpLine(id)).display

/** The one that works all over the country (Central de Emergencias Nacional): what to say when only one number can be said */
export const GENERAL_EMERGENCY_NUMBER = displayOf("emergencias-911")

/** The ambulance (SAME) line: it exists by locality, so it is never offered as the one number for everyone */
export const AMBULANCE_NUMBER = displayOf("emergencias-107")

/** Fallback in the chat when Auxi says it is an emergency but picks no number: the ambulance (by locality) and the general one */
export const BASIC_EMERGENCY_NUMBERS: EmergencyNumber[] = [numberOf(AMBULANCE_NUMBER), numberOf(GENERAL_EMERGENCY_NUMBER)]

/** First aid guides (/primeros-auxilios/:slug) */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  { slug: "reacciones-alergicas", title: "Reacciones alérgicas" },
  { slug: "heridas", title: "Heridas y cortes" },
  { slug: "quemaduras", title: "Quemaduras" },
]

/** Featured guides in the emergency bar (for now, all of them) */
export const FEATURED_FIRST_AID: FirstAidGuide[] = FIRST_AID_GUIDES
