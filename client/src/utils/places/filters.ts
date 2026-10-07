import taxonomy from "@/data/resources/taxonomy.json"
import { getCurrentPlaces, getCurrentServices } from "@/data/resources"
import type { CategoryId, ResolvedService, Resource, ServiceType } from "@/data/resources"
import { serviceName } from "./format"
import { normalizeText } from "./text"

/** A place with the services that can be shown today (the verified, not expired ones) */
export type PlaceEntry = {
  place: Resource
  services: ResolvedService[]
}

export type PlaceFilterId = "all" | "medical" | "mental-health" | "sexual-health" | "vaccination" | "dentistry" | "emergency"

/**
 * The simple filters people see. Each one groups service types (taxonomy.serviceTypes); "all" has none.
 * Types outside every group (animals) are only in "Todos".
 */
export const PLACE_FILTERS: { id: PlaceFilterId, label: string, types: ServiceType[] | null }[] = [
  { id: "all", label: "Todos", types: null },
  { id: "medical", label: "Atención médica", types: ["primary-care", "specialty-care", "ophthalmology", "diagnostic-imaging", "laboratory", "pharmacy"] },
  { id: "mental-health", label: "Salud mental", types: ["mental-health-care", "mental-health-emergency"] },
  {
    id: "sexual-health",
    label: "Salud sexual",
    types: [
      "sexual-reproductive-health",
      "contraception",
      "emergency-contraception",
      "condoms",
      "pregnancy-care",
      "sti-testing-care",
      "ive-ile-care",
      "sexual-health-counseling",
    ],
  },
  { id: "vaccination", label: "Vacunación", types: ["vaccination", "rabies-vaccination"] },
  { id: "dentistry", label: "Odontología", types: ["dentistry"] },
  { id: "emergency", label: "Guardias", types: ["emergency-room", "mental-health-emergency"] },
]

/**
 * What belongs to the place where the explorer is embedded, by service type: `serviceTypes` and/or the types that
 * derive to `category` (taxonomy.serviceTypes). With both, only the types in both. Services out of the scope are
 * never shown (not in the cards, the search or the panel); a place with none in scope is left out. No scope: all.
 */
export type PlacesScope = {
  category?: CategoryId
  serviceTypes?: ServiceType[]
}

const scopeTypes = ({ category, serviceTypes }: PlacesScope): Set<ServiceType> | null => {
  const ofCategory = category
    ? taxonomy.serviceTypes.filter(({ categories }) => (categories as string[]).includes(category)).map(({ id }) => id as ServiceType)
    : null
  if (ofCategory && serviceTypes) return new Set(serviceTypes.filter((type) => ofCategory.includes(type)))
  if (ofCategory || serviceTypes) return new Set(ofCategory ?? serviceTypes)
  return null
}

const matchesFilter = (service: ResolvedService, filterId: PlaceFilterId) => {
  const types = PLACE_FILTERS.find(({ id }) => id === filterId)?.types
  return !types || types.includes(service.type)
}

const typeLabel = (type: ServiceType) => taxonomy.serviceTypes.find(({ id }) => id === type)?.label

/** Everything a person could type to find the place: names, address, and what each service says about itself */
const searchableText = ({ place, services }: PlaceEntry) =>
  normalizeText(
    [
      place.name,
      place.shortName,
      ...(place.aliases ?? []),
      place.address?.street,
      place.address?.neighborhood,
      place.address?.locality,
      place.address?.reference,
      ...services.flatMap((service) => [
        serviceName(service),
        typeLabel(service.type),
        service.description,
        service.costNote,
        service.appointment.howTo,
        ...service.requirements,
      ]),
    ]
      .filter(Boolean)
      .join(" "),
  )

/** Every word typed has to be somewhere in the place or its services (accents and case don't matter) */
export const matchesQuery = (entry: PlaceEntry, query: string) => {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const text = searchableText(entry)
  return terms.every((term) => text.includes(term))
}

/** Places that can be shown today, each with its current services (the ones of the active filter first) */
export const getPlaceEntries = (places: readonly Resource[], day: string, filterId: PlaceFilterId = "all", scope: PlacesScope = {}): PlaceEntry[] => {
  const allowed = scopeTypes(scope)
  return getCurrentPlaces(day, places).flatMap((place) => {
    const services = getCurrentServices(place, day).filter((service) => !allowed || allowed.has(service.type))
    if (!services.some((service) => matchesFilter(service, filterId))) return []
    // Stable sort: inside each group the data's order is kept
    const sorted = [...services].sort((a, b) => Number(matchesFilter(b, filterId)) - Number(matchesFilter(a, filterId)))
    return [{ place, services: sorted }]
  })
}

export const filterPlaces = (
  places: readonly Resource[],
  day: string,
  { query, filterId, scope }: { query: string, filterId: PlaceFilterId, scope?: PlacesScope },
) => getPlaceEntries(places, day, filterId, scope).filter((entry) => matchesQuery(entry, query))
