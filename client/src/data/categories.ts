import { BookOpen, Brain, HeartHandshake, HeartPulse, Hospital, PawPrint } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"

export const CATEGORIES: Category[] = [
  {
    id: "salud-fisica",
    title: "Salud física",
    description: "Presión, diabetes, vacunas",
    icon: HeartPulse,
    to: PATHS.topic("salud-fisica"),
  },
  {
    id: "salud-mental",
    title: "Salud mental",
    description: "Hablar con alguien, ansiedad",
    icon: Brain,
    to: PATHS.topic("salud-mental"),
  },
  {
    id: "esi",
    title: "Educación sexual (ESI)",
    description: "Cuidados y derechos",
    icon: HeartHandshake,
    to: PATHS.topic("esi"),
  },
  {
    id: "animales",
    title: "Animales",
    description: "Mascotas y mordeduras",
    icon: PawPrint,
    to: PATHS.topic("animales"),
  },
  {
    id: "centros",
    title: "Centros de atención",
    description: "Hospitales cerca",
    icon: Hospital,
    to: PATHS.centers,
  },
  {
    id: "recursos",
    title: "Más recursos",
    description: "Preguntas frecuentes, derechos, leyes y trámites",
    icon: BookOpen,
    to: PATHS.resources,
  },
]
