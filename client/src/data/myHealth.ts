import type { CardField, ProfileFieldKey } from "@/types/myHealth"

/** The emergency card, in ID card order. What's missing and the profile's % come from these */
export const CARD_FIELDS: CardField[] = [
  { key: "name", label: "Nombre", addLabel: "Agregar nombre" },
  { key: "age", label: "Edad", addLabel: "Agregar edad", placeholder: "Años" },
  { key: "location", label: "Localidad", addLabel: "Agregar localidad", placeholder: "Ej.: Balvanera, CABA" },
  { key: "bloodType", label: "Grupo sanguíneo", addLabel: "Agregar grupo sanguíneo", placeholder: "Ej.: 0+" },
  { key: "allergies", label: "Alergias", important: true, addLabel: "Agregar alergias", placeholder: "Ej.: penicilina, o «Ninguna»" },
  { key: "contact", label: "Contacto de emergencia", important: true, addLabel: "Agregar contacto de emergencia", placeholder: "Nombre y teléfono" },
  { key: "insurance", label: "Obra social", addLabel: "Agregar obra social", placeholder: "Ej.: PAMI, o «No tengo»" },
]

/** Every piece of profile data, in the order Auxi asks for it */
export const PROFILE_FIELD_KEYS: ProfileFieldKey[] = CARD_FIELDS.map(({ key }) => key)
