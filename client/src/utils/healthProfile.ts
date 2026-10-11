import { CARD_FIELDS, EXTRA_FIELDS } from "@/data/myHealth"
import type { CardFieldKey, HealthProfile, MissingItem, Place, ProfileFieldKey } from "@/types/myHealth"

/** Whether that piece of data is on the emergency card (the rest only Auxi asks for) */
export const isCardField = (key: ProfileFieldKey): key is CardFieldKey => CARD_FIELDS.some((field) => field.key === key)

/** The field as plain text ("" when empty), as it goes in its input */
export const fieldText = (profile: HealthProfile, key: CardFieldKey): string => {
  if (key === "name") return profile.name
  if (key === "age") return profile.age === undefined ? "" : String(profile.age)
  return profile.record[key] ?? ""
}

/** The field as shown on the card ("34 años"); undefined when empty */
export const fieldDisplay = (profile: HealthProfile, key: CardFieldKey): string | undefined => {
  if (key === "age") return profile.age === undefined ? undefined : `${profile.age} años`
  return fieldText(profile, key) || undefined
}

/** What's missing in the profile, in order: the card's data first, then the rest (asked by Auxi) */
export const missingItems = (profile: HealthProfile): MissingItem[] => [
  ...CARD_FIELDS.filter(({ key }) => !fieldText(profile, key)).map(({ key, addLabel }) => ({ key, addLabel, onCard: true })),
  ...EXTRA_FIELDS.filter(({ key }) => key === "location" && !profile.place).map(({ key, addLabel }) => ({ key, addLabel, onCard: false })),
]

/** 0–100: share of the profile that's filled in */
export const completion = (profile: HealthProfile) => {
  const total = CARD_FIELDS.length + EXTRA_FIELDS.length
  return Math.round(((total - missingItems(profile).length) / total) * 100)
}

/**
 * The profile with the edited texts applied. Blank means "not filled in"; an age that isn't a whole
 * number between 1 and 130 is left empty, and the name can't be erased.
 */
export const withFields = (profile: HealthProfile, texts: Record<CardFieldKey, string>): HealthProfile => {
  const clean = (key: CardFieldKey) => texts[key].trim() || undefined
  const age = Number(clean("age"))
  return {
    ...profile,
    name: clean("name") ?? profile.name,
    age: Number.isInteger(age) && age >= 1 && age <= 130 ? age : undefined,
    record: { bloodType: clean("bloodType"), allergies: clean("allergies"), contact: clean("contact"), insurance: clean("insurance") },
  }
}

/** The profile with one card field set from its text (same rules as saving the whole card) */
export const withField = (profile: HealthProfile, key: CardFieldKey, text: string): HealthProfile =>
  withFields(profile, { ...(Object.fromEntries(CARD_FIELDS.map((field) => [field.key, fieldText(profile, field.key)])) as Record<CardFieldKey, string>), [key]: text })

export const withPlace = (profile: HealthProfile, place: Place): HealthProfile => ({ ...profile, place })
