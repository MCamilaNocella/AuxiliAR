export type AddRelativeDialogProps = {
  open: boolean
  onClose: () => void
  /** "Agregar": name and age already checked */
  onAdd: (relative: { name: string; age: number }) => void
}
