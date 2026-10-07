import { parseCsv } from "../lib/csv.mjs"
import { toWgs84, round7 } from "../lib/crs.mjs"
import { parsePoint } from "../lib/wkt.mjs"
import { cleanText, cleanUrl, parseAddressCaba, parsePhonesCaba, rowHash } from "../lib/normalize.mjs"

/*
 * Buenos Aires Data — Centros de Salud y Acción Comunitaria (CESAC). Columns:
 *   id, nombre, direccion, barrio, comuna, telefono, web, area_progr, especialid, geometry (WKT POINT, lng lat, WGS84)
 * Known limits of the source, handled here and not hidden:
 *   - `id` is the dataset's own number; it is NOT the CeSAC number ("id 46" is CeSAC N° 47).
 *   - `especialid` is cut at 254 bytes by the publisher: its last item may be a fragment ("Ps", "Trabajo Soc").
 */
export const REQUIRED_COLUMNS = ["id", "nombre", "direccion", "barrio", "comuna", "telefono", "web", "area_progr", "especialid", "geometry"]
/** The publisher cuts the field at 254 BYTES of UTF-8 (253 when an accent would be split): every list that long is suspect */
const TRUNCATION_BYTES = 253

export const parseRows = (text) => parseCsv(text)

const readCoordinates = (geometry, { manifest, crs }, problems) => {
  const point = parsePoint(geometry)
  if (!point) {
    problems.push({ code: "coordinates-missing", detail: geometry ? `geometry no es un punto: ${geometry}` : "sin geometry" })
    return undefined
  }
  const declared = manifest.crs.declared
  try {
    if (declared === "EPSG:4326") {
      // WKT is (x y) = (lng lat). A swapped pair falls outside the area box and is rejected by the gates
      // The source already gives latitude and longitude: they are kept exactly as published (only computed values are rounded)
      return { lat: point[1], lng: point[0], method: "official-dataset", precision: "approximate", raw: { x: point[0], y: point[1], crs: declared } }
    }
    const projected = toWgs84(crs, point[0], point[1])
    return { lat: round7(projected.lat), lng: round7(projected.lng), method: "official-dataset-reprojected", precision: "approximate", raw: { x: point[0], y: point[1], crs: declared }, transform: projected.transform }
  } catch (error) {
    problems.push({ code: "coordinates-rejected", detail: error.message })
    return undefined
  }
}

export const normalizeRow = ({ rowNumber, fields }, context) => {
  const problems = []
  const signals = []
  const key = cleanText(fields.id)
  const name = cleanText(fields.nombre)
  const number = /CeSAC\s*N[°º.]?\s*(\d+)/i.exec(name)?.[1]
  const { phones, fragments } = parsePhonesCaba(fields.telefono)

  const rawSpecialties = cleanText(fields.especialid)
  const truncated = Buffer.byteLength(String(fields.especialid ?? "")) >= TRUNCATION_BYTES
  const items = rawSpecialties ? rawSpecialties.split(" - ").map(cleanText).filter(Boolean) : []
  // A cut list: its last item can be anything ("Ps"), so it is dropped and the candidate is flagged
  const specialties = truncated ? items.slice(0, -1) : items
  if (truncated) signals.push("specialties-truncated")

  const coordinates = readCoordinates(fields.geometry, context, problems)
  const detailUrl = cleanUrl(fields.web)

  return {
    source: context.manifest.id,
    key,
    keyStrategy: "official-id",
    rowNumber,
    rowHash: rowHash(fields),
    name,
    ...(number ? { shortName: `CeSAC Nº ${number}`, officialNumber: number, idHint: `cesac-${number}` } : {}),
    facilityTypeRaw: "CeSAC",
    address: { ...parseAddressCaba(fields.direccion), neighborhood: cleanText(fields.barrio) || undefined, comuna: cleanText(fields.comuna) || undefined },
    phones,
    phoneFragments: fragments,
    ...(detailUrl ? { detailUrl } : {}),
    ...(coordinates ? { coordinates } : {}),
    specialtiesRaw: specialties,
    ...(truncated ? { specialtiesTruncated: true } : {}),
    referenceHospital: cleanText(fields.area_progr) || undefined,
    signals,
    problems,
  }
}
