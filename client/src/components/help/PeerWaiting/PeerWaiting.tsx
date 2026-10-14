import { Clock } from "lucide-react"
import { Auxi } from "../Auxi"
import { SOFT_STEP_BUTTON } from "../PeerChat/PeerChat.constants"
import type { PeerWaitingProps } from "./PeerWaiting.types"

const waitText = (seconds: number) => (seconds < 60 ? "menos de 1 minuto" : `${Math.round(seconds / 60)} minutos`)

/** Looking for a volunteer: how long it takes and how many there are */
export const PeerWaiting = ({ available, seconds, onCancel }: PeerWaitingProps) => (
  <>
    <div role="status" className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-4 text-center">
      <Auxi className="w-28" />
      <p className="m-0 text-xl font-extrabold">Estoy buscando a alguien que pueda ayudarte…</p>
      <p className="m-0 flex items-center gap-1.5 text-muted">
        <Clock aria-hidden="true" className="size-4.5" />
        Tiempo estimado: {waitText(seconds)}
      </p>
      <p className="m-0 text-ink-soft">
        {available === 1 ? "Hay 1 persona disponible." : `Hay ${available} personas disponibles.`} No olvides que en cualquier momento podés salir de la
        conversación.
      </p>
    </div>
    <div className="border-t border-line p-3">
      <button type="button" onClick={onCancel} className={SOFT_STEP_BUTTON}>
        Cancelar y volver con Auxi
      </button>
    </div>
  </>
)
