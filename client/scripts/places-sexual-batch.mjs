/*
 * The places of the batch of sexual health (12/10/2026: consejería, acceso a métodos anticonceptivos y bocas de preservativos de la Ciudad)
 * are tested in places-sexual.test.mjs. The older tests of the real data are about the places loaded before it, so they look at the data
 * without that batch: the places that only have those services leave, and the places that also have them (CeSAC 3, CeSAC 41, Elizalde) keep the rest.
 */
export const SEXUAL_SERVICE_IDS = new Set(["consejeria-salud-sexual", "metodos-anticonceptivos", "preservativos"])

/** A service of the batch: one of its ids, verified on the day of the batch (CeSAC 47 already had an unconfirmed "preservativos" of its own) */
export const isBatchService = (service) => SEXUAL_SERVICE_IDS.has(service.id) && service.verification?.verifiedAt === "2026-10-12"

export const withoutSexualBatch = (resources) =>
  resources
    .filter((place) => !(place.services ?? []).every(isBatchService))
    .map((place) => ({ ...place, services: place.services.filter((service) => !isBatchService(service)) }))
