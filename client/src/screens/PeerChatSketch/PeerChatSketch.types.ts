import type { ComponentType, ReactNode } from "react"

export type SketchScreen = {
  id: string
  /** Name of the screen, over the phone */
  title: string
  /** What happens on this screen, under the phone */
  note: string
  Screen: ComponentType
}

export type SketchFlow = {
  id: string
  title: string
  description: string
  screens: SketchScreen[]
}

export type PhoneProps = {
  /** Top bar of the screen (title, back, actions) */
  header: ReactNode
  /** Bottom of the screen (text field, buttons) */
  footer?: ReactNode
  children: ReactNode
}

export type BubbleProps = {
  /** "me": whoever holds this phone (right, brand color); "them": the other person (left, with initial) */
  from: "me" | "them"
  /** Initial in the other person's avatar */
  initial?: string
  children: ReactNode
}

export type FakeButtonProps = {
  variant?: "primary" | "outline" | "alert" | "ghost"
  children: ReactNode
}
