import {
  Ambulance,
  Apple,
  Baby,
  Bike,
  Brain,
  Bug,
  ClipboardList,
  Clock3,
  Eye,
  FlaskConical,
  HandHeart,
  HeartHandshake,
  HeartCrack,
  HeartPulse,
  MessagesSquare,
  PawPrint,
  Pill,
  Scan,
  Scissors,
  Shield,
  Siren,
  Soup,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTubes,
  Toothbrush,
  Video,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ServiceType } from "@/data/resources"

/** One pictogram for each kind of service, reused in cards and map tooltips. */
export const SERVICE_ICONS: Record<ServiceType, LucideIcon> = {
  "primary-care": Stethoscope,
  vaccination: Syringe,
  dentistry: Toothbrush,
  ophthalmology: Eye,
  "emergency-room": Ambulance,
  laboratory: FlaskConical,
  "diagnostic-imaging": Scan,
  "specialty-care": HeartPulse,
  telesalud: Video,
  pharmacy: Pill,
  "nutrition-care": Apple,
  "food-assistance": Soup,
  "food-program-enrollment": ClipboardList,
  "physical-activity": Bike,
  "mental-health-care": Brain,
  "mental-health-emergency": Siren,
  "wellbeing-activity": Sparkles,
  "sexual-reproductive-health": HeartHandshake,
  contraception: Pill,
  condoms: Shield,
  "sexual-health-counseling": MessagesSquare,
  "emergency-contraception": Clock3,
  "pregnancy-care": Baby,
  "sti-testing-care": TestTubes,
  "ive-ile-care": HandHeart,
  zoonosis: Bug,
  "rabies-vaccination": Syringe,
  "spaying-neutering": Scissors,
  "veterinary-care": PawPrint,
}

/** Individual services that need a clearer pictogram than their broader service type. */
const SERVICE_ID_ICONS: Partial<Record<string, LucideIcon>> = {
  "recepcion-animales-fallecidos": HeartCrack,
}

export const serviceIconOf = (id: string, type: ServiceType): LucideIcon => SERVICE_ID_ICONS[id] ?? SERVICE_ICONS[type]
