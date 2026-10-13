import { useState } from "react"
import { CARD_FIELDS } from "@/data/myHealth"
import type { CardFieldKey, HealthProfile } from "@/types/myHealth"
import { fieldText, withFields } from "@/utils/healthProfile"

export type Drafts = Record<CardFieldKey, string>

/** What the confirmation over the card is asking */
export type PendingExit = "save" | "cancel"

/**
 * Edit mode of the emergency card. Leaving it with changes goes through a confirmation (`pending`);
 * without changes it just closes.
 */
export const useCardEditing = (profile: HealthProfile, onSave: (profile: HealthProfile) => void) => {
  const [drafts, setDrafts] = useState<Drafts | null>(null)
  const [pending, setPending] = useState<PendingExit | null>(null)
  const dirty = drafts !== null && CARD_FIELDS.some(({ key }) => drafts[key].trim() !== fieldText(profile, key))

  const start = () => setDrafts(Object.fromEntries(CARD_FIELDS.map(({ key }) => [key, fieldText(profile, key)])) as Drafts)
  const setDraft = (key: CardFieldKey, value: string) => setDrafts((current) => current && { ...current, [key]: value })

  const close = (save: boolean) => {
    if (save && drafts) onSave(withFields(profile, drafts))
    setDrafts(null)
    setPending(null)
  }
  /** "Guardar", Enter, or leaving the card */
  const requestSave = () => (dirty ? setPending("save") : close(false))
  /** "Cancelar", Esc */
  const requestCancel = () => (dirty ? setPending("cancel") : close(false))

  return {
    drafts,
    editing: drafts !== null,
    dirty,
    pending,
    start,
    setDraft,
    requestSave,
    requestCancel,
    confirm: () => close(pending === "save"),
    keepEditing: () => setPending(null),
    close,
  }
}
