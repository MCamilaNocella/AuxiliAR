export type PeerWaitingProps = {
  /** How many could take the chat */
  available: number
  /** About how long until someone does */
  seconds: number
  /** "Cancelar y volver con Auxi" */
  onCancel: () => void
}
