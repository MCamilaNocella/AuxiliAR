/*
 * Proposal of a batch, for editorial review BEFORE publishing anything.
 *
 * It reads the candidates and writes:
 *   - a report: what would be published, what needs a person, and why
 *   - the decisions that would publish it (`accept`), with reviewer and date EMPTY: publish refuses a decision without them,
 *     so these cannot be applied by accident. A person reviews, approves the mapping entries, fills reviewer/date and copies them
 *     to curation/decisions/<province>.decisions.json
 *   - the complete mapping table, for the editorial review of every term
 * A candidate is "proposed" only if it would be publishable once the clear equivalences are approved AND nothing is in conflict.
 */
import { pageFacts } from "./ficha-facts.mjs"
import { lookupTerm } from "./candidates.mjs"
import { termKey } from "./fichas.mjs"

const REASONS = {
  "address-conflict": "la dirección del dataset y la de la página oficial no coinciden",
  "address-unparsed": "la dirección del dataset es una esquina o un texto sin calle y altura, y no hay página oficial que la aclare",
  "address-street-inverted": "la calle está escrita al revés en el dataset y no hay página oficial que la confirme",
  "address-street-has-digits": "la calle del dataset tiene números y no se puede separar de la altura sin adivinar",
  "address-list-differs": "dos páginas oficiales dan direcciones distintas",
  "phone-differs": "el teléfono principal no coincide entre el dataset y la página oficial",
  "phone-conflict": "ningún teléfono coincide entre el dataset y la página oficial",
  "specialties-truncated": "el dataset corta la lista de especialidades y no hay página oficial que la complete",
  "no-approved-service": "ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable)",
  "facility-type-not-approved": "el tipo de establecimiento no tiene una equivalencia clara",
  "duplicate-suspect": "parece un lugar ya publicado",
  "shared-coordinates": "otro registro tiene exactamente el mismo punto",
  "coordinates-rejected": "las coordenadas fueron rechazadas",
  "coordinates-outside-box": "las coordenadas caen fuera del área esperada",
}
const reasonText = (code) => REASONS[code] ?? code

const table = (headers, rows) => [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.map((cell) => String(cell ?? "").replaceAll("|", "/")).join(" | ")} |`)].join("\n")

const labelOf = (taxonomy) => {
  const labels = Object.fromEntries(taxonomy.serviceTypes.map(({ id, label }) => [id, label]))
  return (type) => labels[type] ?? type
}

const addressText = (candidate) => {
  const { address } = candidate.resolved
  return address.street ? `${address.street} ${address.number}${address.resolvedBy === "page" ? " (página oficial)" : " (dataset)"}` : `⚠ ${candidate.record.address.raw}`
}

/** Candidates → { markdown, decisions, stats } */
export const buildProposal = ({ candidates, batch, taxonomy, manifests }) => {
  const label = labelOf(taxonomy)
  const cesac = candidates.filter((c) => c.source === "caba-cesac")
  const hospitals = candidates.filter((c) => c.source === "caba-hospitales")
  const generales = hospitals.filter((c) => c.record.facilityTypeRaw === "Hospital General de Agudos")
  const others = hospitals.filter((c) => c.record.facilityTypeRaw !== "Hospital General de Agudos")
  const isNew = (c) => c.link.status === "new"
  const split = (list) => ({ proposed: list.filter((c) => isNew(c) && c.proposed.ready), manual: list.filter((c) => isNew(c) && !c.proposed.ready), published: list.filter((c) => c.link.status === "linked") })
  const cs = split(cesac)
  const gs = split(generales)
  const os = split(others)

  const typeCounts = (list) => {
    const counts = {}
    for (const c of list) for (const type of c.proposed.services) counts[type] = (counts[type] ?? 0) + 1
    return counts
  }
  const comuna = (c) => c.record.address.comuna ?? "sin comuna"
  const coverage = {}
  for (const c of [...cs.proposed, ...gs.proposed]) coverage[comuna(c)] = { ...(coverage[comuna(c)] ?? { proposed: 0, published: 0 }), proposed: (coverage[comuna(c)]?.proposed ?? 0) + 1 }
  for (const c of [...cs.published, ...os.published, ...gs.published]) coverage[comuna(c)] = { proposed: coverage[comuna(c)]?.proposed ?? 0, published: (coverage[comuna(c)]?.published ?? 0) + 1 }
  const allComunas = [...new Set(candidates.map(comuna))].sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")))
  const mappable = (list) => list.filter((c) => c.proposalIfApproved?.coordinates).length

  const stats = {
    cesac: { total: cesac.length, published: cs.published.length, proposed: cs.proposed.length, manual: cs.manual.length, services: typeCounts(cs.proposed), withCoordinates: mappable(cs.proposed) },
    generales: { total: generales.length, published: gs.published.length, proposed: gs.proposed.length, manual: gs.manual.length, services: typeCounts(gs.proposed), withCoordinates: mappable(gs.proposed) },
    otherHospitals: { total: others.length, published: os.published.length, proposed: os.proposed.length, manual: os.manual.length },
    coverage,
  }

  const lines = [
    `# Propuesta del lote ${batch.id}: para revisión (NO publicado)`,
    "",
    `Datos: ${manifests.map((m) => `${m.label} (descarga ${m.current.retrievedAt}, actualizado ${m.current.officialUpdatedAt ?? "s/d"}, ${m.license})`).join("; ")}. Páginas oficiales de buenosaires.gob.ar leídas el ${batch.verifiedAt} (CC-BY-2.5-AR).`,
    `Verificación: ${batch.verifiedAt}, próxima revisión ${batch.nextReviewDue} (${batch.reviewDays ?? "?"} días), por ${batch.verifiedBy}.`,
    "",
    "**Nada de esto está publicado.** Esta propuesta supone aprobadas solo las equivalencias que el mapeo marca como claras (`proposal: approvable`); hasta que una persona las apruebe, el pipeline no publica ninguna prestación.",
    "",
    "## Resumen",
    "",
    table(["Grupo", "En la fuente", "Ya publicados", "Propuestos", "Revisión manual"], [
      ["CeSAC", stats.cesac.total, stats.cesac.published, stats.cesac.proposed, stats.cesac.manual],
      ["Hospitales Generales de Agudos", stats.generales.total, stats.generales.published, stats.generales.proposed, stats.generales.manual],
      ["Otros hospitales", stats.otherHospitals.total, stats.otherHospitals.published, stats.otherHospitals.proposed, stats.otherHospitals.manual],
    ]),
    "",
    `- Con coordenadas (irían al mapa): ${stats.cesac.withCoordinates} CeSAC y ${stats.generales.withCoordinates} hospitales propuestos.`,
    "- No se afirma gratuidad, horarios, turnos ni requisitos. Única excepción: la guardia 24 h de los Hospitales Generales de Agudos, que una página oficial afirma textualmente (con su cita).",
    "",
    "## Prestaciones verificables propuestas",
    "",
    "CeSAC (la lista sale de la página oficial de cada CeSAC, que completa lo que el dataset corta):",
    "",
    table(["Prestación", "CeSAC"], Object.entries(stats.cesac.services).sort((a, b) => b[1] - a[1]).map(([type, n]) => [label(type), n])),
    "",
    "Hospitales Generales de Agudos:",
    "",
    table(["Prestación", "Hospitales"], Object.entries(stats.generales.services).map(([type, n]) => [`${label(type)}${type === "emergency-room" ? " (24 h, todos los días: lo dice la página oficial)" : ""}`, n])),
    "",
    "## CeSAC propuestos",
    "",
    table(["Clave", "Id", "CeSAC", "Dirección", "Teléfonos", "Prestaciones", "A reconocer"],
      cs.proposed.map((c) => [c.key, c.id, c.record.shortName ?? c.record.name, addressText(c), (c.proposalIfApproved?.contacts ?? []).map((p) => `${p.display}${p.label ? ` (${p.label})` : ""}`).join(", ") || "—", c.proposed.services.map(label).join(", "), c.gates.filter((g) => g.level === "warn").map((g) => g.code).join(", ") || "—"])),
    "",
    "## CeSAC que requieren revisión manual",
    "",
    table(["Clave", "CeSAC", "Dirección en el dataset", "Por qué no se propone"],
      cs.manual.map((c) => [c.key, c.record.shortName ?? c.record.name, c.record.address.raw, c.proposed.reasons.map(reasonText).join("; ")])),
    "",
    "## Hospitales Generales de Agudos",
    "",
    "Fuente de la guardia: «Hospitales Generales de Agudos», buenosaires.gob.ar: «los 14 hospitales cuentan con guardia las 24 hs del día los 365 días del año». No dice que sea sin turno ni gratuita: no se afirma.",
    "",
    table(["Hospital", "Estado", "Dirección", "Teléfonos", "Motivo"],
      [...gs.proposed, ...gs.manual].map((c) => [c.record.name, c.proposed.ready ? "propuesto" : "revisión manual", addressText(c), (c.proposalIfApproved?.contacts ?? c.resolved.phones).map((p) => `${p.display}${p.label ? ` (${p.label})` : ""}`).join(", ") || "—", c.proposed.ready ? "—" : c.proposed.reasons.map(reasonText).join("; ")])),
    "",
    "La guardia de salud mental de estos hospitales (página «Guardias hospitalarias») queda como **dudosa**: la página los lista pero no aclara si el teléfono de guardia es el de salud mental. No se propone.",
    "",
    "## Otros hospitales",
    "",
    `${stats.otherHospitals.total} hospitales especializados e institutos de la fuente (${stats.otherHospitals.published} ya publicados): **ninguno se propone**. El dataset da una sola "especialidad" por hospital, sin horarios ni guardia confirmada, y no se infieren prestaciones desde el tipo de hospital.`,
    "",
    "## Cobertura geográfica (por comuna)",
    "",
    table(["Comuna", "Ya publicados", "Propuestos"], allComunas.map((name) => [name, coverage[name]?.published ?? 0, coverage[name]?.proposed ?? 0])),
    "",
    "## Cómo se aplicaría",
    "",
    "1. Revisar y aprobar las entradas del mapeo (`curation/proposals/caba-cesac.mapping-review.md`): `approved: true`, `approvedBy`, `approvedAt`.",
    "2. Aprobar las afirmaciones de guardia (`curation/supplements/caba-hospitales.claims.json`, `approved: true`).",
    `3. Completar \`reviewer\` y \`decidedAt\` de las decisiones de \`${batch.id}.decisions.proposed.json\` que se acepten y copiarlas a \`curation/decisions/ar-c.decisions.json\`.`,
    "4. `npm run curation -- publish AR-C` (simulación), después `--write` y `npm run resources:sync`.",
    "",
  ]

  const decisions = {
    note: `PROPUESTAS del lote ${batch.id}: NO tienen efecto. reviewer y decidedAt están vacíos a propósito (publish las rechaza así). Se aplican solo si una persona las revisa, completa esos dos campos y las copia a curation/decisions/ar-c.decisions.json, y si aprobó antes las entradas del mapeo que usan.`,
    batch: batch.id,
    decisions: [...cs.proposed, ...gs.proposed].map((c) => ({
      source: c.source,
      key: c.key,
      action: "accept",
      batch: batch.id,
      rowHash: c.record.rowHash,
      reviewer: null,
      decidedAt: null,
      acknowledged: c.gates.filter((g) => g.level === "warn").map((g) => g.code),
      proposes: { id: c.id, name: c.record.shortName ?? c.record.name, services: c.proposed.services },
    })),
  }
  return { markdown: lines.join("\n"), decisions, stats }
}

/** The complete table of terms for the editorial review of the CeSAC mapping */
export const mappingReview = ({ mapping, pages, snapshot, taxonomy }) => {
  const label = labelOf(taxonomy)
  const terms = new Map()
  for (const page of Object.values(pages)) {
    const facts = pageFacts(page)
    if (!facts) continue
    const seenInPage = new Set()
    for (const [section, list] of [["Especialidades", facts.specialties], ["Programas", facts.programs]]) {
      for (const term of list) {
        const key = termKey(term)
        if (seenInPage.has(key)) continue
        seenInPage.add(key)
        const entry = terms.get(key) ?? { key, forms: new Set(), count: 0, sections: new Set(), term }
        entry.count++
        entry.forms.add(term)
        entry.sections.add(section)
        terms.set(key, entry)
      }
    }
  }
  const rows = [...terms.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)).map((entry) => {
    const found = lookupTerm(mapping.fichaTerms, entry.term)
    const state = !found ? "sin propuesta" : found.proposal === "approvable" ? "APROBABLE" : "DUDOSO"
    return [entry.count, [...entry.forms].slice(0, 2).join(" / "), [...entry.sections].join("+"), state, found?.serviceType ? label(found.serviceType) : "—", found?.note ?? (found ? "" : "No es una equivalencia clara o es un programa/equipo local: no se publica como prestación.")]
  })
  const datasetRows = Object.entries(mapping.specialties).map(([name, entry]) => {
    const count = snapshot.records.filter((r) => r.specialtiesRaw.includes(name)).length
    return [count, name, entry.proposal === "approvable" ? "APROBABLE" : "DUDOSO", entry.serviceType ? label(entry.serviceType) : "—", entry.note ?? ""]
  }).sort((a, b) => b[0] - a[0])
  const state = (list) => list.filter((row) => row[3] === "APROBABLE").length
  return [
    "# Mapeos de los CeSAC: propuesta para revisión editorial",
    "",
    "Nada está aprobado. **APROBABLE** = equivalencia clara que se propone aprobar. **DUDOSO** = hay una duda (el tipo que figura es tentativo y no se publica). **sin propuesta** = no es una prestación clara (programas, equipos, talleres, profesiones sin atención propia): no se publica.",
    "",
    `Términos distintos en las ${Object.keys(pages).length} páginas oficiales de CeSAC leídas: ${rows.length} (aprobables: ${state(rows)}, dudosos: ${rows.filter((r) => r[3] === "DUDOSO").length}, sin propuesta: ${rows.filter((r) => r[3] === "sin propuesta").length}).`,
    "",
    "## Términos de las páginas oficiales (fuente preferida: están completos)",
    "",
    table(["CeSAC", "Término", "Sección", "Propuesta", "Tipo de prestación", "Nota"], rows),
    "",
    "## Especialidades del dataset (cortadas por el publicador a 254 bytes: solo sirven si no hay página oficial y la lista no está cortada)",
    "",
    table(["CeSAC", "Especialidad", "Propuesta", "Tipo de prestación", "Nota"], datasetRows),
    "",
    "## Tipo de establecimiento",
    "",
    table(["Tipo en la fuente", "Propuesta", "Equivale a"], Object.entries(mapping.facilityTypes).map(([name, entry]) => [name, entry.proposal === "approvable" ? "APROBABLE" : "DUDOSO", entry.facilityType])),
    "",
  ].join("\n")
}
