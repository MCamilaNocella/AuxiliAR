export type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  /** The action can't be undone: the confirm button goes red */
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}
