/*
 * Diffs. Two kinds, neither of which writes anything:
 *  - between two snapshots of the same source (what the publisher changed since the last download)
 *  - between a candidate and the place already published (what the source says that the published place doesn't).
 *    These are PROPOSALS for a person: the pipeline never applies them by itself.
 */
import { dialKey } from "../resources-validate.mjs"
import { deepEqual } from "./lib/util.mjs"

const COMPARED = ["name", "address", "phones", "specialtiesRaw", "facilityTypeRaw"]

export const diffSnapshots = (previous, next) => {
  const before = new Map((previous?.records ?? []).map((record) => [record.key, record]))
  const after = new Map(next.records.map((record) => [record.key, record]))
  const added = [...after.keys()].filter((key) => !before.has(key))
  const removed = [...before.keys()].filter((key) => !after.has(key))
  const changed = []
  for (const [key, record] of after) {
    const old = before.get(key)
    if (!old || old.rowHash === record.rowHash) continue
    const fields = COMPARED.filter((field) => !deepEqual(old[field] ?? null, record[field] ?? null))
    if (!deepEqual(old.coordinates?.raw ?? null, record.coordinates?.raw ?? null)) fields.push("coordinates")
    changed.push({ key, fields: fields.length > 0 ? fields : ["(otros campos de la fila)"] })
  }
  return { added, removed, changed, comparedWith: previous ? previous.retrievedAt : null }
}

/** Distance in meters between two WGS84 points */
export const distanceMeters = (a, b) => {
  const rad = (degrees) => (degrees * Math.PI) / 180
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371008.8 * Math.asin(Math.sqrt(h))
}

/** What the source says that differs from the published place. Information only */
export const proposalsFor = (candidate, resource) => {
  const { record } = candidate
  const proposals = []
  if (record.address?.number && record.address.number !== resource.address?.number) {
    proposals.push({ field: "address.number", published: resource.address?.number ?? null, source: record.address.number })
  }
  if (!resource.coordinates) {
    if (record.coordinates) proposals.push({ field: "coordinates", published: null, source: `${record.coordinates.lat}, ${record.coordinates.lng}` })
  } else if (record.coordinates) {
    const meters = distanceMeters(resource.coordinates, record.coordinates)
    if (meters > 5) proposals.push({ field: "coordinates", published: `${resource.coordinates.lat}, ${resource.coordinates.lng}`, source: `${record.coordinates.lat}, ${record.coordinates.lng}`, distanceMeters: Math.round(meters) })
  }
  const published = new Set((resource.contacts ?? []).map((contact) => dialKey(contact.dial)))
  const missing = record.phones.filter((phone) => !published.has(dialKey(phone.dial)))
  if (missing.length > 0) proposals.push({ field: "contacts", published: [...published].join(", ") || null, source: `sin publicar: ${missing.map((phone) => phone.display).join(", ")}` })
  return proposals
}
