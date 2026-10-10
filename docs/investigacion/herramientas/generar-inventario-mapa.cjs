/*
 * Genera docs/investigacion/inventario-mapa-servicios.csv a partir de los datos del mapa (solo lectura).
 * No modifica los datos ni el código de la aplicación: lee client/src/data/resources/places/*.json y taxonomy.json.
 *
 * Uso (desde la raíz del repositorio):
 *   node docs/investigacion/herramientas/generar-inventario-mapa.cjs
 *   INVENTARIO_FECHA=2026-10-15 node docs/investigacion/herramientas/generar-inventario-mapa.cjs   (para otra fecha de vigencia)
 *
 * Una fila por PRESTACIÓN de cada ESTABLECIMIENTO (un establecimiento con 9 prestaciones da 9 filas).
 * Las reglas de «vigente» y de «visible» replican las de la app: client/src/data/resources/index.ts (isVerificationCurrent,
 * isServiceCurrent, isMappable) y client/src/utils/places (isVerifiedFree, PLACE_FILTERS). Si esas reglas cambian, revisar acá.
 */
const fs = require("node:fs")
const path = require("node:path")

const root = path.resolve(__dirname, "../../..")
const dataDir = path.join(root, "client/src/data/resources")
const taxonomy = JSON.parse(fs.readFileSync(path.join(dataDir, "taxonomy.json"), "utf8"))
const day = process.env.INVENTARIO_FECHA || new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date())

// Lo mismo que PLACE_FILTERS de client/src/utils/places/filters.ts (filtros rápidos del mapa, por tipo de prestación)
const QUICK_FILTERS = [
  ["Atención médica", ["primary-care", "specialty-care", "ophthalmology", "diagnostic-imaging", "laboratory", "pharmacy"]],
  ["Salud mental", ["mental-health-care", "mental-health-emergency"]],
  ["Salud sexual", ["sexual-reproductive-health", "contraception", "emergency-contraception", "condoms", "pregnancy-care", "sti-testing-care", "ive-ile-care", "sexual-health-counseling"]],
  ["Vacunación", ["vaccination"]],
  ["Odontología", ["dentistry"]],
  ["Guardias", ["emergency-room", "mental-health-emergency"]],
  ["Salud animal", ["rabies-vaccination", "spaying-neutering", "veterinary-care", "zoonosis"]],
]
const GUARDIA_TYPES = new Set(["emergency-room", "mental-health-emergency"])

const label = (list, id) => taxonomy[list].find((entry) => entry.id === id)?.label ?? id
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

const hoursText = (hours) => {
  if (!hours) return "No documentado"
  if (hours.open24h) return "24 horas"
  const parts = (hours.schedule ?? []).map(({ days, from, to }) => {
    const sorted = [...days].sort((a, b) => a - b)
    const contiguous = sorted.length > 2 && sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1)
    const names = contiguous ? `${DAYS[sorted[0]]}-${DAYS[sorted[sorted.length - 1]]}` : sorted.map((d) => DAYS[d]).join(", ")
    return `${names} ${from}-${to}`
  })
  return parts.length > 0 ? parts.join("; ") : "Sin franjas documentadas"
}

const norm = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const phones = (contacts) => (contacts ?? []).map((c) => `${c.display}${c.label ? ` (${c.label})` : ""}`).join(" | ")
const isCurrent = ({ status, verifiedAt, nextReviewDue }) => status === "verified" && Boolean(verifiedAt) && Boolean(nextReviewDue) && day < nextReviewDue
const yes = (value) => (value ? "sí" : "no")

const files = fs.readdirSync(path.join(dataDir, "places")).filter((name) => name.endsWith(".json")).sort()
const rows = []
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, "places", file), "utf8"))
  for (const place of data.resources) {
    const address = place.address ?? {}
    const coords = place.coordinates ?? null
    const mappable = coords?.status === "verified"
    const placeCurrent = isCurrent(place.verification)
    for (const service of place.services ?? []) {
      const hasHours = Object.hasOwn(service, "hours")
      const hours = hasHours ? (service.hours ?? null) : (place.hours ?? null)
      const cost = service.cost ?? place.cost ?? "unknown"
      const costNote = service.costNote ?? place.costNote ?? ""
      const source = service.source ?? place.source ?? {}
      const verification = service.verification ?? place.verification
      const serviceCurrent = placeCurrent && isCurrent(verification)
      // isVerifiedFree: the service itself says "free" and its own source has a note that says why
      const verifiedFree = cost === "free" && service.cost === "free" && Boolean(service.source?.note?.trim())
      const visibleList = serviceCurrent && verifiedFree
      const visibleMap = visibleList && mappable
      const reasons = []
      if (!verifiedFree) reasons.push(cost === "free" ? "Gratuidad heredada del establecimiento o sin nota de fuente propia de la prestación" : `Gratuidad no documentada (costo: ${label("costs", cost)})`)
      if (!placeCurrent) reasons.push(`Establecimiento no vigente (estado ${verification.status}; próxima revisión ${place.verification.nextReviewDue ?? "sin fecha"})`)
      else if (!serviceCurrent) reasons.push(`Prestación no vigente (próxima revisión ${verification.nextReviewDue ?? "sin fecha"})`)
      if (visibleList && !mappable) reasons.push("Sin coordenadas verificadas: solo en la lista")
      const categories = taxonomy.serviceTypes.find((entry) => entry.id === service.type)?.categories ?? []
      const quick = QUICK_FILTERS.filter(([, types]) => types.includes(service.type)).map(([name]) => name)
      const evidence = service.evidence ?? []
      const serviceName = service.name ?? label("serviceTypes", service.type)
      rows.push({
        fecha_inventario: day,
        id_fila: `${place.id}#${service.id}`,
        id_establecimiento: place.id,
        id_prestacion: service.id,
        ids_externos: Object.entries(place.externalIds ?? {}).map(([k, v]) => `${k}=${v}`).join(" | "),
        archivo_origen: `client/src/data/resources/places/${file}`,
        establecimiento: place.name,
        nombre_corto: place.shortName ?? "",
        tipo_establecimiento_id: place.facilityType ?? "",
        tipo_establecimiento: place.facilityType ? label("facilityTypes", place.facilityType) : "",
        jurisdiccion_nivel: place.jurisdiction ? label("jurisdictionLevels", place.jurisdiction.level) : "",
        jurisdiccion_organismo: place.jurisdiction?.organization ?? "",
        prestacion_tipo_id: service.type,
        prestacion: serviceName,
        prestacion_descripcion: service.description ?? "",
        categoria_id: categories.join(" | "),
        categoria: categories.map((id) => label("categories", id)).join(" | "),
        subcategoria: label("serviceTypes", service.type),
        filtro_rapido_mapa: quick.join(" | "),
        calle: address.street ?? "",
        numero: address.number ?? "",
        barrio: address.neighborhood ?? "",
        localidad: address.locality ?? "",
        division_comuna_partido: address.department ?? "",
        provincia_codigo: address.province ?? "",
        provincia: address.province ? label("provinces", address.province) : "",
        codigo_postal: address.postalCode ?? "",
        referencia_direccion: address.reference ?? "",
        latitud: coords ? coords.lat : "",
        longitud: coords ? coords.lng : "",
        coordenadas_precision: coords ? (coords.precision === "exact" ? "exacta" : "aproximada") : "",
        coordenadas_estado: coords ? label("coordinateStatuses", coords.status) : "sin coordenadas",
        coordenadas_metodo: coords?.method ? label("coordinateMethods", coords.method) : "",
        coordenadas_verificadas_el: coords?.verifiedAt ?? "",
        coordenadas_verificadas_por: coords?.verifiedBy ?? "",
        coordenadas_nota: coords?.note ?? "",
        costo: cost,
        costo_texto: label("costs", cost),
        gratuidad_estado: verifiedFree ? (costNote ? "Gratuita con condiciones (documentada para esta prestación)" : "Gratuita (documentada para esta prestación)") : cost === "free" ? "Gratuita según norma general o dato del establecimiento (no documentada para esta prestación)" : "No documentada",
        nota_costo: costNote,
        requisitos: (service.requirements ?? place.requirements ?? []).join(" | "),
        destinatarios: (service.audience ?? place.audience ?? []).map((a) => label("audiences", a)).join(" | "),
        turno_modo: label("appointmentModes", (service.appointment ?? { mode: "unknown" }).mode),
        turno_como: service.appointment?.howTo ?? "",
        turno_url: service.appointment?.url ?? "",
        horarios: hoursText(hours),
        horarios_nota: hours?.note ?? "",
        abierto_24h: hours ? yes(hours.open24h) : "no documentado",
        es_guardia: yes(GUARDIA_TYPES.has(service.type)),
        horarios_documentados: yes(Boolean(hours)),
        telefonos_establecimiento: phones(place.contacts),
        telefonos_prestacion: phones(service.contacts),
        fuente_organismo: source.organization ?? "",
        fuente_url: source.url ?? "",
        fuente_consultada_el: source.retrievedAt ?? "",
        fuente_licencia: source.license ?? "",
        fuente_nota: source.note ?? "",
        evidencias_cantidad: evidence.length,
        evidencias: evidence.map((e) => `${e.kind}: ${e.organization} - ${e.url} (consultada ${e.retrievedAt})${e.note ? ` - ${e.note}` : ""}`).join(" || "),
        verificacion_establecimiento: label("verificationStatuses", place.verification.status),
        verificacion_establecimiento_el: place.verification.verifiedAt ?? "",
        verificacion_establecimiento_por: place.verification.verifiedBy ?? "",
        verificacion_establecimiento_proxima_revision: place.verification.nextReviewDue ?? "",
        verificacion_prestacion: label("verificationStatuses", verification.status),
        verificacion_prestacion_el: verification.verifiedAt ?? "",
        verificacion_prestacion_por: verification.verifiedBy ?? "",
        verificacion_prestacion_proxima_revision: verification.nextReviewDue ?? "",
        verificacion_notas: [place.verification.notes, service.verification?.notes].filter(Boolean).join(" || "),
        vigente_hoy: yes(serviceCurrent),
        visible_en_lista: yes(visibleList),
        visible_en_mapa: yes(visibleMap),
        motivo_no_visible: visibleMap ? "" : reasons.join("; "),
        clave_duplicado_direccion: [norm(address.street), norm(address.number), norm(address.locality), address.province ?? ""].join("|"),
        clave_duplicado_nombre: norm(place.name),
        clave_duplicado_prestacion: `${norm(place.name)}|${service.type}`,
      })
    }
  }
}

const columns = Object.keys(rows[0])
const cell = (value) => {
  const text = String(value ?? "").replace(/\s*\r?\n\s*/g, " ")
  return /[",;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csv = [columns.join(","), ...rows.map((row) => columns.map((c) => cell(row[c])).join(","))].join("\r\n") + "\r\n"
const out = path.join(root, "docs/investigacion/inventario-mapa-servicios.csv")
fs.writeFileSync(out, csv, "utf8")

const places = new Set(rows.map((r) => r.id_establecimiento))
const visible = rows.filter((r) => r.visible_en_mapa === "sí")
console.log(`Fecha de vigencia: ${day}`)
console.log(`Archivos de provincia: ${files.join(", ")}`)
console.log(`Establecimientos: ${places.size}; prestaciones (filas): ${rows.length}; columnas: ${columns.length}`)
console.log(`Visibles en el mapa: ${new Set(visible.map((r) => r.id_establecimiento)).size} establecimientos, ${visible.length} prestaciones`)
console.log(`Escrito: ${path.relative(root, out)}`)
