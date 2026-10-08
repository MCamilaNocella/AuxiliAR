import type { EmergencyRecord } from "@/types/myHealth"

/** ID card order, after name and age. `important`: flagged as "Falta agregar" when empty */
export const RECORD_FIELDS: { key: keyof EmergencyRecord; label: string; important?: boolean }[] = [
  { key: "bloodType", label: "Grupo sanguíneo" },
  { key: "allergies", label: "Alergias", important: true },
  { key: "contact", label: "Contacto de emergencia", important: true },
  { key: "insurance", label: "Obra social" },
]
