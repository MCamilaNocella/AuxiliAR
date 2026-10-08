import taxonomy from "@/data/resources/taxonomy.json"
import { getCurrentPlaces, getCurrentServices } from "@/data/resources"
import type { CategoryId, ProvinceCode, ResolvedService, Resource, ServiceType } from "@/data/resources"
import { isVerifiedFree, serviceName } from "./format"
import { normalizeText, stemOf } from "./text"

/** A place with the services that can be shown today (the verified, not expired ones) */
export type PlaceEntry = {
  place: Resource
  services: ResolvedService[]
}

export type PlaceFilterId = "all" | "medical" | "mental-health" | "sexual-health" | "vaccination" | "dentistry" | "emergency" | "animal-health"

/**
 * The simple filters people see. Each one groups service types (taxonomy.serviceTypes); "all" has none.
 * Human care and animal care never share a group: the types of the category "animales" are only in "animal-health"
 * (and in "Todos"), and no other group has one of them (the tests of places-animal check it).
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
  { id: "vaccination", label: "Vacunación", types: ["vaccination"] },
  { id: "dentistry", label: "Odontología", types: ["dentistry"] },
  { id: "emergency", label: "Guardias", types: ["emergency-room", "mental-health-emergency"] },
  { id: "animal-health", label: "Salud animal", types: ["rabies-vaccination", "spaying-neutering", "veterinary-care", "zoonosis"] },
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

/** Whether any of the places has a service of that quick filter: a filter with none promises no results (it is not offered, and a link to it says so) */
export const quickFilterHasData = (filterId: PlaceFilterId, entries: readonly PlaceEntry[]) => entries.some(({ services }) => services.some((service) => matchesFilter(service, filterId)))

const matchesFilter = (service: ResolvedService, filterId: PlaceFilterId) => {
  const types = PLACE_FILTERS.find(({ id }) => id === filterId)?.types
  return !types || types.includes(service.type)
}

/**
 * Everything a person can ask of the places, in one value. List, map, counters and the options of every filter are
 * computed from it (selectPlaces, getPlaceFacets), so there is one copy of the filtering logic.
 *  - text: words that have to be somewhere in the place or its services
 *  - filterId: a quick group of services ("Vacunación", "Guardias"…); "all" is none
 *  - province / zone: where it is. The zone is the division of that province (comuna, partido, departamento), as the
 *    data writes it in address.department; it only makes sense with a province
 *  - category: the places that have a verified service of that category (a place can be in several)
 *  - type: the places that have that service (prestación)
 *  - free: only services whose gratuity is verified for that very service (see isVerifiedFree); never inferred
 * Each criterion narrows the others (AND). The service criteria (filter, category, type, free) must hold for the same service.
 * "gratis", "gratuita"… typed in the search mean `free` too (see conditionsOf): the words are not looked for as free text.
 */
export type PlaceQuery = {
  text: string
  filterId: PlaceFilterId
  province: ProvinceCode | null
  zone: string | null
  category: CategoryId | null
  type: ServiceType | null
  free: boolean
}

export const EMPTY_PLACE_QUERY: PlaceQuery = { text: "", filterId: "all", province: null, zone: null, category: null, type: null, free: false }

/** The words that ask for gratuity. They are a condition, not something a place's text says */
const FREE_WORDS = new RegExp("(^|[^a-z])(gratis|gratuit[oa]s?|sin costo)(?![a-z])", "gi")

/**
 * What the search text asks as a condition: "odontologia gratuita" is odontología + only verified gratuity. `rest` is the
 * text without those words, to look for; `free` says whether they were there. The typed text itself is never changed.
 */
export const conditionsOf = (text: string): { rest: string, free: boolean } => {
  const normalized = normalizeText(text)
  const free = new RegExp(FREE_WORDS.source, "i").test(normalized)
  return { rest: free ? normalized.replace(FREE_WORDS, "$1").replace(/\s+/g, " ").trim() : text, free }
}

/** The text with the condition words taken out, as the person wrote it (to remove the filter that came from the words) */
export const withoutConditionWords = (text: string) =>
  text.replace(new RegExp("(^|[^A-Za-z])(gratis|gratuit[oa]s?|sin costo)(?![A-Za-z])", "gi"), "$1").replace(/\s+/g, " ").trim()

/** The query as it is answered: the condition words of the text become filters */
export const effectiveQuery = (query: PlaceQuery): PlaceQuery => {
  const { rest, free } = conditionsOf(query.text)
  return free ? { ...query, text: rest, free: true } : query
}

const matchesServiceCriteria = (place: Resource, service: ResolvedService, { filterId, category, type, free }: PlaceQuery) =>
  matchesFilter(service, filterId) && (!category || service.categories.includes(category)) && (!type || service.type === type) && (!free || isVerifiedFree(place, service))

const matchesTerritory = (place: Resource, { province, zone }: PlaceQuery) =>
  (!province || place.address?.province === province) && (!zone || place.address?.department === zone)

const typeLabel = (type: ServiceType) => taxonomy.serviceTypes.find(({ id }) => id === type)?.label

/** What a service says about itself, for the search */
const serviceTexts = (service: ResolvedService) => [serviceName(service), typeLabel(service.type), service.description, service.costNote, service.appointment.howTo, ...service.requirements]

/** What names the place itself: its names and where it is */
const placeTexts = ({ place }: PlaceEntry) => [place.name, place.shortName, ...(place.aliases ?? []), place.address?.street, place.address?.neighborhood, place.address?.locality, place.address?.reference]

const joinText = (texts: (string | undefined)[]) => normalizeText(texts.filter(Boolean).join(" "))

/** Everything a person could type to find the place: names, address, and what each service says about itself */
const searchableText = (entry: PlaceEntry) => joinText([...placeTexts(entry), ...entry.services.flatMap(serviceTexts)])

/** The words of a search, each reduced to its root (see stemOf) */
const searchTerms = (text: string) => normalizeText(text).split(/\s+/).filter(Boolean).map(stemOf)

/** Every word typed has to be somewhere in the place or its services (accents and case don't matter) */
export const matchesQuery = (entry: PlaceEntry, query: string) => {
  const terms = searchTerms(query)
  if (terms.length === 0) return true
  const text = searchableText(entry)
  return terms.every((term) => text.includes(term))
}

/**
 * The places that answer a query: the single place where "which places do I show" is decided. Nothing expired or
 * unverified comes out; each place keeps its current services, the ones that answer the query first.
 */
export const selectPlaces = (places: readonly Resource[], day: string, asked: PlaceQuery, scope: PlacesScope = {}): PlaceEntry[] => {
  const query = effectiveQuery(asked)
  const allowed = scopeTypes(scope)
  return getCurrentPlaces(day, places)
    .filter((place) => matchesTerritory(place, query))
    .flatMap((place) => {
      const services = getCurrentServices(place, day).filter((service) => !allowed || allowed.has(service.type))
      if (!services.some((service) => matchesServiceCriteria(place, service, query))) return []
      // Stable sort: inside each group the data's order is kept
      const sorted = [...services].sort((a, b) => Number(matchesServiceCriteria(place, b, query)) - Number(matchesServiceCriteria(place, a, query)))
      return [{ place, services: sorted }]
    })
    .filter((entry) => matchesQuery(entry, query.text))
}

/**
 * The services of a place that answer what was asked, for the panel to lead with them. A service answers when it meets the
 * kind of care / service filters and, if words were typed, when those words are in the place or its services and at least one
 * of them is something only the service says (a word the place's own name or address has too says nothing about which service).
 * With nothing asked, or when the words only match the place, no service is picked: nothing is made up.
 */
export const matchingServices = (entry: PlaceEntry, asked: PlaceQuery): ResolvedService[] => {
  const query = effectiveQuery(asked)
  const terms = searchTerms(query.text)
  const hasCriteria = query.filterId !== "all" || query.category !== null || query.type !== null || query.free
  if (terms.length === 0 && !hasCriteria) return []
  const placeText = joinText(placeTexts(entry))
  return entry.services.filter((service) => {
    if (!matchesServiceCriteria(entry.place, service, query)) return false
    if (terms.length === 0) return true
    const own = joinText(serviceTexts(service))
    return terms.every((term) => own.includes(term) || placeText.includes(term)) && terms.some((term) => own.includes(term) && !placeText.includes(term))
  })
}

/** A value of a filter and how many places have it */
export type PlaceFacet<T> = { value: T, count: number }

export type PlaceFacets = {
  provinces: PlaceFacet<ProvinceCode>[]
  /** The divisions of the chosen province; none while no province is chosen (a comuna and a partido are not comparable) */
  zones: PlaceFacet<string>[]
  categories: PlaceFacet<CategoryId>[]
  types: PlaceFacet<ServiceType>[]
  /** How many places have a service with verified gratuity under the other criteria (0: the filter is not offered) */
  free: number
}

/** Whether any option of the filters shows a number: the note that explains the numbers only makes sense then */
export const hasVisibleCounts = (facets: PlaceFacets) => facets.categories.length > 0 || facets.types.length > 0 || facets.zones.length > 0 || facets.free > 0

const tally = <T>(groups: T[][]): PlaceFacet<T>[] => {
  const counts = new Map<T, number>()
  for (const values of groups) for (const value of new Set(values)) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts].map(([value, count]) => ({ value, count }))
}

/**
 * What can be chosen next, with counts: for each filter, the places that answer the query WITHOUT that filter (so you
 * can change your mind), counted once per place. A value with no places is never offered. A place counts in every
 * category and type of its services that answer the other criteria.
 */
export const getPlaceFacets = (places: readonly Resource[], day: string, asked: PlaceQuery, scope: PlacesScope = {}): PlaceFacets => {
  // The words of gratuity in the text are already a filter here, so taking the filter off takes them off too
  const query = effectiveQuery(asked)
  const without = (criteria: Partial<PlaceQuery>) => selectPlaces(places, day, { ...query, ...criteria }, scope)
  const matching = (entries: PlaceEntry[], criteria: PlaceQuery) =>
    entries.map(({ place, services }) => services.filter((service) => matchesServiceCriteria(place, service, criteria)))

  const byProvince = without({ province: null, zone: null })
  const byZone = query.province ? without({ zone: null }) : []
  const byCategory = without({ category: null })
  const byType = without({ type: null })
  const byFree = without({ free: false })

  return {
    provinces: tally(byProvince.map(({ place }) => (place.address?.province ? [place.address.province] : []))),
    zones: tally(byZone.map(({ place }) => (place.address?.department ? [place.address.department] : []))),
    categories: tally(matching(byCategory, { ...query, category: null }).map((services) => services.flatMap((service) => service.categories))),
    types: tally(matching(byType, { ...query, type: null }).map((services) => services.map((service) => service.type))),
    free: matching(byFree, { ...query, free: true }).filter((services) => services.length > 0).length,
  }
}

/** Places that can be shown today, each with its current services (the ones of the active filter first) */
export const getPlaceEntries = (places: readonly Resource[], day: string, filterId: PlaceFilterId = "all", scope: PlacesScope = {}): PlaceEntry[] =>
  selectPlaces(places, day, { ...EMPTY_PLACE_QUERY, filterId }, scope)

export const filterPlaces = (
  places: readonly Resource[],
  day: string,
  { query, filterId, scope }: { query: string, filterId: PlaceFilterId, scope?: PlacesScope },
) => selectPlaces(places, day, { ...EMPTY_PLACE_QUERY, text: query, filterId }, scope)
