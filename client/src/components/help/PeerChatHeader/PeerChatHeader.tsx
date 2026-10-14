import { ArrowLeft, BadgeCheck, X } from "lucide-react"
import { ChatCallButton } from "../ChatCallButton"
import type { PeerChatHeaderProps } from "./PeerChatHeader.types"

const ICON_BUTTON = "flex size-11 flex-none cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-field"

/** Top of the chat with a person: the step or who's on the other side, the emergency number and the X to leave */
export const PeerChatHeader = ({ titleId, title, volunteer, withCall = true, onBack, onLeave, leaveRef }: PeerChatHeaderProps) => (
  <header className="flex items-center gap-2 border-b border-line px-3 py-2">
    {onBack && (
      <button type="button" onClick={onBack} aria-label="Volver con Auxi" className={ICON_BUTTON}>
        <ArrowLeft aria-hidden="true" className="size-6" />
      </button>
    )}
    {volunteer ? (
      <>
        <span aria-hidden="true" className="flex size-10 flex-none items-center justify-center rounded-full bg-brand-soft text-lg font-extrabold text-brand">
          {volunteer.name.charAt(0).toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <h2 id={titleId} className="m-0 flex items-center gap-1 text-lg/tight font-extrabold">
            {volunteer.name}
            <BadgeCheck aria-label="verificada por AuxiliAR" className="size-4.5 flex-none text-brand" />
          </h2>
          <span className="text-sm text-muted">{volunteer.role}</span>
        </span>
      </>
    ) : (
      <h2 id={titleId} className="m-0 min-w-0 flex-1 text-lg/tight font-extrabold">
        {title}
      </h2>
    )}
    {withCall && <ChatCallButton />}
    <button ref={leaveRef} type="button" onClick={onLeave} aria-label="Salir de la conversación" className={ICON_BUTTON}>
      <X aria-hidden="true" className="size-6 stroke-3" />
    </button>
  </header>
)
