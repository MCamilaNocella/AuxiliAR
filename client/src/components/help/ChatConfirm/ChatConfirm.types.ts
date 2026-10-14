export type ChatConfirmProps = {
  title: string
  message: string
  /** The safe option (highlighted, gets the focus): "Seguir en el chat" */
  backLabel: string
  confirmLabel: string
  onBack: () => void
  onConfirm: () => void
}
