/*
 * Candidates: normalized records of a source, checked and classified. A candidate is NOT a published place:
 * it lives in curation/candidates/ (never in src/), and only becomes a place through an explicit decision (publish.mjs).
 *
 * Tiers
 *   T1  every check passed
 *   T2  needs a person: something is dubious (the decision must acknowledge each warning)
 *   T3  blocked: it can't be published as it is (no key, no name, no address, duplicate key, id collision)
 * Gates have a level: "fail" (T3), "warn" (T2) or "info" (shown in the report, does not change the tier).
 *
 * Sources of a candidate, in order of weight:
 *   1. the dataset (name, coordinates, phones, address, the specialties it lists)
 *   2. the official page of the place ("ficha"), when there is one: it completes what the dataset cuts (the specialty list of the
 *      CeSAC), and confirms or contradicts the address and phones. It is the preferred source for the services of a CeSAC.
 *   3. official statements about a group (claims): for example "the 14 Hospitales Generales de Agudos have guardia 24 h".
 *
 * Nothing here completes a fact: hours, cost, appointment, requirements and audience are never filled. A service is published
 * only if the mapping table (reviewed by a person) says what type it is AND a person approved it (approved: true).
 * `proposed` shows what would be publishable if the clear equivalences ("proposal: approvable") were approved: it is a view for
 * the editorial review, not a way to publish.
 */
import { dialKey } from "../resources-validate.mjs"
import { pageFacts } from "./ficha-facts.mjs"
import { termKey } from "./fichas.mjs"
import { parseAddressCaba } from "./lib/normalize.mjs"
import { slugify } from "./lib/util.mjs"

const gate = (level, code, detail) => ({ level, code, ...(detail ? { detail } : {}) })

export const tierOf = (gates) => (gates.some((g) => g.level === "fail") ? "T3" : gates.some((g) => g.level === "warn") ? "T2" : "T1")

/** Warnings that a person must resolve (a conflict or an unclear fact). The rest can be acknowledged and published as they are */
export const BLOCKING_WARNINGS = new Set([
  "address-unparsed", "address-street-inverted", "address-street-has-digits", "address-conflict", "address-list-differs", "phone-conflict", "phone-differs",
  "coordinates-rejected", "coordinates-outside-box", "shared-coordinates", "duplicate-suspect", "linked-without-external-id", "specialties-truncated",
])

const insideBox = ({ lat, lng }, box) => lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east

const externalKey = (source, key) => `${source}:${key}`

/** How a published place and a record can be said to be the same one: a shared phone, or the same number in a similar street */
export const corroboration = (record, resource) => {
  const evidence = []
  const recordDials = new Set(record.phones.map((phone) => dialKey(phone.dial)))
  const sharedPhones = (resource.contacts ?? []).filter((contact) => recordDials.has(dialKey(contact.dial)))
  if (sharedPhones.length > 0) evidence.push(`teléfono en común (${sharedPhones.map((contact) => contact.display).join(", ")})`)
  const overlap = wordOverlap(record.address?.street ?? record.address?.raw, resource.address?.street)
  if (record.address?.number && record.address.number === resource.address?.number && overlap.length > 0) {
    evidence.push(`misma altura (${record.address.number}) y calle parecida (${overlap.join(" ")})`)
  }
  return evidence
}

const wordsOf = (text) => new Set(slugify(text ?? "").split("-").filter((word) => word.length > 2 && !["avenida", "calle", "dr", "gral", "cnel", "prof"].includes(word)))
/** "Piedra Buena Av." and "Av. Piedrabuena" are the same street: compare words, and words against the other text without spaces */
const squash = (text) => slugify(text ?? "").replaceAll("-", "")
const sameStreetName = (a, b) =>
  wordOverlap(a, b).length > 0 || [...wordsOf(b)].some((word) => word.length >= 6 && squash(a).includes(word)) || [...wordsOf(a)].some((word) => word.length >= 6 && squash(b).includes(word))
const wordOverlap = (a, b) => {
  const second = wordsOf(b)
  return [...wordsOf(a)].filter((word) => second.has(word))
}

/** The mapping entry for a facility type or a specialty, as the table says (or undefined if the vocabulary is new) */
const lookup = (table, raw) => (table && Object.hasOwn(table, raw) ? table[raw] : undefined)

const proposalOf = (entry) => entry.proposal ?? (entry.approved ? "approvable" : "doubtful")

/** Services the mapping proposes for the specialties the DATASET lists, one per specialty; the ones a person approved can be published */
export const servicesFor = (record, mapping) => {
  const proposed = []
  const undecided = []
  const unknown = []
  const seen = new Set()
  for (const raw of record.specialtiesRaw ?? []) {
    const entry = lookup(mapping.specialties, raw)
    if (!entry) unknown.push(raw)
    else if (!entry.serviceType) undecided.push(raw)
    else {
      const id = slugify(raw)
      if (seen.has(id)) continue
      seen.add(id)
      proposed.push({ id, type: entry.serviceType, name: raw, approved: entry.approved === true, proposal: proposalOf(entry), origin: "dataset", terms: [raw] })
    }
  }
  return { proposed, publishable: proposed.filter((service) => service.approved), undecided, unknown }
}

/** "Odontología (niñes y adultos)" is "odontología": a parenthesis that only says who it is for is dropped, nothing else */
const AUDIENCE = /^(?:adultos?|ni[nñ][oae]s?|nines|adolescentes?|infantil|infanto-?juvenil|juvenil|mayores|y|e|[\s,/])+$/
export const lookupTerm = (table, term) => {
  const exact = lookup(table, termKey(term))
  if (exact) return exact
  const match = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(term)
  if (match && AUDIENCE.test(termKey(match[2]))) return lookup(table, termKey(match[1]))
  return undefined
}

/** Services from the terms of an official page: one per service TYPE (several terms can be the same type), no name (the type's label is shown) */
export const pageServices = (facts, mapping) => {
  const byType = new Map()
  const undecided = []
  const unknown = []
  for (const [section, terms] of [["Especialidades", facts.specialties], ["Programas", facts.programs]]) {
    for (const term of terms) {
      const entry = lookupTerm(mapping.fichaTerms, term)
      if (!entry) unknown.push(term)
      else if (!entry.serviceType) undecided.push(term)
      else {
        const service = byType.get(entry.serviceType) ?? { id: entry.serviceType, type: entry.serviceType, approved: false, approvable: false, origin: "ficha", terms: [] }
        service.terms.push(`${section}: ${term}`)
        if (entry.approved) service.approved = true
        if (proposalOf(entry) === "approvable") service.approvable = true
        byType.set(entry.serviceType, service)
      }
    }
  }
  const proposed = [...byType.values()].map(({ approvable, ...service }) => ({ ...service, proposal: approvable ? "approvable" : "doubtful" }))
  return { proposed, undecided: [...new Set(undecided)], unknown: [...new Set(unknown)] }
}

/** Services stated by an official page about a group (claims). Each carries its own source and hours exactly as the page says */
export const claimServices = (key, claimsFile) => {
  if (!claimsFile) return []
  return claimsFile.claims
    .filter((claim) => claim.key === key)
    .map((claim) => {
      const page = claimsFile.sharedPages[claim.evidence.page]
      return {
        id: claim.service.id,
        type: claim.service.type,
        approved: claim.approved === true,
        proposal: claim.proposal,
        origin: "claim",
        terms: [claim.evidence.quote],
        hours: claim.service.hours ?? null,
        source: {
          organization: claimsFile.sourceInfo.organization,
          url: page.url,
          retrievedAt: page.retrievedAt,
          license: claimsFile.sourceInfo.license,
          note: `${page.title}: «${claim.evidence.quote}».`,
        },
        note: claim.note,
      }
    })
}

/** The address that the page listing a whole group gives for this record (the line after its name in the table), if it has one */
const claimListAddress = (key, supplements) => {
  const claim = supplements?.claims?.claims.find((c) => c.key === key && c.evidence.listedAs && c.proposal === "approvable")
  const lines = supplements?.shared?.[claim?.evidence.page]?.lines
  if (!claim || !lines) return null
  const index = lines.indexOf(claim.evidence.listedAs)
  const raw = index >= 0 ? lines[index + 1] : null
  const parsed = raw ? parseAddressCaba(raw) : null
  return parsed?.number ? { raw, number: parsed.number, page: claim.evidence.page } : null
}

/** Address: the dataset's, unless the official page of the place gives the SAME address in a clear form (then that one is used) */
export const resolveAddress = (record, facts) => {
  const dataset = record.address
  const gates = []
  const keepDataset = () => {
    for (const code of dataset.problems ?? []) gates.push(gate("warn", code, dataset.raw))
    return { ...dataset, resolvedBy: "dataset" }
  }
  if (!facts?.address) return { address: dataset.raw ? keepDataset() : { ...dataset, resolvedBy: "dataset" }, gates }
  const page = parseAddressCaba(facts.address)
  const clear = page.street && page.number && page.problems.length === 0
  if (!clear) {
    gates.push(gate("info", "page-address-unclear", facts.address))
    return { address: keepDataset(), gates }
  }
  const sameNumber = !dataset.number || dataset.number === page.number
  const sameStreet = sameStreetName(dataset.raw, page.street)
  if (sameNumber && sameStreet) {
    // A dataset without a house number (a corner) isn't confirmed by the page, it is REFINED by it: a person acknowledges it
    if (dataset.number) gates.push(gate("info", "address-confirmed-by-page", `${dataset.raw} → ${page.street} ${page.number}`))
    else gates.push(gate("warn", "address-from-page-only", `dataset: «${dataset.raw}» (sin altura) · página oficial: «${facts.address}»`))
    return { address: { raw: dataset.raw, street: page.street, number: page.number, neighborhood: dataset.neighborhood, comuna: dataset.comuna, confidence: "high", problems: [], resolvedBy: "page" }, gates }
  }
  gates.push(gate("warn", "address-conflict", `dataset: «${dataset.raw}» · página oficial: «${facts.address}»`))
  return { address: keepDataset(), gates }
}

/**
 * Phones: if the official page of the place gives numbers they are the ones published (they carry labels); the dataset's that the page
 * doesn't have are reported, not published. Without a page, the dataset's. Only COMPLETE numbers are published: fragments are reported.
 */
export const mergePhones = (record, facts) => {
  const gates = []
  const pagePhones = facts?.phones ?? []
  const phones = pagePhones.length > 0 ? [...pagePhones] : [...record.phones]
  if (pagePhones.length > 0) {
    const pageDials = new Set(pagePhones.map((phone) => phone.dial))
    const datasetOnly = record.phones.filter((phone) => !pageDials.has(phone.dial))
    if (record.phones.length > 0 && datasetOnly.length === record.phones.length) {
      gates.push(gate("warn", "phone-conflict", `dataset: ${record.phones.map((p) => p.display).join(", ")} · página oficial: ${pagePhones.map((p) => p.display).join(", ")}`))
    } else if (record.phones.length > 0 && !pageDials.has(record.phones[0].dial) && !record.phones.some((p) => p.dial === pagePhones[0].dial)) {
      gates.push(gate("warn", "phone-differs", `el teléfono principal no coincide: dataset ${record.phones[0].display} · página oficial ${pagePhones[0].display}`))
    } else if (datasetOnly.length > 0) {
      gates.push(gate("info", "phones-dataset-only", `el dataset tiene y la página no (no se publican): ${datasetOnly.map((p) => p.display).join(", ")}`))
    }
  }
  const fragments = [...(record.phoneFragments ?? []), ...(facts?.phoneFragments ?? [])]
  if (fragments.length > 0) {
    gates.push(
      phones.length === 0
        ? gate("warn", "phone-fragment", `no se pudo leer ningún teléfono completo: ${fragments.join(", ")}`)
        : gate("info", "phone-fragments-not-published", `números incompletos que no se publican: ${fragments.join(", ")}`),
    )
  }
  if (phones.length === 0 && fragments.length === 0) gates.push(gate("info", "phones-none"))
  return { phones, gates }
}

/** The address as the source writes it: no street is invented, and the locality and province come from the manifest */
export const addressFor = (record, manifest, address = record.address) => ({
  ...(address.street ? { street: address.street } : {}),
  ...(address.number ? { number: address.number } : {}),
  ...(address.neighborhood ? { neighborhood: address.neighborhood } : {}),
  locality: manifest.locality,
  province: manifest.province,
  ...(address.reference ? { reference: address.reference } : {}),
})

const COORDINATE_WARNINGS = ["coordinates-rejected", "coordinates-outside-box", "shared-coordinates"]

const coordinateNote = (manifest, record) => {
  const base = `${manifest.attribution}`
  return record.coordinates.method === "official-dataset-reprojected"
    ? `${base} Reproyectado de ${record.coordinates.raw.crs} a WGS84 con ${record.coordinates.transform.tool} (curation/crs).`
    : base
}

/** Coordinates ready to publish (verification dates are added by the batch), or null if the record has none or any check on them failed */
export const coordinatesFor = (candidate, manifest) => {
  const { record } = candidate
  if (!record.coordinates || candidate.gates.some((g) => COORDINATE_WARNINGS.includes(g.code))) return null
  return { lat: record.coordinates.lat, lng: record.coordinates.lng, precision: record.coordinates.precision, status: "verified", method: record.coordinates.method, note: coordinateNote(manifest, record) }
}

/** The service as it is published: only what is its own. hours: null = "not known" (never assumed); a claim brings the hours its page states */
const serviceToResource = (service) => ({
  id: service.id,
  type: service.type,
  ...(service.origin === "dataset" ? { name: service.name } : {}),
  hours: service.hours ?? null,
  ...(service.source ? { source: service.source } : {}),
})

/**
 * The place as it would be published, without verification (the batch adds it) and without any unbacked data:
 * no hours (except what a claim's page states for its own service), no cost, no appointment, no requirements, no audience.
 * `assume: true` supposes approved the clear equivalences ("proposal: approvable"): only for the editorial review view.
 * Null when it can't be built honestly.
 */
export const buildResource = ({ candidate, manifest, mapping, assume = false }) => {
  const { record } = candidate
  const resolved = candidate.resolved
  const blockers = []
  const facilityEntry = lookup(mapping.facilityTypes, record.facilityTypeRaw)
  const facilityOk = facilityEntry?.facilityType && (facilityEntry.approved || (assume && proposalOf(facilityEntry) === "approvable"))
  if (!facilityOk) blockers.push("facility-type-not-approved")
  const services = (resolved?.services ?? []).filter((service) => service.approved || (assume && service.proposal === "approvable"))
  if (services.length === 0) blockers.push("no-approved-service")
  if (blockers.length > 0) return { resource: null, blockers }

  const coordinates = coordinatesFor(candidate, manifest)
  const phones = resolved.phones
  const page = resolved.page
  const datasetNote = `Registro "${record.key}" del dataset «${manifest.label}»${manifest.current?.officialUpdatedAt ? `, actualizado el ${manifest.current.officialUpdatedAt}` : ""}. ${manifest.attribution}`
  const source = page
    ? {
        organization: "Gobierno de la Ciudad de Buenos Aires",
        url: page.finalUrl ?? page.url,
        retrievedAt: resolved.pageRetrievedAt,
        license: "CC-BY-2.5-AR",
        note: `Página oficial del establecimiento (buenosaires.gob.ar), leída el ${resolved.pageRetrievedAt}. Coordenadas y datos de base: ${datasetNote}`,
      }
    : { organization: manifest.organization, url: manifest.datasetUrl, retrievedAt: manifest.current?.retrievedAt, license: manifest.license, note: datasetNote }
  const resource = {
    id: candidate.id,
    name: record.name,
    ...(record.shortName ? { shortName: record.shortName } : {}),
    kind: "service",
    facilityType: facilityEntry.facilityType,
    jurisdiction: manifest.jurisdiction,
    ...(phones.length > 0 ? { contacts: phones.map((phone) => ({ type: "phone", dial: phone.dial, display: phone.display, ...(phone.label ? { label: phone.label } : {}) })) } : {}),
    address: addressFor(record, manifest, resolved.address),
    ...(coordinates ? { coordinates } : {}),
    services: services.map(serviceToResource),
    externalIds: { [manifest.id]: record.key },
    source,
  }
  if (!resource.source.retrievedAt) delete resource.source.retrievedAt
  return { resource, blockers: [] }
}

const matchesOnly = (record, only) => !only || Object.entries(only).every(([field, value]) => record[field] === value)

/**
 * published: the resources already in places/<province>.json (and the other places files, to detect id collisions).
 * idMap: { [source]: { [key]: id } } — ids assigned in earlier runs; an id is never changed once assigned.
 * supplements: { pages, shared, claims } from curation/supplements (optional): official pages and statements.
 */
export const buildCandidates = ({ manifest, snapshot, mapping, published, idMap = {}, supplements = null }) => {
  const records = snapshot.records
  const keyCounts = new Map()
  for (const record of records) keyCounts.set(record.key, (keyCounts.get(record.key) ?? 0) + 1)

  const byExternal = new Map()
  const byId = new Map()
  for (const resource of published) {
    byId.set(resource.id, resource)
    for (const [source, key] of Object.entries(resource.externalIds ?? {})) byExternal.set(externalKey(source, key), resource)
  }

  // Same point for two different records: the dataset repeated it or reused a placeholder
  const pointCounts = new Map()
  for (const record of records) {
    if (record.coordinates) pointCounts.set(`${record.coordinates.lat},${record.coordinates.lng}`, (pointCounts.get(`${record.coordinates.lat},${record.coordinates.lng}`) ?? 0) + 1)
  }

  const assigned = new Map()
  const nextIdMap = { ...idMap, [manifest.id]: { ...(idMap[manifest.id] ?? {}) } }
  const pagesConfig = manifest.supplements?.pages
  const candidates = []

  for (const record of records) {
    const gates = []
    if (!record.key) gates.push(gate("fail", "key-missing"))
    if (!record.name) gates.push(gate("fail", "name-missing"))
    if (record.key && keyCounts.get(record.key) > 1) gates.push(gate("fail", "key-duplicate", `la clave "${record.key}" está en ${keyCounts.get(record.key)} filas`))
    if (!record.address?.raw) gates.push(gate("fail", "address-missing"))

    // The official page of the place
    const expectsPage = Boolean(supplements && pagesConfig && matchesOnly(record, pagesConfig.only))
    const page = supplements?.pages?.[record.key]
    const facts = pageFacts(page)
    if (expectsPage) {
      if (!record.detailUrl) gates.push(gate("warn", "ficha-missing", "el dataset no trae la página oficial del lugar"))
      else if (!page) gates.push(gate("warn", "ficha-not-fetched", "no se descargó la página oficial (npm run curation -- pages)"))
      else if (page.status !== 200) gates.push(gate("warn", "ficha-unavailable", `la página oficial ${page.url} respondió ${page.status || "con un error"}`))
    }

    const { address, gates: addressGates } = record.address?.raw ? resolveAddress(record, facts) : { address: { ...record.address, resolvedBy: "dataset" }, gates: [] }
    gates.push(...addressGates)
    // The list page of the group states an address too: if it says another one, two official pages disagree and a person decides
    const listed = claimListAddress(record.key, supplements)
    if (listed && address.number && !(listed.number === address.number && sameStreetName(listed.raw, address.street ?? address.raw))) {
      gates.push(gate("warn", "address-list-differs", `${listed.page}: «${listed.raw}» · resuelta: «${address.street ?? address.raw} ${address.number}»`))
    }
    const { phones, gates: phoneGates } = mergePhones(record, facts)
    gates.push(...phoneGates)

    for (const problem of record.problems ?? []) gates.push(gate("warn", problem.code, problem.detail))
    if (record.coordinates) {
      if (!insideBox(record.coordinates, manifest.expectedBox)) gates.push(gate("warn", "coordinates-outside-box", `(${record.coordinates.lat}, ${record.coordinates.lng}) fuera del área esperada de ${manifest.province}`))
      if (pointCounts.get(`${record.coordinates.lat},${record.coordinates.lng}`) > 1) gates.push(gate("warn", "shared-coordinates", "otro registro del dataset tiene exactamente el mismo punto"))
    }

    // Services: the official page's (complete) list when there is one; otherwise the dataset's, if it isn't cut
    const datasetServices = servicesFor(record, mapping)
    let list
    let undecided = datasetServices.undecided
    let unknown = datasetServices.unknown
    if (facts) {
      const fromPage = pageServices(facts, mapping)
      list = fromPage.proposed
      undecided = fromPage.undecided
      unknown = fromPage.unknown
      const pageTypes = new Set(fromPage.proposed.map((service) => service.type))
      const datasetOnly = [...new Set(datasetServices.proposed.map((service) => service.type))].filter((type) => !pageTypes.has(type))
      if (datasetOnly.length > 0) gates.push(gate("info", "dataset-only-service", `el dataset lista y la página no: ${datasetOnly.join(", ")}`))
      if (record.specialtiesTruncated) gates.push(gate("info", "specialties-truncated-completed-by-page", "el dataset corta la lista de especialidades; se usa la lista completa de la página oficial"))
    } else {
      list = datasetServices.proposed
      if (record.specialtiesTruncated) {
        gates.push(gate("warn", "specialties-truncated", "el publicador corta el campo de especialidades y no hay página oficial que lo complete: la lista puede estar incompleta (se descartó el último ítem)"))
      }
    }
    list = [...list, ...claimServices(record.key, supplements?.claims)]
    if (!lookup(mapping.facilityTypes, record.facilityTypeRaw)) gates.push(gate("warn", "facility-type-unmapped", record.facilityTypeRaw))
    if (unknown.length > 0 && !facts) gates.push(gate("warn", "specialty-unmapped", unknown.join(", ")))
    if (unknown.length > 0 && facts) gates.push(gate("info", "page-term-without-proposal", unknown.join(" · ")))
    if (undecided.length > 0) gates.push(gate("info", "specialty-undecided", undecided.join(", ")))
    if (record.signals?.includes("guardia-phone")) gates.push(gate("info", "guardia-phone", "tiene un teléfono de guardia en el dataset; no dice horarios ni si es 24 h"))
    if (facts?.hours.length > 0) gates.push(gate("info", "page-has-hours-text", facts.hours.map((h) => `${h.label}: ${h.text}`).join(" | ")))

    // Link with the published places: by external id, then by an id assigned before; a similar place is only a suggestion
    let link = { status: "new" }
    const linked = record.key ? byExternal.get(externalKey(manifest.id, record.key)) : undefined
    if (linked) link = { status: "linked", resourceId: linked.id, via: "externalIds" }
    else if (record.key && idMap[manifest.id]?.[record.key] && byId.has(idMap[manifest.id][record.key])) {
      link = { status: "linked", resourceId: idMap[manifest.id][record.key], via: "id-map" }
      gates.push(gate("warn", "linked-without-external-id", "el id está en id-map.json pero el lugar publicado no tiene externalIds"))
    } else {
      const similar = published
        .filter((resource) => !Object.hasOwn(resource.externalIds ?? {}, manifest.id))
        .map((resource) => ({ resource, evidence: corroboration({ ...record, phones }, resource) }))
        .filter(({ evidence }) => evidence.length > 0)
      if (similar.length > 0) {
        link = { status: "suggested", suggestions: similar.map(({ resource, evidence }) => ({ resourceId: resource.id, evidence })) }
        gates.push(gate("warn", "duplicate-suspect", `parece el lugar ya publicado ${similar.map(({ resource }) => resource.id).join(", ")}`))
      }
    }

    // Stable id: the one assigned before, the published one, or a proposal (never changed afterwards)
    const id = link.status === "linked" ? link.resourceId : (idMap[manifest.id]?.[record.key] ?? record.idHint ?? slugify(record.name))
    const clash = published.find((resource) => resource.id === id && link.resourceId !== id)
    const other = assigned.get(id)
    if (clash || (other && other !== record.key)) gates.push(gate("fail", "id-collision", `el id "${id}" ya lo usa otro lugar`))
    if (record.key) {
      assigned.set(id, record.key)
      nextIdMap[manifest.id][record.key] = id
    }

    const resolved = {
      address,
      phones,
      services: list,
      page: page?.status === 200 ? page : null,
      pageRetrievedAt: supplements?.retrievedAt ?? null,
    }
    const candidate = { id, source: manifest.id, key: record.key, tier: tierOf(gates), gates, link, record, resolved }
    const { resource, blockers } = buildResource({ candidate, manifest, mapping })
    const hypothetical = buildResource({ candidate, manifest, mapping, assume: true })
    const blocking = gates.filter((g) => g.level === "warn" && BLOCKING_WARNINGS.has(g.code)).map((g) => g.code)
    const reasons = [...new Set([...blocking, ...(candidate.tier === "T3" ? gates.filter((g) => g.level === "fail").map((g) => g.code) : []), ...hypothetical.blockers])]
    candidates.push({
      ...candidate,
      resolved: { ...resolved, page: resolved.page ? { url: resolved.page.url, finalUrl: resolved.page.finalUrl, title: resolved.page.title, contentHash: resolved.page.contentHash } : null },
      services: { proposed: list.map(({ source: _source, ...service }) => service), undecided, unknown },
      publishable: { ready: candidate.tier !== "T3" && resource !== null, blockers },
      proposed: { ready: reasons.length === 0, reasons, services: (hypothetical.resource?.services ?? []).map((service) => service.type), facilityType: hypothetical.resource?.facilityType ?? null },
      proposal: resource,
      proposalIfApproved: hypothetical.resource,
    })
  }
  const sortedIdMap = { ...nextIdMap, [manifest.id]: Object.fromEntries(Object.entries(nextIdMap[manifest.id]).sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))) }
  return { candidates, idMap: sortedIdMap }
}

export const countBy = (items, pick) => {
  const counts = {}
  for (const item of items) for (const value of [].concat(pick(item))) counts[value] = (counts[value] ?? 0) + 1
  return counts
}
