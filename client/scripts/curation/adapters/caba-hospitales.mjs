import { parseCsv } from "../lib/csv.mjs"
import { toWgs84, round7 } from "../lib/crs.mjs"
import { parsePoint } from "../lib/wkt.mjs"
import { cleanText, cleanUrl, divisionOfCaba, parseAddressCaba, parsePhonesCaba, rowHash } from "../lib/normalize.mjs"
import { slugify } from "../lib/util.mjs"

/*
 * Buenos Aires Data — Hospitales. Columns:
 *   fna (full name), gna (kind of hospital), gna_sym, nam, esp (specialty), ate (kinds of care), dir, bar, com, tel, fax, web, sag, geometry
 * Known limits of the source:
 *   - There is NO id column: the key is the slug of `fna`. A renamed hospital looks like "one disappeared, one is new":
 *     a person links them by editing id-map.json and the externalIds of the published place.
 *   - `geometry` is a WKT POINT in EPSG:9498 (x = east, y = north, meters), not latitude/longitude.
 *   - `tel` mixes the main numbers and the guardia ones ("... | Guardia: ..."): the label is kept. Hours are NOT in the source.
 */
export const REQUIRED_COLUMNS = ["fna", "gna", "gna_sym", "nam", "esp", "ate", "dir", "bar", "com", "tel", "fax", "web", "sag", "geometry"]

export const parseRows = (text) => parseCsv(text)

export const normalizeRow = ({ rowNumber, fields }, { manifest, crs }) => {
  const problems = []
  const signals = []
  const name = cleanText(fields.fna)
  const { phones, fragments } = parsePhonesCaba(fields.tel)
  // The label can be lost when the guardia numbers repeat the general ones: it is read from the text
  if (/guardia\s*:/i.test(cleanText(fields.tel))) signals.push("guardia-phone")

  let coordinates
  const point = parsePoint(fields.geometry)
  if (!point) problems.push({ code: "coordinates-missing", detail: fields.geometry ? `geometry no es un punto: ${fields.geometry}` : "sin geometry" })
  else {
    try {
      const projected = toWgs84(crs, point[0], point[1])
      coordinates = { lat: round7(projected.lat), lng: round7(projected.lng), method: "official-dataset-reprojected", precision: "approximate", raw: { x: point[0], y: point[1], crs: manifest.crs.declared }, transform: projected.transform }
    } catch (error) {
      problems.push({ code: "coordinates-rejected", detail: error.message })
    }
  }

  const specialty = cleanText(fields.esp)
  const detailUrl = cleanUrl(fields.web)
  return {
    source: manifest.id,
    key: slugify(name),
    keyStrategy: "name-slug",
    rowNumber,
    rowHash: rowHash(fields),
    name,
    facilityTypeRaw: cleanText(fields.gna),
    address: { ...parseAddressCaba(fields.dir), neighborhood: cleanText(fields.bar) || undefined, ...divisionOfCaba(fields.com ? `Comuna ${cleanText(fields.com)}` : undefined) },
    phones,
    phoneFragments: fragments,
    ...(detailUrl ? { detailUrl } : {}),
    ...(coordinates ? { coordinates } : {}),
    specialtiesRaw: specialty ? [specialty] : [],
    careKindsRaw: cleanText(fields.ate) || undefined,
    jurisdictionRaw: cleanText(fields.sag) || undefined,
    signals,
    problems,
  }
}
