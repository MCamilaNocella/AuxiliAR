/** Data of "Mi ficha para emergencias". Any field may still be missing */
export type EmergencyRecord = {
  allergies?: string
  contact?: string
  insurance?: string
  bloodType?: string
}

/** Where the person lives (not on the emergency card; asked by Auxi) */
export type Place = {
  locality: string
  province?: string
}

/** A person whose health data is kept in Mi Salud (you or a relative) */
export type HealthProfile = {
  id: string
  name: string
  /** The profile of whoever uses the app (the rest are relatives): Auxi says "vos" instead of the name */
  own?: boolean
  /** Years; undefined until it's filled in */
  age?: number
  record: EmergencyRecord
  place?: Place
  /** Topics recommended for the age */
  ageTopics: string[]
}

/** Each piece of data on the emergency card: name and age, then the record */
export type CardFieldKey = "name" | "age" | keyof EmergencyRecord

/** Every piece of data of the profile: the card's, plus the ones only Auxi asks for */
export type ProfileFieldKey = CardFieldKey | "location"

export type CardField = {
  key: CardFieldKey
  label: string
  /** Flagged as "Falta agregar" when empty (the rest just say "Sin completar") */
  important?: boolean
  /** Button in the list of what's missing ("Agregar obra social") */
  addLabel: string
  /** Example shown in the empty input */
  placeholder?: string
}

/** One entry of the list of what's missing */
export type MissingItem = {
  key: ProfileFieldKey
  /** Button text ("Agregar obra social") */
  addLabel: string
  /** Completed right on the emergency card; the rest, with Auxi */
  onCard: boolean
}
