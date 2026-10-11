export type NextStepBubbleProps = {
  /**
   * - add: there's no profile; the button is "Agregar perfil"
   * - complete: data is missing; "Completar mi perfil"
   * - update: nothing missing; phrases reminding that Auxi is here and to keep the profile up to date, and "Actualizar mi perfil"
   */
  step: "add" | "complete" | "update"
  /** The button: adds a profile, or opens Auxi's chat asking for the data, one at a time */
  onStart: () => void
}
