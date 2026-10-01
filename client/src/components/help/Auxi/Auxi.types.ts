import type { ReactNode } from "react"

export type AuxiProps = {
  /**
   * The background behind Auxi is dark, whatever the theme (e.g. bg-home).
   * Only the wave lines change: they follow the theme by default and turn white when true.
   */
  onDark?: boolean
  className?: string
  /** Replaces the default arms (waving hand + wave lines); drawn behind the body */
  arms?: ReactNode
  /** Replaces the belly button (drawn in viewBox units, centered on AUXI_BELLY) */
  belly?: ReactNode
  /** Drawn behind the hands, body and head (e.g. the stick of something held) */
  backExtras?: ReactNode
  /** Drawn over the body but under the head (e.g. a stethoscope hanging from the neck) */
  bodyExtras?: ReactNode
  /** Drawn over the face (e.g. a head mirror) */
  headExtras?: ReactNode
}

/** Everything that can be drawn on top of the base Auxi */
export type AuxiExtras = Pick<AuxiProps, "arms" | "belly" | "backExtras" | "bodyExtras" | "headExtras">
