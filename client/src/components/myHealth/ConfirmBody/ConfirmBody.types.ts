import type { Ref } from "react"

export type ConfirmBodyProps = {
  /** Ids that name and explain the modal (aria-labelledby / aria-describedby) */
  titleId: string
  messageId?: string
  title: string
  message: string
  /** "Cancelar", "Seguir editando" */
  backLabel: string
  confirmLabel: string
  onBack: () => void
  onConfirm: () => void
  /**
   * From tablets up the title stays on one line and sets the width (with a modal that fits its content);
   * the message wraps to that width instead of stretching it
   */
  oneLineTitle?: boolean
  /** The way back is the highlighted button (dark) and the action the grey one: for actions that can't be undone */
  safeFirst?: boolean
  /** To put the focus on the main button */
  confirmRef?: Ref<HTMLButtonElement>
}
