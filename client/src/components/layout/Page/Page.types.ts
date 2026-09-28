import type { ReactNode } from "react"

export type PageProps = {
  title: string
  description?: ReactNode
  children?: ReactNode
}
