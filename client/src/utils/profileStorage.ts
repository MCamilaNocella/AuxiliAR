import type { Profile } from "@/types/profile"

/** Saved on this device only; Mi Salud will read it from here */
const PROFILE_STORAGE_KEY = "auxiliar:profile"

export const EMPTY_PROFILE: Profile = { province: null, locality: null, age: null, person: null }

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null)

/** Only valid fields: older versions saved other shapes under the same key (e.g. the age as "27 años") */
const sanitize = (stored: Record<string, unknown>): Profile => {
  const age = typeof stored.age === "number" ? stored.age : Number.parseInt(String(stored.age ?? ""))
  return {
    province: text(stored.province),
    locality: text(stored.locality),
    age: Number.isInteger(age) && age > 0 && age <= 130 ? age : null,
    person: text(stored.person),
  }
}

export const loadProfile = (): Profile => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) ?? "{}")
    return stored && typeof stored === "object" ? sanitize(stored as Record<string, unknown>) : EMPTY_PROFILE
  } catch {
    return EMPTY_PROFILE
  }
}

export const saveProfile = (profile: Profile) => {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // No storage (private mode, blocked): the data lasts until the page is reloaded
  }
}
