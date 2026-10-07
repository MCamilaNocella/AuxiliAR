import type { CategoryId, Contact, Resource } from "./resources.types"

export type * from "./resources.types"

/*
 * Verified resources (help lines, and later centers): the one place the app reads them from.
 * Nothing in the UI uses this yet. How it works and the editorial rules: ./README.md
 *
 * The files of lines/ are bundled with the app on purpose: emergency numbers can't depend on a request.
 * Places (hospitals, centers) will be loaded on demand, not bundled.
 */
const files = import.meta.glob<{ resources: Resource[] }>("./lines/*.json", { eager: true, import: "default" })

/** Every resource, whatever its verification status. For people and Auxi use `getCurrentResources` */
export const RESOURCES: readonly Resource[] = Object.values(files).flatMap((file) => file.resources)

const DAY_FORMAT = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" })

/** Today as YYYY-MM-DD in Argentina (the same day for everyone, wherever the browser is) */
export const todayInArgentina = (now: Date = new Date()) => DAY_FORMAT.format(now)

/** What numbers are compared by: digits only, so "0800-333-0160" and "08003330160" are the same one */
export const dialKey = (dial: string) => dial.replace(/\D/g, "")

/** Emergency or not is the kind, there's no separate flag to keep in step with it */
export const isEmergency = (resource: Resource) => resource.kind === "emergency"

/**
 * Whether it can be shown to people: verified, and its review date hasn't arrived
 * (from `nextReviewDue` on, it stops being shown until someone verifies it again).
 */
export const isCurrent = (resource: Resource, day: string = todayInArgentina()) => {
  const { status, verifiedAt, nextReviewDue } = resource.verification
  return status === "verified" && Boolean(verifiedAt) && Boolean(nextReviewDue) && day < (nextReviewDue as string)
}

export const getResourceById = (id: string) => RESOURCES.find((resource) => resource.id === id)

/** Any resource with that number, current or not (compares digits only) */
export const findResourceByDial = (dial: string) => {
  const key = dialKey(dial)
  return RESOURCES.find((resource) => resource.contacts.some((contact) => dialKey(contact.dial) === key))
}

export const getCurrentResources = (day: string = todayInArgentina()) => RESOURCES.filter((resource) => isCurrent(resource, day))

export const getCurrentResourcesByCategory = (category: CategoryId, day: string = todayInArgentina()) =>
  getCurrentResources(day).filter((resource) => resource.categories?.includes(category))

/** Current emergency resources that are in the emergency bar, in its order */
export const getEmergencyBarResources = (day: string = todayInArgentina()) =>
  getCurrentResources(day)
    .filter((resource) => isEmergency(resource) && resource.display?.emergencyBarOrder !== undefined)
    .sort((a, b) => (a.display?.emergencyBarOrder ?? 0) - (b.display?.emergencyBarOrder ?? 0))

/** Link that dials (phone) or opens the chat (WhatsApp) */
export const contactHref = ({ type, dial }: Contact) => (type === "whatsapp" ? `https://wa.me/${dialKey(dial)}` : `tel:${dial}`)
