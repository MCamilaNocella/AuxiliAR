import { Auxi } from "../Auxi"
import { MAIN_STEP_BUTTON } from "../PeerChat/PeerChat.constants"
import type { PeerNoticeProps } from "./PeerNotice.types"

/** The chat with a person can't go on (nobody available, the chat was lost): Auxi says so and takes them back */
export const PeerNotice = ({ text, onBack }: PeerNoticeProps) => (
  <>
    <div role="status" className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-4 text-center">
      <Auxi className="w-24" />
      <p className="m-0 text-lg font-bold">{text}</p>
    </div>
    <div className="border-t border-line p-3">
      <button type="button" onClick={onBack} className={MAIN_STEP_BUTTON}>
        Volver con Auxi
      </button>
    </div>
  </>
)
