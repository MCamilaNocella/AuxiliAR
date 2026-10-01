import type { ReactNode } from "react"

export type ChatAuthor = "auxi" | "user"

export type ChatMessageProps = {
  from: ChatAuthor
  children: ReactNode
}
