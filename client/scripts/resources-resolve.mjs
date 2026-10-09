/*
 * Resolution of an establishment's services (client/src/data/resources).
 *
 * A service says only what is its own; the rest it inherits from its establishment. The server copy is written
 * already resolved (so the server has no inheritance logic) and with the categories derived from each service's
 * type. client/src/data/resources/index.ts has the same functions for the app: a test keeps both in step.
 *
 * Inheritance, per service:
 *   hours         own, if the key is there (null = "not known", it does not inherit); else the establishment's, else null
 *   cost          own, else the establishment's, else "unknown" (never assumed free)
 *   costNote, requirements, audience   own, else the establishment's
 *   appointment   own, else { mode: "unknown" }
 *   contacts      own only (the establishment's contacts are shown beside them)
 *   source, verification   own, else the establishment's
 *   evidence      own only (a list; [] if none). It is for the app: the server copy leaves it out (see resources-sync.mjs)
 *   categories    derived from the type, through taxonomy.serviceTypes (never written by hand)
 */

/** The categories a service type belongs to */
export const categoriesOfServiceType = (type, taxonomy) => [...(taxonomy.serviceTypes.find((entry) => entry.id === type)?.categories ?? [])]

export const resolveService = (resource, service, taxonomy) => ({
  id: service.id,
  type: service.type,
  name: service.name,
  description: service.description,
  hours: Object.hasOwn(service, "hours") ? service.hours : (resource.hours ?? null),
  cost: service.cost ?? resource.cost ?? "unknown",
  costNote: service.costNote ?? resource.costNote,
  requirements: service.requirements ?? resource.requirements ?? [],
  audience: service.audience ?? resource.audience ?? [],
  appointment: service.appointment ?? { mode: "unknown" },
  contacts: service.contacts ?? [],
  source: service.source ?? resource.source,
  evidence: service.evidence ?? [],
  verification: service.verification ?? resource.verification,
  categories: categoriesOfServiceType(service.type, taxonomy),
})

/** Sorted, without repeats: what an establishment shows up under, from what it offers */
export const derivedCategories = (resource, taxonomy) =>
  [...new Set((resource.services ?? []).flatMap((service) => categoriesOfServiceType(service.type, taxonomy)))].sort()

/** The resource as the server gets it: services resolved and `derivedCategories` added (not for resources without services) */
export const resolveResource = (resource, taxonomy) => {
  if (!resource.services || resource.services.length === 0) return resource
  return {
    ...resource,
    services: resource.services.map((service) => resolveService(resource, service, taxonomy)),
    derivedCategories: derivedCategories(resource, taxonomy),
  }
}
