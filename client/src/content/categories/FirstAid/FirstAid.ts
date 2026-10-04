import { Bandage } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { FirstAidScene } from "./FirstAidScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"
import { Section5 } from "./sections/Section5"

export const FIRST_AID: Category = {
  id: "primeros-auxilios",
  title: "Primeros auxilios",
  description: "Qué hacer ya ante una emergencia",
  subtitle: "Guías paso a paso para actuar en emergencias",
  icon: Bandage,
  to: PATHS.firstAid,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: FirstAidScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "RCP", Content: Section1 },
    { id: "section-2", title: "ACV", Content: Section2 },
    { id: "section-3", title: "Atragantamientos", Content: Section3 },
    { id: "section-4", title: "Quemaduras", Content: Section4 },
    { id: "section-5", title: "Otros temas", Content: Section5 },
  ],
}
