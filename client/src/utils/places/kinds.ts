import type { ResolvedService, Resource } from "@/data/resources"

/**
 * The kind of place, to tell apart what a kind of care lists: a hospital, a centro de salud, a vacunatorio, a guardia… Most come from the
 * facility type the data declares; two are what the place offers (a vacunatorio is a place with a vaccination service, a guardia one
 * with a guardia), because a person looks for them as places, and a hospital or a CeSAC can be both.
 */
export const PLACE_KINDS = [
  { id: "hospital", label: "Hospitales" },
  { id: "health-center", label: "Otros centros de salud" },
  { id: "cesac", label: "Centros de Salud y Acción Comunitaria (CeSACs)" },
  { id: "vaccination-point", label: "Vacunatorios" },
  { id: "emergency-room", label: "Guardias" },
  { id: "mental-health-center", label: "Centros de salud mental" },
  { id: "health-promotion-station", label: "Estaciones Saludables" },
  { id: "zoonosis-center", label: "Centros de zoonosis" },
  { id: "public-veterinary", label: "Veterinarias públicas" },
  { id: "sports-center", label: "Polideportivos" },
  { id: "day-center", label: "Centros de día" },
  { id: "family-action-center", label: "Centros de acción familiar" },
  { id: "counseling-center", label: "Consejerías" },
  { id: "social-assistance-office", label: "Sedes de atención social" },
  { id: "community-organization", label: "Organizaciones civiles" },
  { id: "other", label: "Otros lugares" },
] as const

export type PlaceKindId = (typeof PLACE_KINDS)[number]["id"]

const KIND_IDS = new Set<string>(PLACE_KINDS.map(({ id }) => id))
export const isPlaceKind = (value: string | null | undefined): value is PlaceKindId => Boolean(value) && KIND_IDS.has(value as string)

export const placeKindLabel = (kind: PlaceKindId) => PLACE_KINDS.find(({ id }) => id === kind)?.label ?? kind

const GUARDIA_TYPES = new Set(["emergency-room", "mental-health-emergency"])

/** The kinds a place is, given the services that answer what is asked: its facility type, and vacunatorio / guardia when one of those services does */
export const kindsOf = (place: Resource, services: readonly ResolvedService[]): PlaceKindId[] => {
  const kinds: PlaceKindId[] = []
  const isCesac = Boolean(place.externalIds?.["caba-cesac"])
  if (isPlaceKind(place.facilityType) && !(isCesac && place.facilityType === "health-center")) kinds.push(place.facilityType)
  if (isCesac) kinds.push("cesac")
  if (services.some(({ type }) => type === "vaccination")) kinds.push("vaccination-point")
  if (services.some(({ type }) => GUARDIA_TYPES.has(type))) kinds.push("emergency-room")
  return kinds
}
