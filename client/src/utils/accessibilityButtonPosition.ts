/** Where the user dragged the "Ver mejor" button, saved on this device only */
const BUTTON_POSITION_STORAGE_KEY = "auxiliar:accessibility-button-top"

/** Top edge as a fraction of the viewport height (0–1), or null for the default (centered) */
export const loadButtonTop = (): number | null => {
  try {
    const stored = Number.parseFloat(localStorage.getItem(BUTTON_POSITION_STORAGE_KEY) ?? "")
    return Number.isFinite(stored) && stored >= 0 && stored <= 1 ? stored : null
  } catch {
    return null
  }
}

export const saveButtonTop = (top: number) => {
  try {
    localStorage.setItem(BUTTON_POSITION_STORAGE_KEY, String(top))
  } catch {
    // No storage (private mode, blocked): the position lasts until the page is reloaded
  }
}
