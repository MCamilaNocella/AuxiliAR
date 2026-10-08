import { dialKey, getHelpLine, lineContact } from "@/data/resources"
import type { Contact, Resource } from "@/data/resources"

/*
 * A help line told in words, only from what the dataset records (data/resources/lines/nacional.json): where it works,
 * when it answers and whether it is free. Nothing is added here, so the screens cannot say more than the sources do.
 */

export type HelpLineView = {
  /** As it is written and dialed */
  display: string
  dial: string
  name: string
  /** Where it works: the contact's own note, or "todo el país" for a national line, or the line's note */
  where?: string
  /** When it answers, if the source says: never filled in */
  hours?: string
  /** Only when the source says it is free: its own words if it has them, else "Es gratis." */
  cost?: string
}

const whereOf = (line: Resource, contact: Contact) => {
  // A number listed once per jurisdiction (the 107): what is said about each place is in the contacts, what is said about the number is the line's
  const listedByJurisdiction = (line.contacts ?? []).filter((entry) => dialKey(entry.dial) === dialKey(contact.dial)).length > 1
  if (listedByJurisdiction) return line.coverage?.note
  if (contact.scope?.note) return contact.scope.note
  const scope = contact.scope ?? line.coverage
  if (scope?.level === "national") return "Funciona en todo el país"
  return line.coverage?.note
}

const hoursOf = (line: Resource, contact: Contact) => {
  const hours = contact.hours ?? line.hours
  if (!hours) return undefined
  return hours.note ?? (hours.open24h ? "Atiende las 24 horas" : undefined)
}

const viewOf = (line: Resource, contact: Contact): HelpLineView => {
  return { display: contact.display, dial: contact.dial, name: line.name, where: whereOf(line, contact), hours: hoursOf(line, contact), cost: line.cost === "free" ? (line.costNote ?? "Es gratis.") : undefined }
}

/** The line `id` as its first contact: the number people dial */
export const describeHelpLine = (id: string): HelpLineView => {
  const line = getHelpLine(id)
  return viewOf(line, lineContact(line))
}

/** Every contact of the line `id`, in the order of the dataset (for a line with a number per zone, like the suicide prevention one) */
export const describeHelpContacts = (id: string): HelpLineView[] => {
  const line = getHelpLine(id)
  return (line.contacts ?? []).map((contact) => viewOf(line, contact))
}

/** The `tel:` link of a contact: digits only, as the dataset dials it */
export const telHref = (dial: string) => `tel:${dialKey(dial)}`
