import type { ReactNode } from "react"

export type ChatLogProps = {
  /** Names the conversation for screen readers */
  label?: string
  /** Auxi waving on top, with the reminder that it doesn't replace a doctor (Auxi's conversations) */
  withAuxi?: boolean
  /** The messages, each one an <li> */
  children: ReactNode
}
