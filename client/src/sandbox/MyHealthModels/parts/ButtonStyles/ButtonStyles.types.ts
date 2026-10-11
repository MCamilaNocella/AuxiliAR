export type ButtonStyle = {
  id: string
  name: string
  description: string
  /** Main action ("Agregarlo ahora") */
  primary: string
  /** Secondary action with an icon ("Editar", "Imprimir") */
  secondary: string
  /** Full-width row ("Agregar contacto de emergencia →") */
  row: string
  /** Profile chip: selected / not selected */
  chipOn: string
  chipOff: string
}
