export type CallCardProps = {
  number: string
  /** Digits to dial */
  dial: string
  name: string
  text: string
  /** Small facts shown as chips: hours, where, cost */
  meta: string[]
  /** `urgent`: on the alert color, with a siren (911). `main`: the main line, on the brand */
  variant?: "urgent" | "main"
}
