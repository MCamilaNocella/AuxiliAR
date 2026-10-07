import taxonomy from "./taxonomy.json"
import type { CategoryId, Contact, ProvinceCode, ResolvedService, Resource, Service, ServiceType, Verification } from "./resources.types"

export type * from "./resources.types"

/*
 * Verified resources (help lines, and places with their services): the one place the app reads them from.
 * Nothing in the UI uses this yet. How it works and the editorial rules: ./README.md
 *
 * The files of lines/ are bundled with the app on purpose: emergency numbers can't depend on a request.
 * Places (hospitals, centers) are not in that bundle: places/<province>.json is loaded on demand, one province at a
 * time (loadPlaces). The functions below take the loaded places as their last argument.
 */
const files = import.meta.glob<{ resources: Resource[] }>("./lines/*.json", { eager: true, import: "default" })

const placeLoaders = import.meta.glob<{ resources: Resource[] }>("./places/*.json", { import: "default" })
const placesByProvince = new Map<ProvinceCode, Promise<readonly Resource[]>>()

/**
 * The places of a province (places/<ar-c>.json), loaded the first time and kept. A province with no file has none.
 * One request per province, never the whole country. A failed load is not kept, so it can be retried.
 */
export const loadPlaces = (province: ProvinceCode): Promise<readonly Resource[]> => {
  const cached = placesByProvince.get(province)
  if (cached) return cached
  const load = placeLoaders[`./places/${province.toLowerCase()}.json`]
  const loading = load ? load().then((file) => file.resources) : Promise.resolve([])
  placesByProvince.set(province, loading)
  loading.catch(() => placesByProvince.delete(province))
  return loading
}

/**
 * The provinces that have a places file: where AuxiliAR has places to show, known without downloading any of them.
 * Which of those have a place that is current today is decided with the data (getPlaceFacets).
 */
export const PROVINCES_WITH_PLACE_FILES: readonly ProvinceCode[] = Object.keys(placeLoaders)
  .map((path) => /places\/(.+)\.json$/.exec(path)?.[1].toUpperCase() as ProvinceCode | undefined)
  .filter((code): code is ProvinceCode => code !== undefined)
  .sort()

/** Every resource, whatever its verification status. For people and Auxi use the `getCurrent…` functions */
export const RESOURCES: readonly Resource[] = Object.values(files).flatMap((file) => file.resources)

const DAY_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" })

/** Today as YYYY-MM-DD in Argentina (the same day for everyone, wherever the browser is) */
export const todayInArgentina = (now: Date = new Date()) => DAY_FORMAT.format(now)

/** What numbers are compared by: digits only, so "0800-333-0160" and "08003330160" are the same one */
export const dialKey = (dial: string) => dial.replace(/\D/g, "")

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

/** What an establishment shows up under: derived from its services, never written (sorted, without repeats) */
export const getDerivedCategories = (resource: Resource): CategoryId[] =>
  [...new Set(getServices(resource).flatMap((service) => service.categories))].sort()

/** Derived from the services for a place; the resource's own `categories` for the rest */
export const getCategories = (resource: Resource): CategoryId[] =>
  (resource.services ?? []).length > 0 ? getDerivedCategories(resource) : (resource.categories ?? [])

/** Whether a place can be drawn on the map: its coordinates were verified (an address alone only goes in the list) */
export const isMappable = (resource: Resource) => resource.coordinates?.status === "verified"

/* ── Queries ── */

export const getResourceById = (id: string) => RESOURCES.find((resource) => resource.id === id)

/** The contacts of the resource and of its services */
const allContacts = (resource: Resource): Contact[] => [...(resource.contacts ?? []), ...(resource.services ?? []).flatMap((service) => service.contacts ?? [])]

/** Any resource with that number, current or not (compares digits only) */
export const findResourceByDial = (dial: string) => {
  const key = dialKey(dial)
  return RESOURCES.find((resource) => allContacts(resource).some((contact) => dialKey(contact.dial) === key))
}

/**
 * The current resources that have that number. Several places can share one, so it's a list. A service's own
 * number only counts while that service is current.
 */
export const findCurrentResourcesByDial = (dial: string, day: string = todayInArgentina()) => {
  const key = dialKey(dial)
  return RESOURCES.filter(
    (resource) =>
      isCurrent(resource, day) &&
      [...(resource.contacts ?? []), ...getCurrentServices(resource, day).flatMap((service) => service.contacts)].some((contact) => dialKey(contact.dial) === key),
  )
}

/** Resources that can be shown: for a place, only if it has at least one current service */
export const getCurrentResources = (day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  resources.filter((resource) => isCurrent(resource, day) && ((resource.services ?? []).length === 0 || getCurrentServices(resource, day).length > 0))

/** In a category: a place by a current service of that category, any other resource by its own `categories` */
export const getCurrentResourcesByCategory = (category: CategoryId, day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  getCurrentResources(day, resources).filter((resource) =>
    (resource.services ?? []).length > 0
      ? getCurrentServices(resource, day).some((service) => service.categories.includes(category))
      : (resource.categories ?? []).includes(category),
  )

/** Establishments (resources with services) that can be shown */
export const getCurrentPlaces = (day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  getCurrentResources(day, resources).filter((resource) => (resource.services ?? []).length > 0)

export const getCurrentPlacesByCategory = (category: CategoryId, day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  getCurrentResourcesByCategory(category, day, resources).filter((resource) => (resource.services ?? []).length > 0)

/** Places that can be shown and drawn on the map */
export const getCurrentMappablePlaces = (day: string = todayInArgentina(), resources: readonly Resource[] = RESOURCES) =>
  getCurrentPlaces(day, resources).filter(isMappable)

/** Current emergency resources that are in the emergency bar, in its order */
export const getEmergencyBarResources = (day: string = todayInArgentina()) =>
  getCurrentResources(day)
    .filter((resource) => isEmergency(resource) && resource.display?.emergencyBarOrder !== undefined)
    .sort((a, b) => (a.display?.emergencyBarOrder ?? 0) - (b.display?.emergencyBarOrder ?? 0))

/** Link that dials (phone) or opens the chat (WhatsApp) */
export const contactHref = ({ type, dial }: Contact) => (type === "whatsapp" ? `https://wa.me/${dialKey(dial)}` : `tel:${dial}`)
