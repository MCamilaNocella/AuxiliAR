import type { HealthProfile } from "@/types/myHealth"

/** SAMPLE data until profiles are saved for real (design 8c: "Mi Salud después de crear el perfil") */
export const HEALTH_PROFILES: HealthProfile[] = [
  {
    id: "federico",
    name: "Federico",
    age: 34,
    record: { allergies: "Penicilina" },
    completion: 60,
    missing: ["Agregar contacto de emergencia", "Agregar obra social", "Agregar DNI"],
    ageTopics: ["Chequeos a partir de los 18", "Vacunas para adultos"],
  },
  {
    id: "mama",
    name: "Mamá",
    age: 62,
    record: { allergies: "Ninguna", contact: "Federico · 11 5555-1234", bloodType: "0+" },
    completion: 80,
    missing: ["Agregar obra social"],
    ageTopics: ["Control de presión", "Vacuna antigripal"],
  },
]
