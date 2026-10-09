import { useEffect, useRef, type MouseEvent } from "react"
import type { ModalProps } from "./Modal.types"

/**
 * Small centered modal over a dimmed page. Native <dialog>: traps focus, closes with Esc or a tap outside,
 * and gives the focus back to whatever opened it. Fades in rising a little.
 */
export const Modal = ({ open, onClose, labelledBy, describedBy, onOpen, role, children }: ModalProps) => {
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
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-[min(22rem,calc(100vw-2rem))] translate-y-2 rounded-2xl border-0 bg-card p-0 text-ink opacity-0 shadow-[0_12px_32px_rgba(0,0,0,.25)] transition-[opacity,translate,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] open:translate-y-0 open:opacity-100 motion-reduce:transition-none in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-control-line starting:open:translate-y-2 starting:open:opacity-0"
    >
      {children}
    </dialog>
  )
}
