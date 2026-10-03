export type AccessibilityButtonProps = {
  expanded: boolean
  /** Gear turned half a turn: set on press (before the panel opens) and cleared on close */
  spun: boolean
  onClick: () => void
}
