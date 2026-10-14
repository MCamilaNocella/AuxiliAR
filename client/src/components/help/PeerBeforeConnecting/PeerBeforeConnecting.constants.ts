import { BadgeCheck, Bot, Lock, ShieldCheck } from "lucide-react"
import type { GenderPreference } from "@/api/peerChat"
import { SIMULATED_NOTICE, VOLUNTEERS_ARE_SIMULATED } from "../PeerChat/PeerChat.constants"

/** "Recordá que:" */
export const REMINDERS = [
  { Icon: Lock, text: "No mostramos tu nombre. Elegís cómo te llaman." },
  { Icon: BadgeCheck, text: "Te conectaremos con alguien de la red de profesionales." },
  { Icon: ShieldCheck, text: "Podés terminar el chat cuando quieras." },
  ...(VOLUNTEERS_ARE_SIMULATED ? [{ Icon: Bot, text: SIMULATED_NOTICE }] : []),
]

export const NICKNAME_MAX_LENGTH = 30

/** "¿Con quién preferís hablar?" */
export const PREFERENCES: { value: GenderPreference, label: string }[] = [
  { value: "woman", label: "Mujer" },
  { value: "man", label: "Hombre" },
  { value: "any", label: "Indistinto" },
]
