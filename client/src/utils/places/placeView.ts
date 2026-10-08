import type { Contact } from "@/data/resources"
import { appointmentLabel, audienceLabel, costLabel, describeHours, facilityTypeLabel, isVerifiedFree, serviceHighlights, serviceName } from "./format"
import type { PlaceEntry } from "./filters"
import { normalizeText } from "./text"

/*
 * What the place's panel shows, decided from the verified data of the services in scope. Principles: useful before
 * complete (a field with nothing to say is left out, never written as "not informed"), and what every service has in
 * common is said once instead of on each one.
 */

export type DetailItem =
  | { kind: "text", label?: string, text: string }
  | { kind: "hours", label: string, lines: { days: string, times: string }[], note?: string }
  | { kind: "list", label: string, items: string[] }
  | { kind: "link", label: string, text: string, url: string }

export type ServiceView = {
  id: string
  name: string
  /** Highlights of this service that aren't already said for the whole place */
  chips: string[]
  /** Specific information that is useful (hours, how it is attended, conditions…); empty for most services */
  details: DetailItem[]
}

export type PlaceView = {
  facilityType?: string
  /** What every service shown has: 24 h, demanda espontánea, atención gratuita */
  highlights: string[]
  services: ServiceView[]
  /** "Cómo atenderte": general hours and the way of being attended that every service shares */
  howTo: DetailItem[]
  /** "Antes de ir": requirements that every service shares */
  beforeGoing: string[]
  /** The place's contacts and those of its services (labelled with the service when they have no label) */
  contacts: Contact[]
  /** When no service has a known cost: one line for all of them, instead of repeating it on each */
  costNotice?: string
  /** What is missing about when to go - the hours and/or how to be attended - said plainly, so the person calls first. None when both are verified */
  availabilityNotice?: string
}

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

const hoursItem = (label: string, hours: Parameters<typeof describeHours>[0]): DetailItem | undefined => {
  const view = describeHours(hours)
  if (view.kind === "unknown") return undefined
  if (view.kind === "open24h") return view.note ? { kind: "text", label, text: view.note } : undefined
  return { kind: "hours", label, lines: view.lines, note: view.note }
}

const appointmentItems = ({ mode, howTo, url }: { mode: Parameters<typeof appointmentLabel>[0]["mode"], howTo?: string, url?: string }): DetailItem[] => {
  const items: DetailItem[] = []
  // "Sin turno" is already a highlight
  const label = mode === "not-required" ? undefined : appointmentLabel({ mode })
  if (label) items.push({ kind: "text", text: label })
  if (howTo) items.push({ kind: "text", text: howTo })
  if (url) items.push({ kind: "link", label: "Turnos", text: "Pedir turno", url })
  return items
}

/** The type of establishment, unless the name already says it ("Hospital Oftalmológico…" needs no "Hospital" under it) */
const facilityLabelFor = (name: string, type: string | undefined) => {
  const label = facilityTypeLabel(type)
  return label && !normalizeText(name).includes(normalizeText(label)) ? label : undefined
}

/**
 * The free text a service carries in the dataset (`description`) is not shown yet: today it is written in clinical
 * words ("demanda espontánea", "patología oftalmológica clínica y quirúrgica de urgencia"). The panel already says the
 * same with structured data in everyday words (highlights, hours, who it is for). Turn it on once the dataset's
 * descriptions are rewritten in plain language.
 */
const SHOW_SERVICE_DESCRIPTIONS = false

export const buildPlaceView = ({ place, services }: PlaceEntry): PlaceView => {
  // A cost is known when the data states it for that service: verified free, or paid / mixed. Anything else is "not informed"
  const costKnown = services.map((service) => isVerifiedFree(place, service) || service.cost === "paid" || service.cost === "mixed")
  const someCostKnown = costKnown.some(Boolean)
  const chipsByService = services.map((service, index) => [...serviceHighlights(service, place), ...(someCostKnown && !costKnown[index] ? ["Costo no informado"] : [])])
  const highlights = (chipsByService[0] ?? []).filter((chip) => chipsByService.every((chips) => chips.includes(chip)))

  const allSame = (pick: (service: PlaceEntry["services"][number]) => unknown) => services.length > 0 && services.every((service) => sameValue(pick(service), pick(services[0])))
  const commonRequirements = allSame((service) => service.requirements) ? services[0].requirements : []
  const commonAppointment = allSame((service) => service.appointment) ? appointmentItems(services[0].appointment) : []

  const howTo: DetailItem[] = []
  const general = hoursItem("Horario general", place.hours)
  if (general) howTo.push(general)
  howTo.push(...commonAppointment)

  const placeSourceUrl = place.source?.url
  const serviceViews = services.map((service, index): ServiceView => {
    const details: DetailItem[] = []
    if (SHOW_SERVICE_DESCRIPTIONS && service.description) details.push({ kind: "text", text: service.description })
    // Hours inherited from the place are the general hours, already said
    if (service.hours && !sameValue(service.hours, place.hours)) {
      const item = hoursItem("Horario", service.hours)
      if (item) details.push(item)
    }
    if (commonAppointment.length === 0) details.push(...appointmentItems(service.appointment))
    if (isVerifiedFree(place, service) && service.costNote) details.push({ kind: "text", text: `${costLabel("free")}. ${service.costNote}` })
    else if (service.cost === "paid" || service.cost === "mixed") {
      details.push({ kind: "text", text: [costLabel(service.cost), service.costNote].filter(Boolean).join(". ") })
    }
    if (service.audience.length > 0) details.push({ kind: "text", label: "Para", text: service.audience.map(audienceLabel).join(", ") })
    if (commonRequirements.length === 0 && service.requirements.length > 0) {
      details.push({ kind: "list", label: "Qué llevar o tener en cuenta", items: service.requirements })
    }
    // Its own source only backs something that is shown: on its own it would be noise
    if (details.length > 0 && service.source?.url && service.source.url !== placeSourceUrl) {
      details.push({ kind: "link", label: "Fuente", text: service.source.organization, url: service.source.url })
    }
    return { id: service.id, name: serviceName(service), chips: chipsByService[index].filter((chip) => !highlights.includes(chip)), details }
  })

  const seen = new Set<string>()
  const contacts: Contact[] = []
  const add = (contact: Contact) => {
    const key = contact.dial.replace(/\D/g, "")
    if (seen.has(key)) return
    seen.add(key)
    contacts.push(contact)
  }
  for (const contact of place.contacts ?? []) add(contact)
  for (const service of services) for (const contact of service.contacts) add({ ...contact, label: contact.label ?? serviceName(service) })

  // When to go: hours and appointments are only said when verified. If either is missing, the person is told, not left to guess
  const hoursKnown = describeHours(place.hours).kind !== "unknown" || services.some((service) => describeHours(service.hours).kind !== "unknown")
  const appointmentKnown = services.some(({ appointment }) => appointment.mode !== "unknown" || Boolean(appointment.howTo) || Boolean(appointment.url))
  const availabilityNotice =
    services.length === 0 || (hoursKnown && appointmentKnown)
      ? undefined
      : !hoursKnown && !appointmentKnown
        ? "Todavía no tenemos horarios ni información de turnos verificados: llamá antes de ir."
        : !hoursKnown
          ? "Todavía no tenemos el horario verificado: llamá antes de ir."
          : "Todavía no tenemos información verificada sobre turnos: consultá antes de ir."
  const costNotice = services.length > 0 && !someCostKnown ? "La fuente no informa el costo de estas prestaciones: consultalo antes de ir." : undefined
  return { facilityType: facilityLabelFor(place.name, place.facilityType), highlights, services: serviceViews, howTo, beforeGoing: commonRequirements, contacts, costNotice, availabilityNotice }
}
