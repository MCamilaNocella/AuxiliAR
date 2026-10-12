import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from "react"
import type { ModalProps } from "./Modal.types"

/**
 * Small centered modal over a dimmed page. Native <dialog>: traps focus, closes with Esc or a tap outside
 * (unless `blocking`), and gives the focus back to whatever opened it. Fades in rising a little.
 */
export const Modal = ({ open, onClose, labelledBy, describedBy, onOpen, blocking, fitContent, role, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Latest onOpen without reopening when the parent re-renders (updated before the effect below runs)
  const onOpenRef = useRef(onOpen)
  useEffect(() => {
    onOpenRef.current = onOpen
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      onOpenRef.current?.()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  // A click outside the box (on the backdrop) targets the <dialog> itself
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!blocking && event.target === event.currentTarget) onClose()
  }

  // Esc: blocking modals stay open
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (blocking) event.preventDefault()
  }

  // Some browsers close on a second Esc despite the above: a blocking modal that's still meant to be open comes back
  const handleClose = () => {
    if (blocking && open) dialogRef.current?.showModal()
    else onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={handleCancel}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className={`m-auto ${fitContent ? "w-fit max-w-[calc(100vw-2rem)] min-w-[min(20rem,calc(100vw-2rem))]" : "w-[min(20rem,calc(100vw-2rem))]"} translate-y-2 rounded-2xl border-0 bg-card p-0 text-ink opacity-0 shadow-[0_12px_32px_rgba(0,0,0,.25)] transition-[opacity,translate,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] open:translate-y-0 open:opacity-100 motion-reduce:transition-none in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-control-line starting:open:translate-y-2 starting:open:opacity-0`}
    >
      {children}
    </dialog>
  )
}
