import { useId } from "react"
import { ConfirmBody } from "../ConfirmBody"
import { Modal } from "../Modal"
import type { ConfirmDialogProps } from "./ConfirmDialog.types"

/**
 * A yes/no question in a small modal, drawn like the medical card's confirmations
 * and, from tablets up, as wide as the question so it fits on one line. Nothing else on the page
 * works until one of its buttons is pressed (Esc and a tap outside do nothing). "Cancelar", the safe
 * option, is the highlighted button and gets the focus.
 */
export const ConfirmDialog = ({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) => {
  const id = useId()

  return (
    <Modal open={open} onClose={onCancel} labelledBy={`${id}-title`} describedBy={`${id}-message`} role="alertdialog" blocking fitContent>
      <ConfirmBody
        titleId={`${id}-title`}
        messageId={`${id}-message`}
        title={title}
        message={message}
        backLabel="Cancelar"
        confirmLabel={confirmLabel}
        onBack={onCancel}
        onConfirm={onConfirm}
        oneLineTitle
        safeFirst
      />
    </Modal>
  )
}
