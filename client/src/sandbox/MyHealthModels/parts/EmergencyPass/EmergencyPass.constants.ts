import type { EmergencyRecord } from "../../MyHealthModels.types"

/** Fields of the record, in order. `important`: flagged as "Falta agregar" when empty */
export const RECORD_FIELDS: { key: keyof EmergencyRecord; label: string; important?: boolean }[] = [
  { key: "allergies", label: "Alergias", important: true },
  { key: "contact", label: "Contacto", important: true },
  { key: "insurance", label: "Obra social" },
  { key: "bloodType", label: "Grupo sanguíneo" },
]

/** ID card order, after name and age: blood type · allergies / emergency contact · health insurance */
export const ID_CARD_FIELDS: { key: keyof EmergencyRecord; label: string; important?: boolean }[] = [
  { key: "bloodType", label: "Grupo sanguíneo" },
  { key: "allergies", label: "Alergias", important: true },
  { key: "contact", label: "Contacto de emergencia", important: true },
  { key: "insurance", label: "Obra social" },
]
