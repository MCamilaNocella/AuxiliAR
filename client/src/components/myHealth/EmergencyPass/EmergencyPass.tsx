import { useEffect, useId, useImperativeHandle, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { Check, Download, Maximize2, Pencil, ShieldPlus, UserPlus } from "lucide-react"
import { CARD_FIELDS } from "@/data/myHealth"
import type { CardFieldKey } from "@/types/myHealth"
import { fieldDisplay, fieldText } from "@/utils/healthProfile"
import { isFullyVisible, prefersReducedMotion } from "@/utils/scroll"
import { CardConfirm } from "../CardConfirm"
import { ACTION_BUTTON, ADD_PROFILE_BUTTON, BAND_BUTTON, CALM_IN, CARD_TILES, CONFIRM_TEXTS, INPUT, INPUT_WIDTH, TILES_GRID } from "./EmergencyPass.constants"
import type { EmergencyPassProps } from "./EmergencyPass.types"
import { useCardEditing } from "./useCardEditing"

/** Flagged as "Falta agregar" when empty */
const isImportant = (key: CardFieldKey) => Boolean(CARD_FIELDS.find((field) => field.key === key)?.important)

/**
 * "Mi ficha para emergencias" as an ID card: red header band, then little tiles: name and age together, where
 * the person lives ("Balvanera, CABA"), and the record.
 * Missing important data (allergies, contact) is flagged; the rest just says it's empty.
 * "Editar" turns every tile into an input, with the focus on the first empty one; `ref.edit(field)` (the list
 * of what's missing) does the same with the focus on that field. Saving, cancelling or
 * leaving the card (tapping or tabbing out) asks first, over the card, when something changed.
 */
export const EmergencyPass = ({ profile, onSave, noProfile, ref }: EmergencyPassProps) => {
  const formId = useId()
  const { drafts, editing, dirty, pending, start, setDraft, requestSave, requestCancel, confirm, keepEditing, close } = useCardEditing(profile, onSave)
  const card = useRef<HTMLElement>(null)
  const inputs = useRef<Partial<Record<CardFieldKey, HTMLInputElement | null>>>({})
  const lastInput = useRef<HTMLInputElement | null>(null)
  const editButton = useRef<HTMLButtonElement>(null)
  const wasEditing = useRef(false)
  /** Only exits started inside the card put the focus back on "Editar" (tapping elsewhere keeps it there) */
  const refocusEdit = useRef(false)
  /** Field to focus once its input is on screen; `n` makes asking twice for the same field count */
  const [focusRequest, setFocusRequest] = useState<{ key: CardFieldKey; n: number } | null>(null)

  /** Opens edit mode (fresh from the profile) with the focus on `key`, or on the first empty field; already editing, it only moves the focus */
  const editAt = (key?: CardFieldKey) => {
    if (!editing) start()
    const target = key ?? CARD_FIELDS.find((field) => !fieldText(profile, field.key))?.key ?? CARD_FIELDS[0].key
    setFocusRequest((previous) => ({ key: target, n: (previous?.n ?? 0) + 1 }))
  }

  useImperativeHandle(ref, () => ({ edit: editAt }))

  // Focuses the field; if its tile isn't fully on screen, brings it into view smoothly (so on a phone it's clear where it went)
  useEffect(() => {
    const input = focusRequest && inputs.current[focusRequest.key]
    if (!input) return
    const tile = input.parentElement ?? input
    if (!isFullyVisible(tile)) tile.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" })
    input.focus({ preventScroll: true })
  }, [focusRequest])

  // Leaving edit mode from inside the card: focus back on "Editar", so keyboard users don't get lost
  useEffect(() => {
    if (!editing && wasEditing.current && refocusEdit.current) editButton.current?.focus()
    wasEditing.current = editing
    refocusEdit.current = false
  }, [editing])

  // Leaving the card while editing: with changes, the outside tap is held back and the save confirmation shows up;
  // without changes, edit mode just closes and the tap goes through. The buttons that point to a field of the card
  // (`data-card-field`, the list of what's missing) don't count as leaving: they just move the focus there
  useEffect(() => {
    if (!editing) return
    const isOutside = (target: EventTarget | null) =>
      target instanceof Element && !card.current?.contains(target) && !target.closest("[data-card-field]")
    const onClick = (event: MouseEvent) => {
      if (!isOutside(event.target)) return
      if (dirty || pending) {
        event.preventDefault()
        event.stopPropagation()
        if (!pending) requestSave()
      } else {
        close(false)
      }
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!pending && isOutside(event.relatedTarget)) requestSave()
    }
    const element = card.current
    document.addEventListener("click", onClick, true)
    element?.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("click", onClick, true)
      element?.removeEventListener("focusout", onFocusOut)
    }
  }, [editing, dirty, pending, requestSave, close])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    refocusEdit.current = true
    requestSave()
  }

  const cancelOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    refocusEdit.current = true
    requestCancel()
  }

  const backToEditing = () => {
    keepEditing()
    requestAnimationFrame(() => lastInput.current?.focus())
  }

  const confirmExit = () => {
    refocusEdit.current = true
    confirm()
  }

  return (
    <section
      ref={card}
      aria-labelledby="emergency-pass-title"
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-alert-card-line bg-alert-soft text-ink shadow-sm"
    >
      <div inert={pending !== null} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-alert px-5 py-3.5 text-on-alert">
        <h2 id="emergency-pass-title" className="m-0 flex items-center gap-2.5 text-xl/tight font-extrabold">
          <ShieldPlus aria-hidden="true" className="size-7 flex-none" />
          Mi ficha para emergencias
        </h2>
        {editing ? (
          <div className={`flex flex-wrap gap-2 ${CALM_IN}`}>
            <button
              type="button"
              onClick={() => {
                refocusEdit.current = true
                requestCancel()
              }}
              className={BAND_BUTTON}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={formId}
              className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-on-alert px-3.5 py-1.5 text-sm font-bold text-alert transition-colors hover:bg-on-alert/85"
            >
              <Check aria-hidden="true" className="size-4 flex-none" />
              Guardar
            </button>
          </div>
        ) : (
          <button ref={editButton} type="button" onClick={() => editAt()} className={`${noProfile ? ADD_PROFILE_BUTTON : BAND_BUTTON} ${CALM_IN}`}>
            {noProfile ? <UserPlus aria-hidden="true" className="size-4 flex-none" /> : <Pencil aria-hidden="true" className="size-4 flex-none" />}
            {noProfile ? "Agregar perfil" : "Editar"}
          </button>
        )}
      </div>

      <div inert={pending !== null} className="flex flex-1 flex-col gap-4 p-5 pt-4">
        {drafts ? (
          <form id={formId} onSubmit={submit} onKeyDown={cancelOnEscape} aria-label="Editar mi ficha para emergencias" className={`${TILES_GRID} ${CALM_IN}`}>
            {/* Each piece of data with its own label and input; name and age share a tile, side by side, so it keeps its size */}
            {CARD_TILES.map(({ label, keys }) => {
              const missing = keys.some((key) => isImportant(key) && !drafts[key].trim())
              return (
                <div key={label} className={`flex min-w-0 gap-3 rounded-2xl bg-card px-3.5 py-2.5 text-ink ${missing ? "ring-2 ring-alert" : ""}`}>
                  {keys.map((key) => {
                    const field = CARD_FIELDS.find((candidate) => candidate.key === key)
                    return (
                      <div key={key} className={`group min-w-0 ${INPUT_WIDTH[key] ?? "flex-1"}`}>
                        {/* The label takes the brand color along with its input's line */}
                        <label htmlFor={`${formId}-${key}`} className="block text-xs font-bold tracking-wide text-muted uppercase transition-colors duration-300 group-focus-within:text-brand">
                          {field?.label}
                        </label>
                        <input
                          id={`${formId}-${key}`}
                          ref={(element) => {
                            inputs.current[key] = element
                          }}
                          value={drafts[key]}
                          onChange={(event) => setDraft(key, event.target.value)}
                          onFocus={(event) => {
                            lastInput.current = event.currentTarget
                          }}
                          placeholder={field?.placeholder}
                          required={key === "name"}
                          autoComplete="off"
                          {...(key === "age" && { inputMode: "numeric" as const, maxLength: 3 })}
                          className={`${INPUT} w-full`}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </form>
        ) : (
          <dl className={`m-0 ${TILES_GRID} ${CALM_IN}`}>
            {CARD_TILES.map(({ label, keys }) => {
              const value = keys.map((key) => fieldDisplay(profile, key)).filter(Boolean).join(", ") || undefined
              const important = keys.some(isImportant)
              const missing = keys.some((key) => isImportant(key) && !fieldDisplay(profile, key))
              return (
                <div key={label} className={`min-w-0 rounded-2xl bg-card px-3.5 py-2.5 text-ink ${missing ? "ring-2 ring-alert" : ""}`}>
                  <dt className="text-xs font-bold tracking-wide text-muted uppercase">{label}</dt>
                  {/* leading-7: the same line height as the input that replaces it (text-lg), even for "Sin completar" */}
                  <dd className={`m-0 leading-7 wrap-break-word ${value ? "text-lg font-extrabold" : missing ? "font-bold text-alert-text" : "text-muted"}`}>
                    {value ?? (important ? "Falta agregar" : "Sin completar")}
                  </dd>
                </div>
              )
            })}
          </dl>
        )}

        {/* Fades out while editing but keeps its room, so the card doesn't change size */}
        <div
          inert={editing}
          className={`flex flex-wrap items-center gap-2 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${editing ? "opacity-0" : "opacity-100"}`}
        >
          <button type="button" className={ACTION_BUTTON}>
            <Maximize2 aria-hidden="true" className="size-4 flex-none" />
            Mostrar en pantalla completa
          </button>
          <button type="button" className={ACTION_BUTTON}>
            <Download aria-hidden="true" className="size-4 flex-none" />
            Descargar
          </button>
        </div>
        <p className="m-0 text-sm text-muted">Para mostrarle al médico o a la ambulancia.</p>
      </div>

      {pending && <CardConfirm {...CONFIRM_TEXTS[pending]} onConfirm={confirmExit} onBack={backToEditing} />}
    </section>
  )
}
