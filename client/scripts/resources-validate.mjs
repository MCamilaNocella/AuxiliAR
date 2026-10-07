/*
 * Validation of the resources dataset (client/src/data/resources).
 *
 * Two layers, no dependencies:
 *  1. The structure comes from resource.schema.json, checked by a small JSON Schema validator below.
 *     It only knows the keywords that file uses (plus "x-taxonomy": the value must be an id of taxonomy.json),
 *     and refuses to load a schema with any other keyword, so the schema can't say more than what is enforced.
 *  2. Rules that cross fields or records (unique ids and numbers, verification, dates, coverage...).
 */

const ANNOTATIONS = ["$schema", "$id", "$defs", "$comment", "title", "description", "default", "examples"]
const KEYWORDS = new Set([
  ...ANNOTATIONS,
  "type", "required", "additionalProperties", "properties", "items", "minItems", "uniqueItems",
  "minLength", "maxLength", "pattern", "minimum", "maximum", "enum", "oneOf", "$ref", "x-taxonomy",
])

/** Throws if the schema uses a keyword this validator doesn't enforce */
export const assertSchemaSupported = (schema, path = "#") => {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return
  for (const key of Object.keys(schema)) {
    if (!KEYWORDS.has(key)) throw new Error(`resource.schema.json: la palabra clave "${key}" (en ${path}) no está soportada por resources-validate.mjs`)
  }
  for (const [name, child] of Object.entries(schema.properties ?? {})) assertSchemaSupported(child, `${path}/properties/${name}`)
  for (const [name, child] of Object.entries(schema.$defs ?? {})) assertSchemaSupported(child, `${path}/$defs/${name}`)
  assertSchemaSupported(schema.items, `${path}/items`)
  if (typeof schema.additionalProperties === "object") assertSchemaSupported(schema.additionalProperties, `${path}/additionalProperties`)
  schema.oneOf?.forEach((child, index) => assertSchemaSupported(child, `${path}/oneOf/${index}`))
}

const typeOf = (value) => {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number"
  return typeof value
}

const matchesType = (value, type) => {
  const actual = typeOf(value)
  return actual === type || (type === "number" && actual === "integer")
}

const resolveRef = (ref, root) => {
  if (!ref.startsWith("#/")) throw new Error(`$ref no soportado: ${ref}`)
  return ref.slice(2).split("/").reduce((node, part) => node?.[part], root)
}

/** Ids of every list of taxonomy.json, by name */
const taxonomyIds = (taxonomy) =>
  Object.fromEntries(
    Object.entries(taxonomy)
      .filter(([, list]) => Array.isArray(list))
      .map(([name, list]) => [name, new Set(list.map((entry) => entry.id))]),
  )

const validateNode = (value, schema, ctx, path, errors) => {
  if (schema.$ref) {
    const target = resolveRef(schema.$ref, ctx.root)
    if (!target) throw new Error(`$ref sin destino: ${schema.$ref}`)
    return validateNode(value, target, ctx, path, errors)
  }

  if (schema.oneOf) {
    const matching = schema.oneOf.filter((option) => {
      const found = []
      validateNode(value, option, ctx, path, found)
      return found.length === 0
    })
    if (matching.length !== 1) errors.push(`${path}: no tiene un valor permitido`)
    return
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    if (!types.some((type) => matchesType(value, type))) {
      errors.push(`${path}: tiene que ser ${types.join(" o ")} y es ${typeOf(value)}`)
      return
    }
  }

  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: "${value}" no es uno de ${schema.enum.join(", ")}`)

  if (schema["x-taxonomy"]) {
    const ids = ctx.taxonomy[schema["x-taxonomy"]]
    if (!ids) throw new Error(`x-taxonomy desconocida: ${schema["x-taxonomy"]}`)
    if (!ids.has(value)) errors.push(`${path}: "${value}" no está en taxonomy.${schema["x-taxonomy"]} (${[...ids].join(", ")})`)
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: no puede estar vacío`)
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: tiene más de ${schema.maxLength} caracteres`)
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: "${value}" no tiene el formato esperado (${schema.pattern})`)
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: ${value} es menor que ${schema.minimum}`)
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: ${value} es mayor que ${schema.maximum}`)
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: necesita al menos ${schema.minItems} elemento(s)`)
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) errors.push(`${path}: tiene elementos repetidos`)
    if (schema.items) value.forEach((item, index) => validateNode(item, schema.items, ctx, `${path}[${index}]`, errors))
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of schema.required ?? []) {
      if (!(key in value)) errors.push(`${path}: falta "${key}"`)
    }
    const properties = schema.properties ?? {}
    for (const [key, child] of Object.entries(value)) {
      if (properties[key]) validateNode(child, properties[key], ctx, `${path}.${key}`, errors)
      else if (schema.additionalProperties === false) errors.push(`${path}: "${key}" no existe en el esquema`)
    }
  }
}

/** Structure of one file of lines/ against the schema (and the allowed values of taxonomy.json) */
export const validateStructure = (data, schema, taxonomy, label) => {
  assertSchemaSupported(schema)
  const errors = []
  validateNode(data, schema, { root: schema, taxonomy: taxonomyIds(taxonomy) }, label, errors)
  return errors
}

/** A real calendar day written AAAA-MM-DD ("2026-02-30" is not) */
export const isCalendarDate = (text) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text ?? "")
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

/** What numbers are compared by: digits only, so "0800-333-0160" and "08003330160" are the same one */
export const dialKey = (dial) => String(dial).replace(/\D/g, "")

const minutes = (time) => {
  const [hours, mins] = time.split(":").map(Number)
  return hours * 60 + mins
}

const checkCoverage = (coverage, path, errors) => {
  if (!coverage) return
  const { level, provinces = [], areas = [] } = coverage
  if (level === "national" && (provinces.length > 0 || areas.length > 0)) errors.push(`${path}: un alcance "national" no lleva provincias ni áreas`)
  if (level === "province" && provinces.length === 0) errors.push(`${path}: un alcance "province" necesita al menos una provincia`)
  if (level === "region" && provinces.length === 0 && areas.length === 0) errors.push(`${path}: un alcance "region" necesita provincias o áreas`)
}

const checkHours = (hours, path, errors) => {
  if (!hours) return
  if (hours.open24h && (hours.schedule?.length ?? 0) > 0) errors.push(`${path}: si abre las 24 h no lleva schedule`)
  hours.schedule?.forEach(({ from, to }, index) => {
    if (minutes(from) >= minutes(to)) errors.push(`${path}.schedule[${index}]: "from" tiene que ser anterior a "to"`)
  })
}

const checkVerification = (resource, path, errors) => {
  const { status, verifiedAt, verifiedBy, nextReviewDue } = resource.verification
  if (verifiedAt && !isCalendarDate(verifiedAt)) errors.push(`${path}.verification.verifiedAt: "${verifiedAt}" no es una fecha real`)
  if (nextReviewDue && !isCalendarDate(nextReviewDue)) errors.push(`${path}.verification.nextReviewDue: "${nextReviewDue}" no es una fecha real`)

  if (status === "verified") {
    if (!verifiedAt) errors.push(`${path}.verification: un recurso verificado necesita verifiedAt`)
    if (!verifiedBy) errors.push(`${path}.verification: un recurso verificado necesita verifiedBy`)
    if (!nextReviewDue) errors.push(`${path}.verification: un recurso verificado necesita nextReviewDue (sin esa fecha no se sabe cuándo vence)`)
    if (!resource.source?.url) errors.push(`${path}: un recurso verificado necesita source.url (la fuente oficial)`)
  }
  if (verifiedAt && nextReviewDue && isCalendarDate(verifiedAt) && isCalendarDate(nextReviewDue) && nextReviewDue <= verifiedAt) {
    errors.push(`${path}.verification: nextReviewDue (${nextReviewDue}) tiene que ser posterior a verifiedAt (${verifiedAt})`)
  }
}

/**
 * Whole dataset: `files` is [{ name, data }] (each one already parsed).
 * Returns the problems found and, when there are none, the resources of every file.
 * `categoryIds` (optional): the ids of the real categories, to check taxonomy.categories against them.
 */
export const validateDataset = ({ files, schema, taxonomy, categoryIds = null }) => {
  const errors = []
  const resources = []
  const seenIds = new Map()
  const seenDials = new Map()

  if (categoryIds) {
    const listed = new Set(taxonomy.categories.map(({ id }) => id))
    for (const id of categoryIds) if (!listed.has(id)) errors.push(`taxonomy.categories: falta la categoría "${id}", que existe en la app`)
    for (const id of listed) if (!categoryIds.includes(id)) errors.push(`taxonomy.categories: "${id}" no existe como categoría en la app`)
  }

  for (const { name, data } of files) {
    const structural = validateStructure(data, schema, taxonomy, name)
    errors.push(...structural)
    if (structural.length > 0) continue

    data.resources.forEach((resource, index) => {
      const path = `${name}: resources[${index}] (${resource.id})`
      resources.push(resource)

      if (seenIds.has(resource.id)) errors.push(`${path}: el id ya está en ${seenIds.get(resource.id)}`)
      else seenIds.set(resource.id, name)

      resource.contacts.forEach((contact, contactIndex) => {
        const key = dialKey(contact.dial)
        const where = `${name}: ${resource.id}.contacts[${contactIndex}]`
        if (seenDials.has(key)) errors.push(`${where}: el número ${contact.dial} ya está en ${seenDials.get(key)}`)
        else seenDials.set(key, `${name}: ${resource.id}`)
        checkCoverage(contact.scope, `${where}.scope`, errors)
        checkHours(contact.hours, `${where}.hours`, errors)
      })

      checkCoverage(resource.coverage, `${path}.coverage`, errors)
      checkHours(resource.hours, `${path}.hours`, errors)
      checkVerification(resource, path, errors)

      const categories = resource.categories ?? []
      for (const { category } of resource.sections ?? []) {
        if (!categories.includes(category)) errors.push(`${path}.sections: la categoría "${category}" tiene que estar también en categories`)
      }
    })
  }

  return { errors, resources: errors.length === 0 ? resources : [] }
}
