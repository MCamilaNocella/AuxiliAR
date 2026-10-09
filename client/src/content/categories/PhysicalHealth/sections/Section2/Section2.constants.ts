import { Compass, Eye, HeartPulse, ScanSearch, Smile, Stethoscope, Syringe } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { centersLink } from "@/router/centersLink"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"

export type ControlAction = {
  label: string
  /** Internal route */
  to?: string
  /** Brings the emergency numbers into view instead of navigating */
  emergency?: boolean
}

/**
 * One block of "Controles de salud": what to know, a short orientation and the next step (a resource in AuxiliAR).
 * General orientation only: no diagnosis and no personalized studies. What a person needs is for their health team to say.
 */
export type ControlTopic = {
  id: string
  title: string
  icon: LucideIcon
  /** Qué necesitás saber */
  know: string
  /** Orientación */
  guidance: string[]
  /** Próxima acción */
  actions: ControlAction[]
}

/** The first topic is the way in for who doesn't know where to start */
export const CONTROL_TOPICS: ControlTopic[] = [
  {
    id: "no-se",
    title: "No sé qué controles me corresponden",
    icon: Compass,
    know: "Los controles que te tocan dependen de tu edad, tus antecedentes y tu situación. No hay una lista igual para todas las personas.",
    guidance: [
      "Un centro de salud puede revisar tu situación y decirte qué controles te convienen y cada cuánto.",
      "Si tenés carnet de vacunación o estudios anteriores, llevalos a la consulta.",
    ],
    actions: [{ label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) }],
  },
  {
    id: "vacunacion",
    title: "Vacunación",
    icon: Syringe,
    know: "Las vacunas previenen enfermedades. En Argentina existe un Calendario Nacional de Vacunación, con vacunas gratuitas y obligatorias.",
    guidance: [
      "Revisá tu carnet de vacunación para ver si te falta alguna.",
      "Si no lo encontrás, consultá igual en un vacunatorio o en un centro de salud: te pueden orientar.",
    ],
    actions: [
      { label: "Ver el Calendario de vacunación", to: `${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-5` },
      { label: "Encontrar vacunatorio", to: centersLink({ filter: "vaccination" }) },
    ],
  },
  {
    id: "generales",
    title: "Controles generales",
    icon: Stethoscope,
    know: "Una consulta de control sirve para revisar cómo estás, aunque no te sientas mal, y para hacer preguntas.",
    guidance: [
      "Antes de ir, anotá tus dudas, los medicamentos que tomás y los estudios que ya te hiciste.",
      "Cada cuánto conviene controlarte lo define tu equipo de salud, según cada persona.",
    ],
    actions: [{ label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) }],
  },
  {
    id: "corazon",
    title: "Corazón y salud metabólica",
    icon: HeartPulse,
    know: "La presión arterial y el azúcar en sangre suelen medirse en los controles de rutina. A veces no dan señales, por eso se controlan aunque te sientas bien.",
    guidance: [
      "Si ya tenés un diagnóstico o tomás medicación, no la cambies ni la dejes sin hablar con tu equipo de salud.",
      "Si de golpe te sentís muy mal, es una emergencia: no esperes.",
    ],
    actions: [
      { label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) },
      { label: "Ver números de emergencia", emergency: true },
    ],
  },
  {
    id: "prevencion",
    title: "Prevención y detección temprana",
    icon: ScanSearch,
    know: "Detectar a tiempo permite tratar mejor. Qué controles preventivos te corresponden depende de tu edad, tus antecedentes y tu historia familiar.",
    guidance: [
      "Contale a tu equipo de salud tus antecedentes familiares y cualquier cambio que notes en tu cuerpo.",
      "Es el equipo de salud quien te dice qué estudios te corresponden.",
    ],
    actions: [{ label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) }],
  },
  {
    id: "bucal",
    title: "Salud bucal",
    icon: Smile,
    know: "Cuidar la boca es parte de cuidar la salud. Los controles odontológicos ayudan a prevenir problemas y a atenderlos a tiempo.",
    guidance: [
      "Cepillarte es fundamental, y revisarte con un o una profesional también.",
      "Si tenés un dolor muy fuerte, hinchazón o un golpe en la boca y no podés esperar un turno, buscá una guardia odontológica.",
    ],
    actions: [
      { label: "Ver el mapa (odontología)", to: centersLink({ filter: "dentistry" }) },
      { label: "Urgencia odontológica", to: centersLink({ filter: "emergency", query: "odontol" }) },
    ],
  },
  {
    id: "visual",
    title: "Salud visual",
    icon: Eye,
    know: "Controlar la vista ayuda a detectar problemas a tiempo, también en chicos y chicas.",
    guidance: [
      "Para un control de rutina, empezá por tu centro de salud.",
      "Si te golpeás un ojo, perdés la vista de golpe o tenés un dolor muy fuerte, necesitás atención urgente: buscá una guardia oftalmológica.",
    ],
    actions: [
      { label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) },
      { label: "Ver el mapa (urgencia oftalmológica)", to: centersLink({ filter: "emergency", query: "oftalm" }) },
    ],
  },
]
