/*
 * Coordinate reference systems: the ONLY place where a projected point becomes latitude and longitude.
 * The definition of each CRS lives in curation/crs/<code>.json (copied from the EPSG registry, with its URLs); nothing is
 * typed in by hand per place. proj4 is a devDependency of the curation scripts: it is never imported from src/.
 */
import proj4 from "proj4"
import { join } from "node:path"
import { CURATION_DIR, readJson } from "./util.mjs"

const WGS84 = "EPSG:4326"
const cache = new Map()

export const loadCrs = async (code, dir = join(CURATION_DIR, "crs")) => {
  if (code === WGS84) return { id: WGS84, name: "WGS 84", kind: "geographic" }
  if (cache.has(code)) return cache.get(code)
  const crs = await readJson(join(dir, `${code.toLowerCase().replace(":", "-")}.json`))
  if (crs.id !== code) throw new Error(`crs: ${code} apunta a un archivo que dice ser ${crs.id}`)
  cache.set(code, crs)
  return crs
}

const insideBox = ({ lat, lng }, box) => lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east

/**
 * Projected point (x = east, y = north, meters) → WGS84.
 * Returns { lat, lng, transform } or throws if the point is not a finite number or falls outside the area the CRS is for:
 * that is what happens with swapped axes or a wrong CRS, and such a point must never become a coordinate.
 */
export const toWgs84 = (crs, x, y) => {
  if (crs.kind !== "projected") throw new Error(`crs: ${crs.id} no es un CRS proyectado`)
  if (![x, y].every(Number.isFinite)) throw new Error(`crs: el punto (${x}, ${y}) no es numérico`)
  const [lng, lat] = proj4(crs.proj4, WGS84, [x, y])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`crs: la transformación de (${x}, ${y}) no dio un número`)
  if (crs.areaBox && !insideBox({ lat, lng }, crs.areaBox)) {
    throw new Error(`crs: (${x}, ${y}) en ${crs.id} da (${lat.toFixed(6)}, ${lng.toFixed(6)}), fuera del área del CRS: ¿ejes invertidos o CRS equivocado?`)
  }
  return { lat, lng, transform: transformInfo(crs) }
}

/** The reverse direction. Only used by tests and sanity checks, never to produce data */
export const fromWgs84 = (crs, lat, lng) => {
  const [x, y] = proj4(WGS84, crs.proj4, [lng, lat])
  return { x, y }
}

export const transformInfo = (crs) => ({ from: crs.id, to: WGS84, tool: `proj4@${proj4.version ?? "?"}` })

/** Rounds to 7 decimals (≈ 1 cm): more digits would only pretend a precision the sources don't have */
export const round7 = (value) => Math.round(value * 1e7) / 1e7
