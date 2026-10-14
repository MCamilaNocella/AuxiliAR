import { isMappable } from "@/data/resources"
import type { CategoryId, ServiceType } from "@/data/resources"
import { matchingServices } from "./filters"
import type { PlaceEntry, PlaceQuery } from "./filters"
import { facilityTypeLabel, isVerifiedFree, serviceName } from "./format"

/** A place that can be drawn on the map: its coordinates were verified. Nothing is ever geocoded in the browser */
export type MapPin = {
  id: string
  name: string
  lat: number
  lng: number
  /** What kind of place it is, short: "Centro de salud", "Hospital" (what the pin says when it is hovered or focused) */
  kind: string
  /** The category of the place, for the symbol of its pin (see pinCategory) */
  category: CategoryId
  /** Services with verified free access, for the icons shown in the map tooltip */
  services: { id: string, type: ServiceType, name: string, category: CategoryId | undefined }[]
  /** What it is for: the services of the place that the map shows (the ones of documented gratuity, as in its card), at most three */
  purpose: string
}

const MAX_PURPOSES = 3

/** "Centro de salud (CeSAC, CAPS)" → "Centro de salud": the parenthesis is detail the card already gives */
const shortKind = (type: string | undefined) => (facilityTypeLabel(type) ?? "Lugar de atención").replace(/\s*\(.*\)\s*$/, "")

/**
 * The category that gives the pin its symbol: a place whose services are of Salud general (a centro de salud, a hospital) is Salud general, even if it also has
 * mental health or sexual health care; otherwise the single category it has; and if it has several without Salud general, the first in this order.
 */
const PIN_CATEGORY_ORDER: CategoryId[] = ["salud-fisica", "salud-mental", "esi", "animales"]

export const pinCategory = (services: PlaceEntry["services"]): CategoryId => {
  const present = new Set(services.flatMap(({ categories }) => categories))
  return PIN_CATEGORY_ORDER.find((category) => present.has(category)) ?? "salud-fisica"
}

const purposeOf = (services: PlaceEntry["services"]) => {
  const names = [...new Set(services.map(serviceName))]
  const shown = names.slice(0, MAX_PURPOSES).join(", ")
  return names.length > MAX_PURPOSES ? `${shown} y ${names.length - MAX_PURPOSES} más` : shown
}

/**
 * The pins of the places shown (the same results as the list: search and filters already applied).
 * Only verified coordinates produce a pin; a place without them stays in the list only, and is never given a guessed point.
 * With a search or a filter on (`asked`), the symbol and the purpose come from the services that answer it: a CeSAC that is Salud general without filters
 * is a point of Salud sexual when that is what was asked for.
 */
export const getMapPins = (entries: PlaceEntry[], asked?: PlaceQuery): MapPin[] =>
  entries.flatMap((entry) => {
    const { place } = entry
    const answering = asked ? matchingServices(entry, asked) : []
    const services = answering.length > 0 ? answering : entry.services
    const coordinates = place.coordinates
    if (!isMappable(place) || !coordinates || !Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)) return []
    const confirmedFree = services.filter((service) => isVerifiedFree(place, service))
    return [{
      id: place.id,
      name: place.name,
      lat: coordinates.lat,
      lng: coordinates.lng,
      kind: shortKind(place.facilityType),
      category: pinCategory(services),
      services: confirmedFree.map((service) => ({ id: service.id, type: service.type, name: serviceName(service), category: service.categories[0] })),
      purpose: purposeOf(services),
    }]
  })

/**
 * A pin that marks the address, not the entrance: its coordinates are verified but their precision is "approximate"
 * (a point of an official map or of a geocoder for the address). Only "exact" says the pin is where you go in.
 */
export const hasApproximateLocation = (place: PlaceEntry["place"]) => isMappable(place) && place.coordinates?.precision === "approximate"

/** How many of the pins shown are approximate (see hasApproximateLocation) */
export const countApproximate = (entries: PlaceEntry[]) => entries.filter(({ place }) => hasApproximateLocation(place)).length

/** How many of the places shown can't be on the map (no verified coordinates) */
export const countUnmapped = (entries: PlaceEntry[]) => entries.length - getMapPins(entries).length
