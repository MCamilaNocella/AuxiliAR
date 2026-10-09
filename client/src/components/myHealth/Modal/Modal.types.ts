import type { ReactNode } from "react"

export type ModalProps = {
  open: boolean
  onClose: () => void
  /** id of the element that names the modal (its title) */
  labelledBy: string
  /** id of the element that explains it (a confirmation's message) */
  describedBy?: string
  /** Called right after it opens: to reset a form, or put the focus somewhere else than the first button */
  onOpen?: () => void
  /** alertdialog for questions that need an answer (a confirmation) */
  role?: "dialog" | "alertdialog"
  children: ReactNode
}
