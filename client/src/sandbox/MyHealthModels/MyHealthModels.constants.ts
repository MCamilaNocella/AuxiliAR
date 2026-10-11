import type { HealthProfile } from "./MyHealthModels.types"

/** Sample data (design 8c: "Mi Salud después de crear el perfil") */
export const PROFILES: HealthProfile[] = [
  {
    id: "federico",
    name: "Federico",
    age: 34,
    ageRange: "18 a 49 años",
    area: "Balvanera, CABA",
    record: { allergies: "Penicilina" },
    completion: 60,
    missing: ["Agregar contacto de emergencia", "Agregar obra social", "Agregar DNI"],
    nearbyCenters: [
      { name: "Hospital Ramos Mejía", distance: "600 m" },
      { name: "CeSAC 11", distance: "900 m" },
    ],
    ageTopics: ["Chequeos a partir de los 18", "Vacunas para adultos"],
  },
  {
    id: "mama",
    name: "Mamá",
    age: 62,
    ageRange: "50 a 69 años",
    area: "Caballito, CABA",
    record: { allergies: "Ninguna", contact: "Federico · 11 5555-1234", bloodType: "0+" },
    completion: 80,
    missing: ["Agregar obra social"],
    nearbyCenters: [
      { name: "Hospital Durand", distance: "450 m" },
      { name: "CeSAC 34", distance: "1,2 km" },
    ],
    ageTopics: ["Control de presión", "Vacuna antigripal"],
  },
]
