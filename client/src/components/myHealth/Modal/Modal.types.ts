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
  /** Only its own buttons close it: Esc and a tap outside do nothing (a question that needs an answer) */
  blocking?: boolean
  /** As wide as its content needs (at least the usual width); otherwise a fixed width */
  fitContent?: boolean
  /** alertdialog for questions that need an answer (a confirmation) */
  role?: "dialog" | "alertdialog"
  children: ReactNode
}
