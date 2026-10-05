export type BubbleVariant = {
  id: string
  name: string
  note: string
  /** Visible tag next to the name (e.g. which one is what the product has today) */
  badge?: string
  /** The real HelpBubble (variant 1); the others use the sketch copy of its markup */
  real?: boolean
  /** Narrower bubble, text in two lines */
  compact?: boolean
  /** More space between the bubble and Auxi */
  air?: boolean
  /** Dark bubble with light text in light theme, light with dark in dark theme */
  inverted?: boolean
}

export type BubbleContext = {
  id: string
  name: string
  note: string
  /** Classes of the surface the card and Auxi sit on */
  surfaceClassName: string
  /** A category-like card behind Auxi, to see what the bubble covers */
  withCard: boolean
}
