export type CardConfirmProps = {
  title: string
  message: string
  confirmLabel: string
  /** Does what the title asks (save / throw the changes away) */
  onConfirm: () => void
  /** "Seguir editando", Esc */
  onBack: () => void
}
