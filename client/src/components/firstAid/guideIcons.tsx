import { Activity, Backpack, BriefcaseMedical, Brain, Car, Droplet, Flame, FlaskConical, HeartPulse, PersonStanding, Wind, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/** An icon for each guide (by slug); a guide without one gets the generic one */
const ICONS: Record<string, LucideIcon> = {
  rcp: HeartPulse,
  atragantamiento: Wind,
  acv: Brain,
  "hemorragia-grave": Droplet,
  convulsiones: Zap,
  quemaduras: Flame,
  heridas: Activity,
  "golpes-y-caidas": PersonStanding,
  "golpe-en-la-cabeza": Brain,
  fracturas: Backpack,
  "accidentes-de-transito": Car,
  electrocucion: Zap,
  intoxicaciones: FlaskConical,
  botiquin: BriefcaseMedical,
}

/** Decorative icon of a guide */
export const GuideIcon = ({ slug, className }: { slug: string, className?: string }) => {
  const Icon = ICONS[slug] ?? Activity
  return <Icon aria-hidden="true" className={className} />
}
