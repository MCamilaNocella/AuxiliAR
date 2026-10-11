import type { EmergencyNumber, FirstAidGuide } from "@/types/emergency"

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { number: "107", label: "SAME" },
  { number: "911", label: "Policía" },
  { number: "100", label: "Bomberos" },
  { number: "135", label: "Apoyo emocional/crisis" },
  { number: "102", label: "Protección al menor" },
  { number: "144", label: "Violencia de género" },
]

/** First aid guides (/primeros-auxilios/:slug) */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  { slug: "reacciones-alergicas", title: "Reacciones alérgicas" },
  { slug: "heridas-y-cortes", title: "Heridas y cortes" },
  { slug: "quemaduras", title: "Quemaduras" },
]

/** Featured guides in the emergency bar (for now, all of them) */
export const FEATURED_FIRST_AID: FirstAidGuide[] = FIRST_AID_GUIDES
