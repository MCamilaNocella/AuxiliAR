/**
 * Where the map gets its tiles (the background images). Kept apart from the map component so the provider can be
 * changed later by editing only this file.
 *
 * Pilot: the public OpenStreetMap server. Its usage policy (https://operations.osmfoundation.org/policies/tiles/)
 * is meant for light use: before real traffic, move to a provider with its own plan (or a self-hosted one) and
 * update `url` and `attribution` here. The attribution is always shown on the map.
 */
export type TileProvider = {
  name: string
  /** Leaflet template: {z}/{x}/{y} (and {s} for subdomains) */
  url: string
  /** HTML shown in the corner of the map; links open in a new tab */
  attribution: string
  maxZoom: number
}

export const MAP_TILES: TileProvider = {
  name: "OpenStreetMap",
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  maxZoom: 19,
}

/** The attribution Leaflet itself asks for, next to the tiles' one */
export const LEAFLET_PREFIX = '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>'
