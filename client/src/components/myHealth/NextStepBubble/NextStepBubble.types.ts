export type NextStepBubbleProps = {
  /**
   * - add: there's no profile; the button reads "Agregar perfil" (and works like "Completar mi perfil")
   * - complete: data is missing; "Completar mi perfil"
   * - update: nothing missing; phrases reminding that Auxi is here and to keep the profile up to date, and "Actualizar mi perfil"
   */
  step: "add" | "complete" | "update"
  /** The button: opens Auxi's chat asking for the data, one at a time */
  onStart: () => void
}
