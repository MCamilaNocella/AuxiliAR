import { RESOURCES, dialKey, getHelpLine, lineContact, todayInArgentina } from "@/data/resources/lines"
import type { Contact, Resource } from "@/data/resources"

/*
 * A help line told in words, only from what the dataset records (data/resources/lines/nacional.json): where it works,
 * when it answers, whether it is free and whether its verification is still within its review date. Nothing is added here,
 * so the screens cannot say more than the sources do.
 */

/** A line whose review date has arrived: it keeps showing (a number a person may need must not vanish) but it is not presented as checked */
export const isStale = (line: Resource, day: string = todayInArgentina()) => {
  const due = line.verification.nextReviewDue
  return !due || day >= due
}

export type HelpLineView = {
  /** As it is written and dialed */
  display: string
  dial: string
  name: string
  /** Where it works: the contact's own note, or "todo el país" for a national line, or the line's note */
  where?: string
  /** When it answers, if the source says: never filled in */
  hours?: string
  /** Only when it is said to be free: the source's own words if it has them, else "Es gratis." */
  cost?: string
  /** Its review date has arrived: nobody has checked it again since `verifiedAt` */
  stale: boolean
  verifiedAt?: string
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

const viewOf = (line: Resource, contact: Contact, day: string): HelpLineView => ({
  display: contact.display,
  dial: contact.dial,
  name: line.name,
  where: whereOf(line, contact),
  hours: hoursOf(line, contact),
  cost: line.cost === "free" ? (line.costNote ?? "Es gratis.") : undefined,
  stale: isStale(line, day),
  verifiedAt: line.verification.verifiedAt ?? undefined,
})

/** The line `id` as its first contact: the number people dial */
export const describeHelpLine = (id: string, day: string = todayInArgentina()): HelpLineView => {
  const line = getHelpLine(id)
  return viewOf(line, lineContact(line), day)
}

/** Every contact of the line `id`, in the order of the dataset (for a line with a number per zone, like the suicide prevention one) */
export const describeHelpContacts = (id: string, day: string = todayInArgentina()): HelpLineView[] => {
  const line = getHelpLine(id)
  return (line.contacts ?? []).map((contact) => viewOf(line, contact, day))
}

/** The `tel:` link of a contact: digits only, as the dataset dials it */
export const telHref = (dial: string) => `tel:${dialKey(dial)}`

/* ── Call buttons (the emergency bar and the chat) ── */

export type CallButton = {
  number: string
  dial: string
  /** What the button says: the line's short name */
  label: string
  /** Where it works, if it is not everywhere ("según localidad", "CABA y GBA"): said on the button, never left to the person to guess */
  scope?: string
  /** When it answers, only if it is not all day and the source says it ("8:00 a 0:00") */
  hours?: string
  /** The review date of the line has arrived */
  stale: boolean
  verifiedAt?: string
}

const SCOPE_SEPARATOR = " · "

/** "8:00 a 0:00" out of the dataset's own words ("Atiende de 8:00 a 0:00 (medianoche), no las 24 horas.") */
const shortHours = (line: Resource, contact: Contact) => {
  const hours = contact.hours ?? line.hours
  if (!hours || hours.open24h) return undefined
  return /(\d{1,2}:\d{2}) a (\d{1,2}:\d{2})/.exec(hours.note ?? "")?.slice(1).join(" a ")
}

/**
 * The button of a number as the dataset names it. `fallbackLabel` is for a number the dataset does not have (the chat can name
 * one from the server's table that is still written by hand there): it is shown as it comes, with no scope.
 */
export const callButton = (number: string, fallbackLabel?: string, day: string = todayInArgentina()): CallButton => {
  const key = dialKey(number)
  for (const line of RESOURCES) {
    if (line.kind === "service" || line.verification.status !== "verified") continue
    const contact = (line.contacts ?? []).find((entry) => dialKey(entry.dial) === key)
    if (!contact) continue
    // A number listed once per jurisdiction is named by the line; a contact with its own label (the national alternative of the 135) by that label
    const listedByJurisdiction = (line.contacts ?? []).filter((entry) => dialKey(entry.dial) === key).length > 1
    const named = listedByJurisdiction ? (line.shortName ?? line.name) : (contact.label ?? line.shortName ?? line.name)
    const [label, ...scope] = named.split(SCOPE_SEPARATOR)
    return { number: contact.display, dial: contact.dial, label, scope: scope.join(SCOPE_SEPARATOR) || undefined, hours: shortHours(line, contact), stale: isStale(line, day), verifiedAt: line.verification.verifiedAt ?? undefined }
  }
  return { number, dial: key, label: fallbackLabel ?? number, stale: false }
}

/** What a screen reader says for a call button: everything the button shows, in one sentence */
export const callButtonLabel = (button: CallButton) =>
  [`Llamar al ${button.number}`, button.label, button.scope, button.hours ? `de ${button.hours}` : undefined, button.stale ? "sin nueva comprobación" : undefined].filter(Boolean).join(", ")
