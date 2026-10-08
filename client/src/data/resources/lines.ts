import type { Contact, Resource } from "./resources.types"

/*
 * The help lines (lines/*.json): emergency numbers and the like. They are bundled with the app on purpose - a number a person may
 * need can't depend on a request - and they live in their own module so that what needs only them (the emergency bar, the chat, the footer)
 * does not carry the rest of the dataset (the taxonomy, the coverage of the places).
 */
const files = import.meta.glob<{ resources: Resource[] }>("./lines/*.json", { eager: true, import: "default" })

/** Every resource of lines/, whatever its verification status. For people and Auxi use the `getCurrent…` functions of the index */
export const RESOURCES: readonly Resource[] = Object.values(files).flatMap((file) => file.resources)

/** What numbers are compared by: digits only, so "0800-333-0160" and "08003330160" are the same one */
export const dialKey = (dial: string) => dial.replace(/\D/g, "")

/**
 * The lines of the emergency bar, in its order (display.emergencyBarOrder). Verified lines only, but NOT filtered by
 * their review date: a number a person may need must not vanish from the bar, or from the chat that reads the same list,
 * because nobody has re-verified it yet. `npm run resources:check` warns when a review is near or past; the page stays.
 */
export const getEmergencyBarResources = (): Resource[] =>
  RESOURCES.filter((resource) => resource.verification.status === "verified" && resource.display?.emergencyBarOrder !== undefined).sort(
    (a, b) => (a.display?.emergencyBarOrder ?? 0) - (b.display?.emergencyBarOrder ?? 0),
  )

/**
 * A help line by id (lines/*.json), with the same rule as the bar: verified, whatever its review date. It throws when the
 * id does not exist, so a consumer that names a line the dataset does not have fails in the build and the tests, not in front of a person.
 */
export const getHelpLine = (id: string): Resource => {
  const line = RESOURCES.find((resource) => resource.id === id && resource.verification.status === "verified")
  if (!line) throw new Error(`The help line "${id}" is not in lines/ (or is not verified)`)
  return line
}

/** How a number is dialed and written: the first contact of the line, or the one with that dial */
export const lineContact = (line: Resource, dial?: string): Contact => {
  const contact = dial ? (line.contacts ?? []).find((entry) => dialKey(entry.dial) === dialKey(dial)) : (line.contacts ?? [])[0]
  if (!contact) throw new Error(`The line "${line.id}" has no contact${dial ? ` ${dial}` : ""}`)
  return contact
}
