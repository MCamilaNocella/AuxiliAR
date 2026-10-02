import { AuxiOffers, BeforeConnecting, ChatEnded, PeerChat, VolunteerChat, VolunteerQueue, VolunteerSignUp, Waiting } from "./PeerChatSketch.screens"
import type { SketchFlow } from "./PeerChatSketch.types"

/** The two sides of the chat, each as its screens in order */
export const SKETCH_FLOWS: SketchFlow[] = [
  {
    id: "needs-help",
    title: "Quien necesita ayuda",
    description: "Empieza en el chat con Auxi. Auxi ofrece una persona cuando hace falta, y sigue acompañando.",
    screens: [
      { id: "offer", title: "1. Auxi ofrece una persona", note: "Auxi lo ofrece cuando nota que la persona quiere hablar con alguien, o si lo pide. Las emergencias siguen yendo al 911.", Screen: AuxiOffers },
      { id: "before", title: "2. Antes de conectar", note: "Elige el tema, un apodo y si comparte lo que habló con Auxi. Queda claro qué esperar.", Screen: BeforeConnecting },
      { id: "waiting", title: "3. Esperando", note: "Auxi muestra cuánto falta y se puede seguir chateando con el bot mientras.", Screen: Waiting },
      { id: "chat", title: "4. Chat con la persona voluntaria", note: "Chat de persona a persona. Auxi queda en el chat y suma links útiles. SOS siempre a mano.", Screen: PeerChat },
      { id: "end", title: "5. Fin del chat", note: "Cómo le fue, mensaje opcional y reporte. Vuelve al chat con Auxi.", Screen: ChatEnded },
    ],
  },
  {
    id: "wants-to-help",
    title: "Quien quiere ayudar",
    description: "Se suma como voluntaria o voluntario, después de una capacitación y una revisión.",
    screens: [
      { id: "signup", title: "6. Sumarse como voluntario/a", note: "Temas en los que puede ayudar, capacitación corta y código de convivencia antes de chatear.", Screen: VolunteerSignUp },
      { id: "queue", title: "7. Panel de ayuda", note: "Se pone disponible y ve quién espera, por tema y provincia, sin datos privados.", Screen: VolunteerQueue },
      { id: "volunteer-chat", title: "8. El chat del lado voluntario", note: "Ve el resumen de Auxi (si la persona aceptó), puede pedirle ideas a Auxi y avisar una emergencia.", Screen: VolunteerChat },
    ],
  },
]
