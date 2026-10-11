export type EmergencyRecord = {
  allergies?: string
  contact?: string
  insurance?: string
  bloodType?: string
}

export type HealthProfile = {
  id: string
  name: string
  /** Years; undefined until it's filled in */
  age?: number
  ageRange: string
  area: string
  record: EmergencyRecord
  /** 0–100 */
  completion: number
  /** Data still missing, one action each */
  missing: string[]
  nearbyCenters: { name: string; distance: string }[]
  ageTopics: string[]
}
