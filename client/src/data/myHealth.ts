import type { CardField, HealthProfile, ProfileFieldKey } from "@/types/myHealth"

/** SAMPLE data until profiles are saved for real (design 8c: "Mi Salud después de crear el perfil") */
export const HEALTH_PROFILES: HealthProfile[] = [
  {
    id: "federico",
    name: "Federico",
    own: true,
    age: 34,
    record: { allergies: "Penicilina" },
    ageTopics: ["Chequeos a partir de los 18", "Vacunas para adultos"],
  },
  {
    id: "mama",
    name: "Mamá",
    age: 62,
    record: { allergies: "Ninguna", contact: "Federico · 11 5555-1234", bloodType: "0+" },
    ageTopics: ["Control de presión", "Vacuna antigripal"],
  },
]

/** The emergency card, in ID card order. What's missing and the profile's % come from these */
export const CARD_FIELDS: CardField[] = [
  { key: "name", label: "Nombre", addLabel: "Agregar nombre" },
  { key: "age", label: "Edad", addLabel: "Agregar edad", placeholder: "Años" },
  { key: "bloodType", label: "Grupo sanguíneo", addLabel: "Agregar grupo sanguíneo", placeholder: "Ej.: 0+" },
  { key: "allergies", label: "Alergias", important: true, addLabel: "Agregar alergias", placeholder: "Ej.: penicilina, o «Ninguna»" },
  { key: "contact", label: "Contacto de emergencia", important: true, addLabel: "Agregar contacto de emergencia", placeholder: "Nombre y teléfono" },
  { key: "insurance", label: "Obra social", addLabel: "Agregar obra social", placeholder: "Ej.: PAMI, o «No tengo»" },
]

/** Profile data that isn't on the emergency card: Auxi asks for it in the chat */
export const EXTRA_FIELDS: { key: Exclude<ProfileFieldKey, CardField["key"]>; addLabel: string }[] = [
  { key: "location", addLabel: "Agregar localidad" },
]

/** Every piece of profile data, in the order Auxi asks for it */
export const PROFILE_FIELD_KEYS: ProfileFieldKey[] = [...CARD_FIELDS.map(({ key }) => key), ...EXTRA_FIELDS.map(({ key }) => key)]
