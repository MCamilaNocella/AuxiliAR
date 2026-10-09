import { isMappable } from "@/data/resources"
import type { PlaceEntry } from "./filters"

/** A place that can be drawn on the map: its coordinates were verified. Nothing is ever geocoded in the browser */
export type MapPin = {
  id: string
  name: string
  lat: number
  lng: number
}

/**
 * The pins of the places shown (the same results as the list: search and filters already applied).
 * Only verified coordinates produce a pin; a place without them stays in the list only, and is never given a guessed point.
 */
export const getMapPins = (entries: PlaceEntry[]): MapPin[] =>
  entries.flatMap(({ place }) => {
    const coordinates = place.coordinates
    if (!isMappable(place) || !coordinates || !Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)) return []
    return [{ id: place.id, name: place.name, lat: coordinates.lat, lng: coordinates.lng }]
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
