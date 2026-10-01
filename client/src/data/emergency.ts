import type { EmergencyNumber, FirstAidGuide } from "@/types/emergency"

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { number: "107", label: "Ambulancia" },
  { number: "911", label: "Policía" },
  { number: "144", label: "Violencia" },
  { number: "135", label: "Crisis" },
  { number: "102", label: "Niñez" },
]

/** First aid guides (/primeros-auxilios/:slug) */
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  { slug: "rcp", title: "RCP · no respira" },
  { slug: "atragantamiento", title: "Atragantamiento" },
  { slug: "quemaduras", title: "Quemaduras" },
]

/** Featured guides in the emergency bar (for now, all of them) */
export const FEATURED_FIRST_AID: FirstAidGuide[] = FIRST_AID_GUIDES
