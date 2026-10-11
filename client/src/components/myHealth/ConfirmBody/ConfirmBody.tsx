import { BACK_BUTTON, MAIN_BUTTON } from "./ConfirmBody.constants"
import type { ConfirmBodyProps } from "./ConfirmBody.types"

/** Inside of a confirmation (over the card or in a modal): title, message, and the way back beside the main action */
export const ConfirmBody = ({ titleId, messageId, title, message, backLabel, confirmLabel, onBack, onConfirm, confirmRef, oneLineTitle, safeFirst }: ConfirmBodyProps) => (
  <div className="p-5">
    <h2 id={titleId} className={`m-0 text-lg/tight font-extrabold ${oneLineTitle ? "md:whitespace-nowrap" : ""}`}>
      {title}
    </h2>
    <p id={messageId} className={`m-0 mt-1 text-sm text-muted ${oneLineTitle ? "contain-inline-size" : ""}`}>
      {message}
    </p>
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <button type="button" onClick={onBack} className={safeFirst ? MAIN_BUTTON : BACK_BUTTON}>
        {backLabel}
      </button>
      <button ref={confirmRef} type="button" onClick={onConfirm} className={safeFirst ? BACK_BUTTON : MAIN_BUTTON}>
        {confirmLabel}
      </button>
    </div>
  </div>
)
