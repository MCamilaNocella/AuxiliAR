/*
 * Publish: turns the decisions of a person into changes in places/<province>.json. It is the only code that writes there.
 *
 * Protection of manual curation (what this file guarantees, and tests/curation.test.mjs checks):
 *  - A place already published is NEVER overwritten. Only three things can touch it, each one only through an explicit
 *    decision with reviewer, date and reason:
 *      link   adds externalIds[source] (so the next update recognizes it); needs evidence that it is the same place
 *      apply  replaces one of APPLY_ALLOWED (address, address.department, coordinates) with what the source says now
 *      (nothing else: hours, cost, appointment, requirements, services, verification and contacts are never touched)
 *  - A new place (accept) is built only from what the official source says. Hours, cost, appointment, requirements and
 *    audience are never filled. It needs an approved facility type, at least one service whose mapping a person approved,
 *    and every warning of the candidate acknowledged. Without a publishable service it stays a candidate.
 *  - Verification of a batch covers only objective data backed by the source (name, address, phones, coordinates).
 *  - After the changes, an invariant compares before/after: any difference that no decision explains aborts everything.
 *  - The result is validated with the same validator as `resources:sync` BEFORE anything is written.
 */
import { validateDataset, isCalendarDate } from "../resources-validate.mjs"
import { deepEqual, stable } from "./lib/util.mjs"
import { addressFor, coordinatesFor } from "./candidates.mjs"

/** `address.department` changes ONLY that key of the address (the division the source gives); `address` replaces the whole address */
export const APPLY_ALLOWED = ["address", "address.department", "coordinates"]
const OVERRIDABLE_ADDRESS = ["street", "number", "neighborhood", "reference"]
const OVERRIDABLE = ["name", "shortName", "address"]
const ACTIONS = ["accept", "reject", "defer", "link", "apply"]
/** Warnings that a person must resolve by writing the value (acknowledging is not enough) */
const NEEDS_ADDRESS_OVERRIDE = ["address-street-inverted", "address-street-has-digits", "address-unparsed"]

export const validateBatch = (batch) => {
  const errors = []
  for (const field of ["id", "province", "verifiedBy"]) if (typeof batch?.[field] !== "string" || batch[field].trim() === "") errors.push(`lote: falta "${field}"`)
  for (const field of ["verifiedAt", "nextReviewDue"]) if (!isCalendarDate(batch?.[field])) errors.push(`lote ${batch?.id}: "${field}" tiene que ser una fecha real AAAA-MM-DD`)
  if (isCalendarDate(batch?.verifiedAt) && isCalendarDate(batch?.nextReviewDue) && batch.nextReviewDue <= batch.verifiedAt) errors.push(`lote ${batch.id}: nextReviewDue tiene que ser posterior a verifiedAt`)
  return errors
}

const verificationOf = (batch, source = null) => ({
  status: "verified",
  verifiedAt: batch.verifiedAt,
  verifiedBy: batch.verifiedBy,
  nextReviewDue: batch.nextReviewDue,
  notes: source
    ? `Verificación por lote (${batch.id}) contra la fuente oficial de esta prestación (${source.url}): solo lo que la cita dice. Gratuidad, turnos y requisitos no los informa y no se completan.`
    : `Verificación por lote (${batch.id}) de datos objetivos respaldados por la fuente oficial: nombre, dirección, teléfonos y coordenadas. Las prestaciones son las que la fuente lista; horarios, turnos, gratuidad y requisitos no los informa y no se completan.`,
})

/** The address with its division, right after the locality (the rest of the address, in its order, untouched) */
const withDepartment = (address, department) => {
  const next = {}
  let placed = false
  for (const [key, value] of Object.entries(address)) {
    if (key === "department") continue
    next[key] = value
    if (key === "locality") {
      next.department = department
      placed = true
    }
  }
  if (!placed) next.department = department
  return next
}

const stampCoordinates = (coordinates, batch) => ({ ...coordinates, verifiedAt: batch.verifiedAt, verifiedBy: batch.verifiedBy })

/** Top-level keys whose value differs between two versions of a resource (externalIds is reported per key) */
const changedPaths = (before, after) => {
  const paths = []
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (key === "externalIds") {
      for (const sub of new Set([...Object.keys(before.externalIds ?? {}), ...Object.keys(after.externalIds ?? {})])) {
        if (before.externalIds?.[sub] !== after.externalIds?.[sub]) paths.push(`externalIds.${sub}`)
      }
    } else if (!deepEqual(before[key] ?? null, after[key] ?? null)) paths.push(key)
  }
  return paths
}

/**
 * Pure planning: no files, no clock. Returns { data, applied, skipped, errors }.
 *  placesData:   the current content of places/<province>.json ({ resources, ... })
 *  candidates:   all the candidates of the province (any source)
 *  decisions:    the list from curation/decisions/<province>.decisions.json
 *  batches:      { [id]: batch }      manifests: { [sourceId]: manifest }
 *  otherFiles:   [{ name, data }] the rest of the dataset (lines/, other places/), only to validate ids and numbers
 */
export const planPublish = ({ province, placesData, candidates, decisions, batches, manifests, otherFiles = [], schema, taxonomy }) => {
  const errors = []
  const applied = []
  const skipped = []
  const before = placesData.resources
  const after = structuredClone(before)
  const allowedChanges = new Map()
  const allow = (id, path) => allowedChanges.set(id, [...(allowedChanges.get(id) ?? []), path])
  const touched = new Set()

  decisions.forEach((decision, index) => {
    const label = `decisión ${index + 1} (${decision.source}:${decision.key}, ${decision.action})`
    const fail = (message) => errors.push(`${label}: ${message}`)
    if (!ACTIONS.includes(decision.action)) return fail(`acción desconocida (hay: ${ACTIONS.join(", ")})`)
    for (const field of ["reviewer", "decidedAt"]) if (!decision[field]) return fail(`falta "${field}"`)
    if (!isCalendarDate(decision.decidedAt)) return fail(`"decidedAt" tiene que ser una fecha real AAAA-MM-DD`)
    const candidate = candidates.find((c) => c.source === decision.source && c.key === decision.key)
    if (!candidate) return fail("no hay un candidato con esa fuente y clave (¿se re-importó el dataset?)")
    if (candidate.record.rowHash && decision.rowHash && candidate.record.rowHash !== decision.rowHash) {
      return fail("la fila del dataset cambió desde que se decidió: hay que volver a revisarla")
    }
    const manifest = manifests[decision.source]
    if (!manifest) return fail(`no hay manifiesto de la fuente ${decision.source}`)
    if (manifest.province !== province) return fail(`la fuente es de ${manifest.province}, no de ${province}`)

    if (decision.action === "reject" || decision.action === "defer") {
      skipped.push({ decision: label, reason: decision.action, detail: decision.reason ?? null })
      return
    }

    // One decision per record and kind of change: a link and then an apply of the same place are two different things,
    // and so are two applies of different fields (its coordinates, its division)
    const key = `${decision.action}:${decision.source}:${decision.key}${decision.action === "apply" ? `:${[...(decision.fields ?? [])].sort().join(",")}` : ""}`
    if (touched.has(key)) return fail("hay otra decisión para el mismo registro")
    touched.add(key)

    if (decision.action === "link") {
      const resource = after.find((r) => r.id === decision.resourceId)
      if (!resource) return fail(`no existe el lugar publicado "${decision.resourceId}"`)
      if (!decision.reason) return fail('falta "reason"')
      const evidence = []
      for (const suggestion of candidate.link.suggestions ?? []) if (suggestion.resourceId === resource.id) evidence.push(...suggestion.evidence)
      if (candidate.link.resourceId === resource.id) evidence.push("ya estaba enlazado")
      if (evidence.length === 0 && !decision.force) return fail(`no hay evidencia de que "${resource.id}" sea el mismo lugar (teléfono o dirección en común): si es el mismo, usá "force": true con un "reason" que lo explique`)
      const current = resource.externalIds?.[decision.source]
      if (current !== undefined && current !== decision.key) return fail(`"${resource.id}" ya tiene externalIds.${decision.source} = "${current}"`)
      if (current === undefined) {
        resource.externalIds = { ...(resource.externalIds ?? {}), [decision.source]: decision.key }
        allow(resource.id, `externalIds.${decision.source}`)
        applied.push({ action: "link", resourceId: resource.id, source: decision.source, key: decision.key, evidence })
      } else skipped.push({ decision: label, reason: "already-linked", detail: resource.id })
      return
    }

    if (decision.action === "apply") {
      if (candidate.link.status !== "linked") return fail("solo se aplican cambios a un lugar ya enlazado (hacé primero el link)")
      const resource = after.find((r) => r.id === candidate.link.resourceId)
      if (!resource) return fail("el lugar enlazado no está en este archivo")
      if (!decision.reason) return fail('falta "reason"')
      const fields = decision.fields ?? []
      const divisions = []
      if (fields.length === 0) return fail('falta "fields"')
      const batch = batches[decision.batch]
      if (!batch) return fail(`no existe el lote "${decision.batch}"`)
      const batchErrors = validateBatch(batch)
      if (batchErrors.length > 0) return batchErrors.forEach(fail)
      for (const field of fields) {
        if (!APPLY_ALLOWED.includes(field)) return fail(`"${field}" no se puede aplicar desde un dataset (solo ${APPLY_ALLOWED.join(", ")}): horarios, prestaciones, contactos y verificación son curación manual`)
      }
      if (fields.includes("address") && fields.includes("address.department")) return fail('"address" ya incluye la división: pedí una cosa o la otra')
      for (const field of fields) {
        if (field === "address.department") {
          // The division comes from the source's own field, and the person approved that exact value for that exact row
          const value = candidate.record.address?.department
          if (!value) return fail("la fuente oficial no informa la división administrativa de este lugar: no se completa desde el barrio ni de otro dato")
          if (!decision.rowHash) return fail('falta "rowHash": la división queda atada a la fila del dataset que se revisó')
          if (decision.values?.["address.department"] !== value) return fail(`"values" tiene que traer el valor que se revisó para address.department (la fuente dice «${value}»)`)
          if (!resource.address) return fail("el lugar no tiene dirección a la que agregarle la división")
          resource.address = withDepartment(resource.address, value)
          divisions.push({ resourceId: resource.id, value, source: decision.source, key: decision.key, rowHash: candidate.record.rowHash })
        } else if (field === "coordinates") {
          const coordinates = coordinatesFor(candidate, manifest)
          if (!coordinates) return fail("el candidato no tiene coordenadas válidas (revisá sus avisos)")
          resource.coordinates = stampCoordinates(coordinates, batch)
        } else {
          if (candidate.gates.some((g) => g.level === "warn" && NEEDS_ADDRESS_OVERRIDE.includes(g.code)) && !decision.overrides?.address) return fail("la dirección del dataset es dudosa: escribí el valor en overrides.address")
          resource.address = { ...addressFor(candidate.record, manifest, candidate.resolved?.address ?? candidate.record.address), ...(decision.overrides?.address ?? {}) }
        }
        allow(resource.id, field === "address.department" ? "address" : field)
      }
      applied.push({ action: "apply", resourceId: resource.id, fields, reason: decision.reason, ...(divisions.length > 0 ? { division: divisions.pop() } : {}) })
      return
    }

    // accept: a new place
    if (candidate.tier === "T3") return fail(`el candidato está bloqueado (${candidate.gates.filter((g) => g.level === "fail").map((g) => g.code).join(", ")})`)
    if (candidate.link.status === "linked") return fail(`ya está publicado como "${candidate.link.resourceId}": usá apply para cambiar algo`)
    if (candidate.link.status === "suggested" && !decision.distinctFrom) return fail('parece un lugar ya publicado: decidí "link", o confirmá que es otro con "distinctFrom": [ids]')
    if (!candidate.publishable.ready || !candidate.proposal) return fail(`no se puede publicar todavía (${candidate.publishable.blockers.join(", ") || "sin propuesta"}): sigue siendo solo un candidato`)
    const warnings = candidate.gates.filter((g) => g.level === "warn").map((g) => g.code)
    const missing = warnings.filter((code) => !(decision.acknowledged ?? []).includes(code) && !(code === "duplicate-suspect" && decision.distinctFrom))
    if (missing.length > 0) return fail(`faltan reconocer avisos en "acknowledged": ${missing.join(", ")}`)
    if (warnings.some((code) => NEEDS_ADDRESS_OVERRIDE.includes(code)) && !decision.overrides?.address) return fail("la dirección del dataset es dudosa: escribí el valor correcto en overrides.address")
    const batch = batches[decision.batch]
    if (!batch) return fail(`no existe el lote "${decision.batch}"`)
    const batchErrors = validateBatch(batch)
    if (batchErrors.length > 0) return batchErrors.forEach(fail)
    if (batch.province !== province) return fail(`el lote es de ${batch.province}`)

    const overrides = decision.overrides ?? {}
    for (const field of Object.keys(overrides)) if (!OVERRIDABLE.includes(field)) return fail(`overrides.${field} no está permitido (solo ${OVERRIDABLE.join(", ")})`)
    for (const field of Object.keys(overrides.address ?? {})) if (!OVERRIDABLE_ADDRESS.includes(field)) return fail(`overrides.address.${field} no está permitido`)

    const resource = structuredClone(candidate.proposal)
    if (overrides.name) resource.name = overrides.name
    if (overrides.shortName) resource.shortName = overrides.shortName
    if (overrides.address) resource.address = { ...resource.address, ...overrides.address }
    resource.verification = verificationOf(batch)
    // A service that brings its own source (a statement about a group) is verified against that source, in the same batch
    for (const service of resource.services ?? []) if (service.source) service.verification = verificationOf(batch, service.source)
    if (resource.coordinates) resource.coordinates = stampCoordinates(resource.coordinates, batch)
    after.push(resource)
    applied.push({ action: "accept", resourceId: resource.id, source: decision.source, key: decision.key, batch: batch.id })
  })

  // Invariant: what was already published only changed where a decision says so
  for (const original of before) {
    const now = after.find((resource) => resource.id === original.id)
    for (const path of changedPaths(original, now)) {
      if (!(allowedChanges.get(original.id) ?? []).includes(path)) errors.push(`INVARIANTE: "${original.id}" cambió en "${path}" sin una decisión que lo explique`)
    }
  }
  if (after.length < before.length || before.some((r) => !after.find((a) => a.id === r.id))) errors.push("INVARIANTE: un lugar publicado desapareció")

  const data = { ...placesData, resources: after }
  if (errors.length === 0) {
    const validated = validateDataset({ files: [...otherFiles, { name: `places/${province.toLowerCase()}.json`, data }], schema, taxonomy })
    errors.push(...validated.errors.map((error) => `validación: ${error}`))
  }
  return { data, applied, skipped, errors }
}

/** Canonical form: used to compare two versions and for the places that have no earlier text */
export const serializePlaces = (data) => `${JSON.stringify(data, null, 2)}\n`

/** Splits the text of a places file into [header, ...one text per resource, footer], or null if it isn't laid out as expected */
const splitResources = (text) => {
  const lines = text.split("\n")
  const start = lines.findIndex((line) => line === '  "resources": [')
  if (start < 0) return null
  const chunks = []
  let current = null
  let end = -1
  for (let i = start + 1; i < lines.length; i++) {
    if (current === null && lines[i] === "    {") current = [lines[i]]
    else if (current !== null) {
      current.push(lines[i])
      if (lines[i] === "    }" || lines[i] === "    },") {
        chunks.push(current)
        current = null
      }
    } else if (lines[i] === "  ]") {
      end = i
      break
    }
  }
  if (current !== null || end < 0) return null
  return { header: lines.slice(0, start + 1), chunks, footer: lines.slice(end) }
}

const chunkValue = (chunk) => JSON.parse(chunk.join("\n").replace(/,$/, ""))

/** The text of a top-level field of a resource: `"key": value,` at the resource's indentation (the style of the file: externalIds on one line) */
const fieldLines = (key, value) => {
  if (key === "externalIds") {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    return [`      ${JSON.stringify(key)}: { ${entries.join(", ")} },`]
  }
  const lines = JSON.stringify(value, null, 2).split("\n")
  return [`      ${JSON.stringify(key)}: ${lines[0]}`, ...lines.slice(1).map((line) => `      ${line}`)].map((line, index, all) => (index === all.length - 1 ? `${line},` : line))
}

/** Index range [from, to) of the field `"key": …` in the lines of a resource, or null */
const fieldRange = (chunk, key) => {
  const from = chunk.findIndex((line) => line.startsWith(`      ${JSON.stringify(key)}:`))
  if (from < 0) return null
  if (chunk[from].trimEnd().endsWith("{") || chunk[from].trimEnd().endsWith("[")) {
    const closer = chunk[from].trimEnd().endsWith("{") ? "}" : "]"
    const to = chunk.findIndex((line, index) => index > from && (line === `      ${closer},` || line === `      ${closer}`))
    return to < 0 ? null : [from, to + 1]
  }
  return [from, from + 1]
}

const INSERT_BEFORE = { externalIds: '      "source": {', coordinates: '      "services": [', address: '      "coordinates": {' }

/**
 * The text of a resource with some top-level fields replaced or added, leaving every other line as it was.
 * Only the fields in INSERT_BEFORE are supported; null if the layout is not the expected one (the caller falls back to the canonical form).
 */
const withFields = (chunk, resource, keys) => {
  let lines = [...chunk]
  for (const key of keys) {
    if (!INSERT_BEFORE[key]) return null
    const range = fieldRange(lines, key)
    const block = fieldLines(key, resource[key])
    // The last line of the resource has no trailing comma; the fields handled here are never the last one
    if (range) lines = [...lines.slice(0, range[0]), ...block, ...lines.slice(range[1])]
    else {
      const at = lines.findIndex((line) => line === INSERT_BEFORE[key])
      if (at < 0) return null
      lines = [...lines.slice(0, at), ...block, ...lines.slice(at)]
    }
  }
  return lines
}

/**
 * The new text of a places file that changes ONLY what the decisions changed: every untouched resource keeps its exact text
 * (so the git diff is just the new lines), a resource that only got externalIds gets one line, and a new one is written whole.
 * The result is always checked against the data; if anything doesn't match, it falls back to the canonical form.
 */
export const serializePlacesPreserving = (originalText, before, after) => {
  const text = originalText.replace(/\r\n/g, "\n")
  const parts = splitResources(text)
  const canonical = serializePlaces({ ...JSON.parse(text), resources: after })
  if (!parts || parts.chunks.length !== before.length) return canonical
  const byId = new Map(before.map((resource, index) => [resource.id, { resource, chunk: parts.chunks[index] }]))
  const chunks = []
  for (const resource of after) {
    const old = byId.get(resource.id)
    let chunk = null
    if (old && deepEqual(old.resource, resource)) chunk = old.chunk
    else if (old) {
      const keys = Object.keys(resource).filter((key) => !deepEqual(resource[key] ?? null, old.resource[key] ?? null))
      const removed = Object.keys(old.resource).some((key) => !(key in resource))
      if (!removed && keys.length > 0) chunk = withFields(old.chunk, resource, keys)
    }
    if (chunk === null || !deepEqual(chunkValue(chunk), resource)) {
      chunk = JSON.stringify(resource, null, 2).split("\n").map((line) => `    ${line}`)
    }
    chunks.push([...chunk.slice(0, -1), chunk.at(-1).replace(/,$/, "")])
  }
  const body = chunks.map((chunk, index) => [...chunk.slice(0, -1), `${chunk.at(-1)}${index < chunks.length - 1 ? "," : ""}`]).flat()
  const output = `${[...parts.header, ...body, ...parts.footer].join("\n")}`
  const result = output.endsWith("\n") ? output : `${output}\n`
  return deepEqual(JSON.parse(result), { ...JSON.parse(text), resources: after }) ? result : canonical
}

export { stable }
