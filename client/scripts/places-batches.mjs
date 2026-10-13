/*
 * The places and services loaded on 12 and 13/10/2026 from four reports, each with its own test:
 *  - sexual health of the Ciudad (consejería, acceso a métodos anticonceptivos y bocas de preservativos): places-sexual.test.mjs
 *  - the vaccination points of the page «Lugares y horarios de vacunatorios»: places-vaccination.test.mjs
 *  - mental health and wellbeing (guardias, Estaciones Saludables, yoga, red municipal, La Rioja, Crespo, Salta, Rosario): places-mental.test.mjs
 *  - the free public veterinary centres (13/10/2026): places-veterinary.test.mjs
 * The older tests of the real data are about the places loaded before them, so they look at the data without those batches: the places that only
 * have services of a batch leave, and the places that also have them (CeSAC 3, CeSAC 41, Elizalde, the hospitals…) keep the rest.
 */
export const SEXUAL_SERVICE_IDS = new Set(["consejeria-salud-sexual", "metodos-anticonceptivos", "preservativos"])
const BATCH_DAY = "2026-10-12"

/** A service of the sexual health batch: one of its ids, verified on the day of the batch (CeSAC 47 already had an unconfirmed "preservativos" of its own) */
export const isSexualBatchService = (service) => SEXUAL_SERVICE_IDS.has(service.id) && service.verification?.verifiedAt === BATCH_DAY

/** A vaccination service of the batch of the page of vacunatorios (CeSAC 3, 41 and 47 had their own before it) */
export const isVaccinationBatchService = (service) => service.id === "vacunacion" && service.verification?.verifiedAt === BATCH_DAY

/** A mental health or wellbeing service of the batch of the report of 12/10/2026 */
export const isMentalBatchService = (service) => ["mental-health-emergency", "wellbeing-activity", "mental-health-care"].includes(service.type) && service.verification?.verifiedAt === BATCH_DAY

export const isBatchService = (service) => isSexualBatchService(service) || isVaccinationBatchService(service) || isMentalBatchService(service)

/** The places of the batch of free veterinary centres (13/10/2026) */
export const isVeterinaryBatchPlace = (place) => place.verification?.verifiedAt === "2026-10-13"

export const withoutBatches = (resources) =>
  resources
    .filter((place) => !isVeterinaryBatchPlace(place))
    .filter((place) => !(place.services ?? []).every(isBatchService))
    .map((place) => ({ ...place, services: place.services.filter((service) => !isBatchService(service)) }))
