import { useId, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { Modal } from "../Modal"
import { ERRORS, INPUT, MAX_NAME_LENGTH } from "./AddRelativeDialog.constants"
import type { AddRelativeDialogProps } from "./AddRelativeDialog.types"

/**
 * Small modal to add a relative: just the name and the age (the rest is completed later, on the card or with Auxi).
 * Errors show under each field once "Agregar" is pressed.
 */
export const AddRelativeDialog = ({ open, onClose, onAdd }: AddRelativeDialogProps) => {
  const id = useId()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [tried, setTried] = useState(false)

  // Fresh every time it opens, with the focus straight on the name (not on the X, the first button)
  const reset = () => {
    setName("")
    setAge("")
    setTried(false)
    document.getElementById(`${id}-name`)?.focus()
  }

  const ageNumber = Number(age.trim())
  const nameError = !name.trim() ? ERRORS.name : null
  const ageError = !(Number.isInteger(ageNumber) && ageNumber >= 1 && ageNumber <= 130) ? ERRORS.age : null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTried(true)
    if (nameError || ageError) {
      // The first wrong field takes the focus, so its message is read
      document.getElementById(`${id}-${nameError ? "name" : "age"}`)?.focus()
      return
    }
    onAdd({ name: name.trim(), age: ageNumber })
  }

  const showName = tried && nameError
  const showAge = tried && ageError

  return (
    <Modal open={open} onClose={onClose} labelledBy={`${id}-title`} onOpen={reset}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 id={`${id}-title`} className="m-0 text-lg/tight font-extrabold">
            Agregar familiar
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mt-1.5 -mr-1.5 flex size-9 flex-none cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-field"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-bold">
            Nombre
          </label>
          <input
            id={`${id}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej.: Mamá, Juan"
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            aria-invalid={showName ? true : undefined}
            aria-describedby={showName ? `${id}-name-error` : undefined}
            className={INPUT}
          />
          {showName && (
            <p id={`${id}-name-error`} className="m-0 mt-1 text-sm font-bold text-alert-text">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-age`} className="text-sm font-bold">
            Edad
          </label>
          <input
            id={`${id}-age`}
            value={age}
            onChange={(event) => setAge(event.target.value.replace(/\D/g, ""))}
            placeholder="Años"
            inputMode="numeric"
            maxLength={3}
            autoComplete="off"
            aria-invalid={showAge ? true : undefined}
            aria-describedby={showAge ? `${id}-age-error` : undefined}
            className={INPUT}
          />
          {showAge && (
            <p id={`${id}-age-error`} className="m-0 mt-1 text-sm font-bold text-alert-text">
              {ageError}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 cursor-pointer rounded-lg bg-field px-3.5 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-10 cursor-pointer rounded-lg bg-brand px-3.5 py-1.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark"
          >
            Agregar
          </button>
        </div>
      </form>
    </Modal>
  )
}
