/*
 * Tests of the CABA 2 batch: the official pages (fichas), the supplements, the claims about guardias, the proposal and what is
 * already applied. Run: npm run curation:test
 *
 * The saved official pages (curation/supplements) are the evidence: these tests run offline on them. Nothing here writes to the dataset.
 */
import assert from "node:assert/strict"
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"
import { test } from "node:test"
import { BLOCKING_WARNINGS, buildCandidates, claimServices, lookupTerm, mergePhones, resolveAddress } from "./curation/candidates.mjs"
import { distanceMeters } from "./curation/diff.mjs"
import { decodeEntities, fichaFields, htmlToLines, splitTerms, termKey } from "./curation/fichas.mjs"
import { pageFacts, parsePagePhones } from "./curation/ficha-facts.mjs"
import { parseAddressCaba } from "./curation/lib/normalize.mjs"
import { clientRoot, readJson } from "./curation/lib/util.mjs"
import { checkCuration, DATASET_DIR, loadDataset, runPublish } from "./curation/pipeline.mjs"
import { buildProposal, mappingReview } from "./curation/proposal.mjs"
import { planPublish, validateBatch } from "./curation/publish.mjs"
import { PATHS, loadManifest, loadSnapshot } from "./curation/sources.mjs"
import { fetchSupplements, loadSupplements } from "./curation/supplements.mjs"
import { withoutSexualBatch } from "./places-sexual-batch.mjs"

const FIXTURES = join(clientRoot, "scripts/__fixtures__/curation")
// The pipeline tests are about the places of the first batches: the 44 places of the sexual health batch (loaded by hand with a link each) are in `publishedAll`
const publishedAll = (await readJson(join(DATASET_DIR, "places/ar-c.json"))).resources
const published = withoutSexualBatch(publishedAll)
const { schema, taxonomy, otherFiles } = await loadDataset({ province: "AR-C" })

const cesacManifest = await loadManifest("caba-cesac")
const hospManifest = await loadManifest("caba-hospitales")
const cesacSupp = await loadSupplements("caba-cesac")
const hospSupp = await loadSupplements("caba-hospitales")
const cesacSnap = await loadSnapshot("caba-cesac")
const hospSnap = await loadSnapshot("caba-hospitales")
const cesacMapping = await readJson(join(PATHS.mappings, "caba-cesac.json"))
const hospMapping = await readJson(join(PATHS.mappings, "caba-hospitales.json"))
const batch = await readJson(join(PATHS.batches, "caba-2.batch.json"))

const allCesac = buildCandidates({ manifest: cesacManifest, snapshot: cesacSnap, mapping: cesacMapping, published, supplements: cesacSupp }).candidates
const allHosp = buildCandidates({ manifest: hospManifest, snapshot: hospSnap, mapping: hospMapping, published, supplements: hospSupp }).candidates
const generales = allHosp.filter((c) => c.record.facilityTypeRaw === "Hospital General de Agudos")
const fresh = (list) => list.filter((c) => c.link.status === "new")
const base = { reviewer: "equipo-auxiliar", decidedAt: "2026-10-07" }

const plan = ({ decisions, candidates, resources = published }) =>
  planPublish({
    province: "AR-C",
    placesData: { $schema: "../resource.schema.json", resources: structuredClone(resources) },
    candidates,
    decisions,
    batches: { [batch.id]: batch },
    manifests: { "caba-cesac": cesacManifest, "caba-hospitales": hospManifest },
    otherFiles,
    schema,
    taxonomy,
  })

// ─── Reading the official pages ──────────────────────────────────────────────────────────────────

test("pages: entities, labels in every layout the CeSAC pages use, and terms", () => {
  assert.equal(decodeEntities("CeSAC N&ordm; 3 &amp; m&aacute;s &foo;"), "CeSAC Nº 3 & más &foo;")
  assert.deepEqual(htmlToLines("<p>Uno</p><p> Dos&nbsp; tres </p>"), ["Uno", "Dos tres"])
  assert.deepEqual(splitTerms("Clínica médica, ecografía (mamaria, gineco), farmacia."), ["Clínica médica", "ecografía (mamaria, gineco)", "farmacia"])
  assert.equal(termKey("  Odontología. "), "odontologia")
  const { fields } = fichaFields(["Dirección :", "Ulla Ulla 2839", "Teléfono principal:28213606", "Especialidades", "Clínica Médica", "Programas", "Vacunación"])
  assert.deepEqual(fields, { Dirección: ["Ulla Ulla 2839"], "Teléfono principal": ["28213606"], Especialidades: ["Clínica Médica"], Programas: ["Vacunación"] })
})

test("pages: what the saved official pages of CeSAC 3, 4, 6, 21 and 33 say", () => {
  const f3 = pageFacts(cesacSupp.pages["3"])
  assert.equal(f3.address, "Soldado de la Frontera 5144")
  assert.deepEqual(f3.phones.map((p) => [p.display, p.label]), [["2821-3603", "Principal"], ["11 5048-1097", "Alternativo"]])
  assert.ok(f3.specialties.includes("Clínica médica") && f3.specialties.some((t) => /odontolog/i.test(t)))
  assert.ok(f3.programs.includes("IVE/ILE") && f3.programs.includes("vacunación"))
  const f4 = pageFacts(cesacSupp.pages["4"])
  assert.equal(f4.address, "Av. J. B Alberdi 6300")
  assert.ok(f4.specialties.includes("Salud mental infantil, adolescencia y de adultos"), "una lista por líneas no se parte por comas")
  assert.deepEqual(pageFacts(cesacSupp.pages["6"]).phones.map((p) => p.display), ["2821-3606", "4918-4879"])
  assert.equal(pageFacts(cesacSupp.pages["21"]).address, "Ulla Ulla 2839")
  const f33 = pageFacts(cesacSupp.pages["33"])
  assert.ok(f33.hours.some((h) => /CEPAD/i.test(h.label)) && f33.hours.some((h) => /vacunatorio/i.test(h.label)), "los horarios de la ficha se guardan como texto, sin interpretarlos")
  assert.equal(pageFacts(cesacSupp.pages["18"]), null, "la ficha del id 18 da 404: no hay hechos")
})

test("pages: phones — complete numbers only, extensions are not part of the number, abbreviations are fragments", () => {
  assert.deepEqual(parsePagePhones(["28213604", "1150481097"]).phones.map((p) => p.dial), ["+541128213604", "+541150481097"])
  const guardia = parsePagePhones(["4611-6666 (int. 2111 y 2948)"], "Guardia")
  assert.deepEqual(guardia.phones.map((p) => p.display), ["4611-6666"])
  assert.deepEqual(guardia.fragments, [])
  const range = parsePagePhones(["4639-8700 al 05"])
  assert.deepEqual(range.phones.map((p) => p.display), ["4639-8700"])
  assert.deepEqual(range.fragments, ["al 05"], "'al 05' (un rango) no se expande")
  assert.deepEqual(parsePagePhones(["5197-5078 / 5079"]).fragments, ["5079"])
  assert.deepEqual(parsePagePhones(["0800-333-0160"]).phones, [], "un 0800 no es un número de CABA de 8 dígitos")
})

test("mapping lookup: a parenthesis that only says who it is for is dropped; anything else is not guessed", () => {
  const table = cesacMapping.fichaTerms
  assert.equal(lookupTerm(table, "Odontología (niñes y adultos)").serviceType, "dentistry")
  assert.equal(lookupTerm(table, "Psicología (adultos)").serviceType, "mental-health-care")
  assert.equal(lookupTerm(table, "Odontología (urgencias)"), undefined)
  assert.equal(lookupTerm(table, "Juegoteca"), undefined)
})

test("addresses: a date or an ordinal in a street name is fine; a corner or a name with other digits is not guessed", () => {
  assert.deepEqual(parseAddressCaba("24 De Noviembre 1679").problems, [])
  assert.equal(parseAddressCaba("24 De Noviembre 1679").street, "24 de Noviembre")
  assert.deepEqual(parseAddressCaba("Humberto 1° 470, Rodrigo Bueno").problems, [])
  assert.deepEqual(parseAddressCaba("Calle 3 Norte 450").problems, ["address-street-has-digits"])
  assert.deepEqual(parseAddressCaba("2 De Abril De 1982 y Montiel, Barrio Piedrabuena").problems, ["address-unparsed"])
})

// ─── The mapping tables (proposal for editorial review) ──────────────────────────────────────────

test("mappings: nothing is approved, every entry is approvable or doubtful, and a doubtful one explains its doubt", () => {
  for (const mapping of [cesacMapping, hospMapping]) {
    assert.equal(mapping.status, "draft")
    assert.equal(mapping.approvedBy, null)
    for (const table of [mapping.specialties, mapping.fichaTerms ?? {}, mapping.facilityTypes]) {
      for (const [name, entry] of Object.entries(table)) {
        assert.equal(entry.approved, false, name)
        assert.ok(["approvable", "doubtful"].includes(entry.proposal), `${name}: proposal`)
        if (entry.proposal === "doubtful") assert.ok(entry.note, `${name}: una entrada dudosa explica la duda`)
      }
    }
  }
  const approvable = Object.entries(cesacMapping.fichaTerms).filter(([, e]) => e.proposal === "approvable")
  assert.ok(approvable.length >= 50)
  assert.ok(approvable.every(([, e]) => e.serviceType), "una equivalencia clara tiene tipo")
  for (const doubtful of ["obstetricia", "farmaceutico", "salud sexual", "trabajo social", "enfermeria", "nutricion", "extracciones de sangre"]) {
    assert.equal(cesacMapping.fichaTerms[doubtful].proposal, "doubtful", doubtful)
  }
  assert.equal(cesacMapping.specialties["Pediatría"].serviceType, "primary-care")
  assert.equal(hospMapping.specialties["Basicas - Criticas - Otras"].serviceType, null, '"Básicas - Críticas - Otras" nunca es una prestación')
})

// ─── Supplements and claims ──────────────────────────────────────────────────────────────────────

test("supplements: the saved pages are what the proposal rests on (47 CeSAC pages, 14 hospital pages, 2 group pages)", () => {
  assert.equal(Object.keys(cesacSupp.pages).length, 47)
  assert.deepEqual(Object.entries(cesacSupp.pages).filter(([, p]) => p.status !== 200).map(([k, p]) => [k, p.status]), [["18", 404]])
  assert.equal(Object.keys(hospSupp.pages).length, 14)
  assert.deepEqual(Object.entries(hospSupp.pages).filter(([, p]) => p.status !== 200).map(([k]) => k), ["hospital-general-de-agudos-cecilia-grierson"])
  assert.deepEqual(Object.keys(hospSupp.shared).sort(), ["guardias-hospitalarias", "hospitales-generales-de-agudos"])
  for (const page of Object.values(hospSupp.shared)) assert.equal(page.status, 200)
  assert.equal(cesacSupp.retrievedAt, "2026-10-07")
})

test("supplements: fetching uses an injectable fetcher, filters the records, and keeps failures as data", async () => {
  const dir = await mkdtemp(join(tmpdir(), "curation-supp-"))
  try {
    const manifest = { ...hospManifest, supplements: { pages: { urlField: "detailUrl", only: { facilityTypeRaw: "Hospital General de Agudos" } }, sharedPages: { grupo: "https://example.test/grupo" } } }
    const calls = []
    const fetcher = async (url) => {
      calls.push(url)
      return url.includes("grupo")
        ? { url, finalUrl: url, status: 200, html: "<html><head><title>Grupo | Buenos Aires Ciudad</title></head><body><h1>Grupo</h1><p>Dirección</p><p>Tabla con más texto</p></body></html>" }
        : { url, finalUrl: url, status: 404, html: "" }
    }
    const file = await fetchSupplements({ manifest, snapshot: hospSnap, retrievedAt: "2026-10-07", dir, fetcher, delayMs: 0 })
    assert.equal(calls.length, 15, "14 hospitales generales + 1 página compartida: los otros 22 no se piden")
    assert.equal(Object.keys(file.pages).length, 14)
    assert.ok(Object.values(file.pages).every((p) => p.status === 404 && !p.lines))
    assert.ok(file.shared.grupo.lines.includes("Tabla con más texto"), "una página de grupo conserva el cuerpo completo, incluso la columna 'Dirección' de su tabla")
    assert.equal(file.license, "CC-BY-2.5-AR")
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("claims: every guardia statement quotes the saved official page word for word, and none is approved", async () => {
  const claims = hospSupp.claims
  assert.equal(claims.claims.length, 28)
  assert.equal(claims.approvedBy, null)
  assert.ok(claims.claims.every((c) => c.approved === false))
  const hga = hospSupp.shared["hospitales-generales-de-agudos"].lines.join(" ")
  const guardias = hospSupp.shared["guardias-hospitalarias"].lines.join(" ")
  assert.match(hga, /los 14 hospitales cuentan con guardia las 24 hs del día los 365 días del año/)
  const emergency = claims.claims.filter((c) => c.service.type === "emergency-room")
  assert.equal(emergency.length, 14)
  assert.ok(emergency.every((c) => c.proposal === "approvable" && c.service.hours.open24h === true && hga.includes(c.evidence.quote)))
  const mental = claims.claims.filter((c) => c.service.type === "mental-health-emergency")
  assert.ok(mental.every((c) => c.proposal === "doubtful" && guardias.includes(c.evidence.quote)))
  assert.equal(mental.find((c) => c.key.endsWith("grierson")).evidence.hasGuardiaEntry, false)
  for (const claim of emergency) {
    assert.equal(claim.service.cost, undefined)
    assert.equal(claim.service.appointment, undefined)
    assert.match(claim.note, /NO dice que sea sin turno, ni gratuita/)
  }
  assert.deepEqual(await checkCuration(), [])
})

test("claims: a statement that isn't on the saved page is refused by curation:check", async () => {
  const dir = await mkdtemp(join(tmpdir(), "curation-claims-"))
  try {
    await cp(join(clientRoot, "curation"), join(dir, "curation"), { recursive: true, filter: (source) => !source.includes(join("curation", "raw")) })
    const paths = Object.fromEntries(Object.entries(PATHS).map(([name, path]) => [name, join(dir, "curation", relative(join(clientRoot, "curation"), path))]))
    const file = join(paths.supplements, "caba-hospitales.claims.json")
    const claims = JSON.parse(await readFile(file, "utf8"))
    claims.claims[0].evidence.quote = "todas las guardias atienden sin turno y gratis"
    claims.claims[1].approved = true
    claims.claims[2].service.type = "teletransportacion"
    await writeFile(file, JSON.stringify(claims))
    const errors = await checkCuration({ paths })
    assert.ok(errors.some((e) => e.includes("la cita no está en la página oficial guardada")))
    assert.ok(errors.some((e) => e.includes("approvedBy")))
    assert.ok(errors.some((e) => e.includes("teletransportacion")))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("claims: a service from a group statement carries its own source and the hours its page states — nothing else", () => {
  const [service] = claimServices(generales[0].key, hospSupp.claims).filter((s) => s.type === "emergency-room")
  assert.equal(service.id, "guardia")
  assert.equal(service.approved, false)
  assert.deepEqual(service.hours, { open24h: true, note: "Todos los días del año." })
  assert.equal(service.source.organization, "Gobierno de la Ciudad de Buenos Aires")
  assert.equal(service.source.retrievedAt, "2026-10-07")
  assert.deepEqual(claimServices("no-existe", hospSupp.claims), [])
  assert.deepEqual(claimServices("x", null), [])
})

// ─── Address and phone policies ──────────────────────────────────────────────────────────────────

test("address: the official page confirms, refines or contradicts the dataset — and only the first is automatic", () => {
  const record = (raw) => ({ address: { raw, ...parseAddressCaba(raw) } })
  const facts = (address) => ({ address })
  const a = resolveAddress(record("Piedra Buena Av. 3140"), facts("Av. Piedrabuena 3140"))
  assert.equal(a.address.resolvedBy, "page")
  assert.equal(a.address.street, "Av. Piedrabuena")
  assert.ok(a.gates.some((g) => g.code === "address-confirmed-by-page"))
  assert.equal(resolveAddress(record("Alcorta, Amancio Av. 1402"), facts("Amancio Alcorta 1402")).address.street, "Amancio Alcorta")
  const b = resolveAddress(record("Terrada 5850, Barrio Albarellos"), facts("Terrada 5860"))
  assert.equal(b.address.resolvedBy, "dataset")
  assert.ok(b.gates.some((g) => g.level === "warn" && g.code === "address-conflict"))
  const c = resolveAddress(record("Alberdi, Juan Bautista Av. y Pilar"), facts("Av. J. B Alberdi 6300"))
  assert.ok(c.gates.some((g) => g.code === "address-from-page-only"), "una esquina del dataset no se 'confirma': la página la precisa y una persona lo reconoce")
  assert.ok(resolveAddress(record("Casco, Horacio, Dr. 4446"), facts("Saravia 2486")).gates.some((g) => g.code === "address-conflict"))
  assert.ok(resolveAddress(record("Brin, Ministro 843"), facts("esquina de Brin")).gates.some((g) => g.code === "address-street-inverted"))
  assert.ok(resolveAddress(record("Brin, Ministro 843"), null).gates.some((g) => g.code === "address-street-inverted"))
  assert.ok(BLOCKING_WARNINGS.has("address-conflict") && !BLOCKING_WARNINGS.has("address-from-page-only"))
})

test("phones: the page's numbers are the ones published; the dataset's extra ones are reported; two sources that disagree block", () => {
  const dataset = (...numbers) => ({ phones: numbers.map((n) => ({ dial: `+5411${n.replace("-", "")}`, display: n })), phoneFragments: [] })
  const page = (...numbers) => ({ phones: numbers.map((n) => ({ dial: `+5411${n.replace("-", "")}`, display: n, label: "Principal" })), phoneFragments: [] })
  const agree = mergePhones(dataset("2821-3601", "4302-0059"), page("2821-3601"))
  assert.deepEqual(agree.phones.map((p) => p.display), ["2821-3601"])
  assert.ok(agree.gates.some((g) => g.level === "info" && g.code === "phones-dataset-only"))
  assert.ok(mergePhones(dataset("1111-2222"), page("3333-4444")).gates.some((g) => g.level === "warn" && g.code === "phone-conflict"))
  assert.ok(mergePhones(dataset("4521-3600", "4521-6666"), page("5243-9000", "4521-6666")).gates.some((g) => g.code === "phone-differs"))
  assert.ok(BLOCKING_WARNINGS.has("phone-differs") && BLOCKING_WARNINGS.has("phone-conflict"))
  assert.equal(mergePhones(dataset("2821-3601"), null).phones.length, 1, "sin página se usa el dataset")
  assert.ok(mergePhones({ phones: [], phoneFragments: ["5005"] }, null).gates.some((g) => g.level === "warn" && g.code === "phone-fragment"))
  assert.ok(mergePhones({ ...dataset("2821-3601"), phoneFragments: ["5005"] }, null).gates.some((g) => g.level === "info" && g.code === "phone-fragments-not-published"))
})

// ─── The batch ───────────────────────────────────────────────────────────────────────────────────

test("CeSAC batch: 47 new rows, 35 proposed, 12 for a person; the list cut by the publisher is completed by the page, never presented as complete", () => {
  const news = fresh(allCesac)
  assert.equal(news.length, 47)
  assert.equal(allCesac.filter((c) => c.link.status === "linked").length, 3)
  const ready = news.filter((c) => c.proposed.ready)
  assert.equal(ready.length, 35)
  assert.ok(ready.every((c) => !c.gates.some((g) => g.level === "warn" && BLOCKING_WARNINGS.has(g.code))))
  assert.ok(ready.every((c) => c.tier !== "T3" && c.proposed.services.length > 0 && c.proposed.facilityType === "health-center"))
  // Exactly the ones whose sources disagree, whose address is not a street and a number, or that have no page and nothing clear to publish
  const manual = news.filter((c) => !c.proposed.ready).map((c) => c.key).sort((a, b) => a - b)
  assert.deepEqual(manual, ["2", "7", "8", "14", "18", "20", "30", "35", "44", "91", "92", "93"])
  const truncatedWithPage = news.find((c) => c.key === "1")
  assert.equal(truncatedWithPage.record.specialtiesTruncated, true)
  assert.ok(truncatedWithPage.gates.some((g) => g.code === "specialties-truncated-completed-by-page"))
  assert.ok(truncatedWithPage.proposed.ready && truncatedWithPage.proposed.services.includes("vaccination"))
  const truncatedWithoutPage = news.find((c) => c.key === "18")
  assert.ok(truncatedWithoutPage.gates.some((g) => g.level === "warn" && g.code === "specialties-truncated"))
  assert.equal(truncatedWithoutPage.proposed.ready, false)
  for (const key of ["91", "92", "93"]) assert.equal(news.find((c) => c.key === key).proposed.ready, false)
  assert.ok(allCesac.every((c) => c.publishable.ready === false && c.proposal === null), "nada es publicable hoy: ninguna entrada del mapeo está aprobada")
})

test("hospital batch: the 10 of the 14 Generales de Agudos whose sources agree; the other 4 go to a person with the reason", () => {
  assert.equal(generales.length, 14)
  const ready = generales.filter((c) => c.proposed.ready)
  assert.equal(ready.length, 10)
  for (const c of ready) {
    assert.deepEqual(c.proposed.services, ["emergency-room"], "solo la guardia que afirma la página oficial")
    assert.equal(c.resolved.address.resolvedBy, "page")
    const service = c.proposalIfApproved.services[0]
    assert.deepEqual(service.hours, { open24h: true, note: "Todos los días del año." })
    assert.match(service.source.note, /los 365 días del año/)
    assert.equal(service.source.license, "CC-BY-2.5-AR")
    for (const forbidden of ["cost", "appointment", "requirements", "audience", "description"]) assert.equal(service[forbidden], undefined, forbidden)
    assert.equal(c.proposalIfApproved.hours, undefined)
  }
  const reasons = Object.fromEntries(generales.filter((c) => !c.proposed.ready).map((c) => [c.key.replace("hospital-general-de-agudos-", ""), c.proposed.reasons]))
  assert.deepEqual(Object.keys(reasons).sort(), ["cecilia-grierson", "d-velez-sarsfield", "dr-c-argerich", "dr-e-tornu"])
  assert.ok(reasons["dr-c-argerich"].includes("address-list-differs"), "la página-lista dice 'Almirante Brown 240' y las otras 'Pi y Margall 750'")
  assert.ok(reasons["dr-e-tornu"].includes("phone-differs") && reasons["dr-e-tornu"].includes("address-list-differs"))
  assert.ok(reasons["d-velez-sarsfield"].includes("address-conflict"))
  assert.ok(reasons["cecilia-grierson"].includes("address-street-inverted"))
  assert.ok(generales.every((c) => !c.proposed.services.includes("mental-health-emergency")), "la guardia de salud mental es dudosa: no se propone")
  assert.ok(generales.every((c) => c.services.proposed.some((s) => s.type === "mental-health-emergency" && s.proposal === "doubtful")))
  const others = allHosp.filter((c) => c.record.facilityTypeRaw !== "Hospital General de Agudos")
  assert.equal(others.length, 22)
  assert.ok(others.every((c) => c.proposed.ready === false), "nada se infiere del tipo de hospital ni de su única 'especialidad'")
  assert.ok(allHosp.every((c) => c.publishable.ready === false))
  assert.ok(!allHosp.some((c) => c.services.proposed.some((s) => /Basicas/.test((s.terms ?? []).join()))))
})

test("proposal: the numbers of the batch, and its decisions cannot be applied by accident", async () => {
  const proposal = buildProposal({ candidates: [...allCesac, ...allHosp], batch, taxonomy, manifests: [cesacManifest, hospManifest] })
  assert.equal(proposal.stats.cesac.proposed, 35)
  assert.equal(proposal.stats.cesac.manual, 12)
  assert.equal(proposal.stats.cesac.published, 3)
  assert.equal(proposal.stats.generales.proposed, 10)
  assert.equal(proposal.stats.generales.manual, 4)
  assert.equal(proposal.stats.otherHospitals.proposed, 0)
  assert.equal(proposal.stats.generales.services["emergency-room"], 10)
  assert.match(proposal.markdown, /NO publicado/)
  assert.match(proposal.markdown, /sin turno ni gratuita: no se afirma/)
  assert.equal(proposal.decisions.decisions.length, 45)
  assert.ok(proposal.decisions.decisions.every((d) => d.action === "accept" && d.reviewer === null && d.decidedAt === null && d.rowHash))
  const result = plan({ decisions: proposal.decisions.decisions, candidates: [...allCesac, ...allHosp] })
  assert.equal(result.applied.length, 0)
  assert.equal(result.errors.filter((e) => e.includes('falta "reviewer"')).length, 45)
  assert.equal(Object.values(proposal.stats.coverage).reduce((sum, c) => sum + c.proposed, 0), 45)
})

test("proposal: the mapping review lists every term of the pages with its state", () => {
  const md = mappingReview({ mapping: cesacMapping, pages: cesacSupp.pages, snapshot: cesacSnap, taxonomy })
  assert.match(md, /Nada está aprobado/)
  assert.match(md, /APROBABLE/)
  assert.match(md, /DUDOSO/)
  assert.match(md, /sin propuesta/)
  assert.match(md, /Términos distintos en las 47 páginas oficiales/)
  assert.match(md, /Pediatría.*APROBABLE.*Atención primaria/)
})

test("BATCH VALIDITY: if the clear equivalences were approved, the whole proposed batch (45 places) would pass the real validator", () => {
  const approve = (mapping) => ({
    ...mapping,
    facilityTypes: Object.fromEntries(Object.entries(mapping.facilityTypes).map(([name, e]) => [name, { ...e, approved: e.proposal === "approvable" }])),
    specialties: Object.fromEntries(Object.entries(mapping.specialties).map(([name, e]) => [name, { ...e, approved: e.proposal === "approvable" }])),
    ...(mapping.fichaTerms ? { fichaTerms: Object.fromEntries(Object.entries(mapping.fichaTerms).map(([name, e]) => [name, { ...e, approved: e.proposal === "approvable" }])) } : {}),
  })
  const approvedClaims = { ...hospSupp.claims, claims: hospSupp.claims.claims.map((c) => ({ ...c, approved: c.proposal === "approvable" })) }
  const cesac = buildCandidates({ manifest: cesacManifest, snapshot: cesacSnap, mapping: approve(cesacMapping), published, supplements: cesacSupp }).candidates
  const hosp = buildCandidates({ manifest: hospManifest, snapshot: hospSnap, mapping: approve(hospMapping), published, supplements: { ...hospSupp, claims: approvedClaims } }).candidates
  const candidates = [...cesac, ...hosp]
  const decisions = candidates
    .filter((c) => c.link.status === "new" && c.proposed.ready)
    .map((c) => ({ ...base, source: c.source, key: c.key, action: "accept", batch: batch.id, rowHash: c.record.rowHash, acknowledged: c.gates.filter((g) => g.level === "warn").map((g) => g.code) }))
  assert.equal(decisions.length, 45, "the Hospital Garrahan (loaded by hand) is not part of the proposed batch: its facility type is not approved")
  const result = plan({ decisions, candidates })
  assert.deepEqual(result.errors, [])
  assert.equal(result.data.resources.length, 54)
  assert.deepEqual(result.data.resources.slice(0, 9), published, "los 9 lugares curados (6 del primer lote, el centro veterinario, el Hospital Garrahan y el Elizalde) no cambian")
  const added = result.data.resources.slice(9)
  assert.equal(new Set(added.map((r) => r.id)).size, 45)
  for (const place of added) {
    for (const forbidden of ["hours", "cost", "costNote", "requirements", "audience", "appointment", "coverage", "description"]) assert.equal(place[forbidden], undefined, `${place.id}: ${forbidden}`)
    assert.equal(place.verification.nextReviewDue, "2027-01-05")
    assert.equal(place.verification.verifiedBy, "equipo-auxiliar")
    assert.equal(place.source.license, "CC-BY-2.5-AR")
    assert.equal(place.source.retrievedAt, "2026-10-07")
    assert.equal(place.coordinates.status, "verified")
    assert.equal(Object.keys(place.externalIds).length, 1)
    for (const service of place.services) {
      assert.equal(service.cost, undefined)
      assert.equal(service.appointment, undefined)
      if (service.type === "emergency-room") {
        assert.deepEqual(service.hours, { open24h: true, note: "Todos los días del año." })
        assert.ok(service.source.url.includes("hospitales-generales-de-agudos"))
        assert.equal(service.verification.status, "verified")
        assert.match(service.verification.notes, /solo lo que la cita dice/)
      } else assert.equal(service.hours, null)
    }
  }
  const hospitals = added.filter((r) => r.facilityType === "hospital")
  assert.equal(hospitals.length, 10)
  assert.ok(hospitals.every((h) => h.coordinates.method === "official-dataset-reprojected" && h.services.length === 1))
  const centers = added.filter((r) => r.facilityType === "health-center")
  assert.equal(centers.length, 35)
  assert.ok(centers.every((r) => r.coordinates.method === "official-dataset"))
})

// ─── What is already applied: Santa Lucía, Carrillo, Dueñas ───────────────────────────────────────

test("coordinates of Santa Lucía, Carrillo and Dueñas: official, reprojected by the pipeline, equal to the candidate, near the USIG control", async () => {
  const control = await readJson(join(FIXTURES, "hospital-control-points.json"))
  const expected = {
    "hospital-oftalmologico-santa-lucia": "hospital-especializado-de-oftalmologia-santa-lucia",
    "hospital-odontologia-carrillo": "hospital-especializado-odontologico-dr-r-carrillo-ex-nacional",
    "hospital-odontologia-duenas": "hospital-especializado-de-odontologia-j-duenas",
  }
  for (const [id, key] of Object.entries(expected)) {
    const place = published.find((r) => r.id === id)
    const record = hospSnap.records.find((r) => r.key === key)
    assert.equal(place.coordinates.method, "official-dataset-reprojected", id)
    assert.equal(place.coordinates.status, "verified")
    assert.equal(place.coordinates.precision, "approximate")
    assert.equal(place.coordinates.lat, record.coordinates.lat)
    assert.equal(place.coordinates.lng, record.coordinates.lng)
    assert.equal(place.coordinates.verifiedAt, "2026-10-07")
    assert.match(place.coordinates.note, /Reproyectado de EPSG:9498 a WGS84 con proj4@/)
    const point = control.points.find((p) => p.key === key)
    assert.ok(distanceMeters(place.coordinates, point.usig) <= control.toleranceMeters, id)
  }
  const result = await runPublish({ province: "AR-C" })
  assert.deepEqual(result.errors, [])
  assert.equal(result.changed, false, "todo lo decidido ya está aplicado")
  const decisions = (await readJson(join(PATHS.decisions, "ar-c.decisions.json"))).decisions
  assert.deepEqual(decisions.map((d) => d.action), ["link", "link", "link", "link", "link", "link", "apply", "apply", "apply", "apply", "apply", "apply", "apply", "apply", "apply", "link", "link", ...Array(58).fill("link")])
  // three coordinates (the hospitals) and six divisions: each one tied to its row, its batch and a reviewer
  const applies = decisions.filter((d) => d.action === "apply")
  assert.ok(applies.every((d) => d.fields.length === 1 && d.batch === "caba-2" && d.rowHash && d.reviewer && d.decidedAt && d.reason))
  assert.equal(applies.filter((d) => d.fields[0] === "coordinates").length, 3)
  assert.equal(applies.filter((d) => d.fields[0] === "address.department").length, 6)
})

test("the hand-curated places keep everything but what the decisions applied; Santa Lucía reads in plain language", () => {
  const santaLucia = published.find((r) => r.id === "hospital-oftalmologico-santa-lucia")
  assert.equal(santaLucia.services[0].description, "Atención de urgencias de los ojos para adultos y niños, sin necesidad de turno.")
  assert.equal(santaLucia.services[0].appointment.mode, "not-required", "la frase 'sin necesidad de turno' la respalda el dato estructurado de la fuente oficial")
  assert.equal(santaLucia.services[0].hours.open24h, true)
  assert.equal(published.length, 9, "ningún lugar nuevo salió del pipeline: el séptimo es el centro veterinario, el octavo el Hospital Garrahan y el noveno el Elizalde, cargados a mano")
  for (const place of published) assert.equal(place.verification.status, "verified")
})

test("descriptions of published services are in plain language (so SHOW_SERVICE_DESCRIPTIONS can be turned on)", () => {
  const jargon = /demanda espont|patolog|ambulatori|nosocomi|dispositivo|efector|complejidad|abordaje|interconsulta|internaci/i
  const described = published.flatMap((r) => (r.services ?? []).filter((s) => s.description).map((s) => [`${r.id}/${s.id}`, s.description]))
  assert.ok(described.length >= 1)
  for (const [where, text] of described) {
    assert.doesNotMatch(text, jargon, where)
    assert.ok(text.length <= 140, `${where}: una descripción es una frase corta`)
    assert.match(text, /[.]$/, where)
  }
  assert.ok(published.every((r) => !r.description || !jargon.test(r.description)))
})

test("batch caba-2: review in 90 days, and the proposed decisions live in proposals/, where publish does not read them", async () => {
  assert.deepEqual(validateBatch(batch), [])
  const days = (Date.parse(`${batch.nextReviewDue}T00:00:00Z`) - Date.parse(`${batch.verifiedAt}T00:00:00Z`)) / 86400000
  assert.equal(days, 90)
  const proposed = await readJson(join(clientRoot, "curation/proposals/caba-2.decisions.proposed.json"))
  assert.equal(proposed.decisions.length, 3)
  assert.ok(proposed.decisions.every((d) => d.reviewer === null && d.decidedAt === null))
  const real = (await readJson(join(PATHS.decisions, "ar-c.decisions.json"))).decisions
  assert.ok(real.every((d) => d.action !== "accept"), "ninguna decisión de alta está en decisions/: no se publicó nada nuevo")
})
