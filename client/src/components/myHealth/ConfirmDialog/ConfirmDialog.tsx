import { useId } from "react"
import { Modal } from "../Modal"
import type { ConfirmDialogProps } from "./ConfirmDialog.types"

/** A yes/no question in a small modal. The focus starts on "Cancelar", the safe option */
export const ConfirmDialog = ({ open, title, message, confirmLabel, danger, onConfirm, onCancel }: ConfirmDialogProps) => {
  const id = useId()

  return (
    <Modal open={open} onClose={onCancel} labelledBy={`${id}-title`} describedBy={`${id}-message`} role="alertdialog">
      <div className="flex flex-col gap-4 p-5">
        <div>
          <h2 id={`${id}-title`} className="m-0 text-lg/tight font-extrabold">
            {title}
          </h2>
          <p id={`${id}-message`} className="m-0 mt-1 text-sm text-muted">
            {message}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {/* First in the DOM: the dialog focuses it when it opens */}
          <button
            type="button"
            onClick={onCancel}
            className="min-h-10 cursor-pointer rounded-lg bg-field px-3.5 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-10 cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-bold transition-colors ${danger ? "bg-alert text-on-alert hover:bg-alert/85" : "bg-brand text-on-brand hover:bg-brand-dark"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
