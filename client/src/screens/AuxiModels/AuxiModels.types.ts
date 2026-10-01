import type { AuxiExtras } from "@/components/help/Auxi"

export type CrossTone = {
  id: string
  label: string
  /** Main color of the cross */
  color: string
  /** Contrasting color (badge background, inner details) */
  contrast: string
}

/** One drawable Auxi: what gets previewed on the floating bot when tapped */
export type AuxiVariant = {
  id: string
  /** Caption under the drawing (omitted when the card has a single variant) */
  label?: string
  extras: AuxiExtras
}

export type AuxiModel = {
  id: string
  name: string
  description: string
  variants: AuxiVariant[]
}

export type CategoryModels = {
  /** Id of a home category (see CATEGORIES) */
  categoryId: string
  models: AuxiModel[]
}
