import { useEffect, useId, useRef, type MouseEvent } from "react"
import { RotateCcw, X } from "lucide-react"
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings"
import { ColorThemeSelector } from "../ColorThemeSelector"
import { CursorToggle } from "../CursorToggle"
import { SettingGroup } from "../SettingGroup"
import { TextPreview } from "../TextPreview"
import { TextSizeSelector } from "../TextSizeSelector"
import type { AccessibilityPanelProps } from "./AccessibilityPanel.types"

/**
 * "Ver mejor" side panel. It's a native modal <dialog>: it traps focus, closes
 * with Esc and returns focus to the button that opened it. Changes apply
 * instantly, so the page behind the panel shows how it will look.
 */
export const AccessibilityPanel = ({ open, onClose }: AccessibilityPanelProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { settings, update, reset } = useAccessibilitySettings()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // A click outside the panel (on the backdrop) targets the <dialog> itself
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-100 translate-x-full overflow-y-auto overscroll-contain border-0 border-l border-line-strong bg-card p-0 text-ink shadow-2xl transition-[translate,display,overlay] transition-discrete duration-300 ease-out backdrop:bg-black/30 open:translate-x-0 motion-reduce:transition-none starting:open:translate-x-full"
    >
      <div className="flex min-h-full flex-col gap-6 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="m-0 text-2xl font-extrabold">
            Ver mejor
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-field"
          >
            <X aria-hidden="true" className="stroke-3 size-6" />
          </button>
        </div>

        <TextPreview />

        <SettingGroup title="Tamaño del texto">
          <TextSizeSelector value={settings.textScale} onChange={(textScale) => update({ textScale })} />
        </SettingGroup>

        <SettingGroup title="Colores">
          <ColorThemeSelector value={settings.theme} onChange={(theme) => update({ theme })} />
        </SettingGroup>

        {/* Mouse only: touch screens have no cursor */}
        <SettingGroup title="Mouse" className="hidden [@media(any-pointer:fine)]:flex">
          <CursorToggle checked={settings.largeCursor} onChange={(largeCursor) => update({ largeCursor })} />
        </SettingGroup>

        <button
          type="button"
          onClick={reset}
          className="mt-auto flex cursor-pointer items-center gap-2 self-start rounded-md py-2 text-lg text-muted underline underline-offset-4 hover:text-ink"
        >
          <RotateCcw aria-hidden="true" className="size-5" />
          Volver a como estaba
        </button>
      </div>
    </dialog>
  )
}
