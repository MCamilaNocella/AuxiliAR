import coverageIndex from "./coverage.json"
import { RESOURCES, dialKey, todayInArgentina } from "./lines"
import taxonomy from "./taxonomy.json"
import type { CategoryId, Contact, ProvinceCode, ResolvedService, Resource, Service, ServiceType, Verification } from "./resources.types"

export type * from "./resources.types"
export { RESOURCES, dialKey, getEmergencyBarResources, getHelpLine, lineContact, todayInArgentina } from "./lines"

/*
 * Verified resources (help lines, and places with their services): the one place the app reads them from.
 * Nothing in the UI uses this yet. How it works and the editorial rules: ./README.md
 *
 * The files of lines/ are bundled with the app on purpose: emergency numbers can't depend on a request.
 * Places (hospitals, centers) are not in that bundle: places/<province>.json is loaded on demand, one province at a
 * time (loadPlaces). The functions below take the loaded places as their last argument.
 */
const placeLoaders = import.meta.glob<{ resources: Resource[] }>("./places/*.json", { import: "default" })
const placesByProvince = new Map<ProvinceCode, Promise<readonly Resource[]>>()
/** The provinces already downloaded, to answer at once when they are asked for again */
const loadedPlaces = new Map<ProvinceCode, readonly Resource[]>()

/**
 * The places of a province (places/<ar-c>.json), loaded the first time and kept. A province with no file has none.
 * One request per province, never the whole country. A failed load is not kept, so it can be retried.
 */
export const loadPlaces = (province: ProvinceCode): Promise<readonly Resource[]> => {
  const cached = placesByProvince.get(province)
  if (cached) return cached
  const load = placeLoaders[`./places/${province.toLowerCase()}.json`]
  const loading = load
    ? load().then((file) => {
        loadedPlaces.set(province, file.resources)
        return file.resources
      })
    : Promise.resolve([])
  placesByProvince.set(province, loading)
  loading.catch(() => placesByProvince.delete(province))
  return loading
}

/** The places of a province if they were already downloaded, else undefined (never starts a download) */
export const peekPlaces = (province: ProvinceCode): readonly Resource[] | undefined => loadedPlaces.get(province)

/**
 * What each places file has, WITHOUT downloading it: client/src/data/resources/coverage.json, generated from the places
 * by resources:sync (never edited; resources:check fails if it is out of date). It counts every place of the file, the
 * current and the expired, so it is for planning what to download - never for numbers shown to people. The one exception is
 * `quickFilters`, which is computed with the explorer's own rules (see scripts/resources-visibility.mjs).
 */
export type QuickFilterCoverage = {
  /** The first day on which no place is visible in the list any more: visible while today is before it */
  list: string
  /** The same for the places with verified coordinates (the pins); absent when none has them. Never later than `list` */
  map?: string
}

export type ProvinceCoverage = {
  places: number
  /** The day from which nothing in the file can be current anymore (null: nothing was verified) */
  currentUntil: string | null
  categories: CategoryId[]
  serviceTypes: ServiceType[]
  /** Divisions (comuna, partido…) the places are in */
  divisions: string[]
  /** What the map can show for each quick filter (by id of utils/places/filters), until when. A filter with nothing is absent */
  quickFilters?: Record<string, QuickFilterCoverage>
}

export const COVERAGE = coverageIndex.provinces as Partial<Record<ProvinceCode, ProvinceCoverage>>

/** Emergency or not is the kind, there's no separate flag to keep in step with it */
export const isEmergency = (resource: Resource) => resource.kind === "emergency"

/** Verified, and its review date hasn't arrived: from `nextReviewDue` on it stops being shown until it is verified again */
const isVerificationCurrent = ({ status, verifiedAt, nextReviewDue }: Verification, day: string) =>
  status === "verified" && Boolean(verifiedAt) && Boolean(nextReviewDue) && day < (nextReviewDue as string)

/** Whether the resource (or the establishment itself, for a place) can be shown to people */
export const isCurrent = (resource: Resource, day: string = todayInArgentina()) => isVerificationCurrent(resource.verification, day)

/* ── Places and their services ── */

/** The categories a service type belongs to (taxonomy.serviceTypes) */
export const categoriesOfServiceType = (type: ServiceType): CategoryId[] =>
  (taxonomy.serviceTypes.find((entry) => entry.id === type)?.categories ?? []) as CategoryId[]

/**
 * A service with what it inherits from its establishment filled in, and its categories derived from its type.
 * The same rules as client/scripts/resources-resolve.mjs (a test keeps both equal); they are written there.
 */
export const resolveService = (resource: Resource, service: Service): ResolvedService => ({
  id: service.id,
  type: service.type,
  name: service.name,
  description: service.description,
  hours: Object.hasOwn(service, "hours") ? (service.hours ?? null) : (resource.hours ?? null),
  cost: service.cost ?? resource.cost ?? "unknown",
  costNote: service.costNote ?? resource.costNote,
  requirements: service.requirements ?? resource.requirements ?? [],
  audience: service.audience ?? resource.audience ?? [],
  appointment: service.appointment ?? { mode: "unknown" },
  contacts: service.contacts ?? [],
  source: service.source ?? resource.source,
  evidence: service.evidence ?? [],
  verification: service.verification ?? resource.verification,
  categories: categoriesOfServiceType(service.type),
})

/** Every service of the establishment, resolved (empty for a resource without services) */
export const getServices = (resource: Resource): ResolvedService[] => (resource.services ?? []).map((service) => resolveService(resource, service))

/** A service is current when its establishment is, and its own verification (or the one it inherits) is */
export const isServiceCurrent = (resource: Resource, service: ResolvedService, day: string = todayInArgentina()) =>
  isCurrent(resource, day) && isVerificationCurrent(service.verification, day)

export const getCurrentServices = (resource: Resource, day: string = todayInArgentina()) =>
  getServices(resource).filter((service) => isServiceCurrent(resource, service, day))

/** Whether a place can be drawn on the map: its coordinates were verified (an address alone only goes in the list) */
export const isMappable = (resource: Resource) => resource.coordinates?.status === "verified"

/* ── Queries ── */

/** Resources that can be shown: for a place, only if it has at least one current service */
export const getCurrentResources = (day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  resources.filter((resource) => isCurrent(resource, day) && ((resource.services ?? []).length === 0 || getCurrentServices(resource, day).length > 0))

/** Establishments (resources with services) that can be shown */
export const getCurrentPlaces = (day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  getCurrentResources(day, resources).filter((resource) => (resource.services ?? []).length > 0)

/** Link that dials (phone) or opens the chat (WhatsApp) */
export const contactHref = ({ type, dial }: Contact) => (type === "whatsapp" ? `https://wa.me/${dialKey(dial)}` : `tel:${dial}`)
