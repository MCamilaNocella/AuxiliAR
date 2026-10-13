export type AddRelativeDialogProps = {
  open: boolean
  /** "Agregar familiar", or "Agregar perfil" when there's none */
  title: string
  onClose: () => void
  /** "Agregar": name and age already checked */
  onAdd: (relative: { name: string; age: number }) => void
}
