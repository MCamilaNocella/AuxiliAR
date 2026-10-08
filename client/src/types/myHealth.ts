/** Data of "Mi ficha para emergencias". Any field may still be missing */
export type EmergencyRecord = {
  allergies?: string
  contact?: string
  insurance?: string
  bloodType?: string
}

/** A person whose health data is kept in Mi Salud (you or a relative) */
export type HealthProfile = {
  id: string
  name: string
  /** Years; undefined until it's filled in */
  age?: number
  record: EmergencyRecord
  /** 0–100 */
  completion: number
  /** Data still missing, one action each ("Agregar obra social") */
  missing: string[]
  /** Topics recommended for the age */
  ageTopics: string[]
}
