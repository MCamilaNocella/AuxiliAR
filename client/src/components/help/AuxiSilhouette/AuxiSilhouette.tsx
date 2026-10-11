import { AUXI_PATHS as P } from "../Auxi/Auxi.constants"
import { SILHOUETTE_VIEWBOX } from "./AuxiSilhouette.constants"
import type { AuxiSilhouetteProps } from "./AuxiSilhouette.types"

/**
 * Auxi as a flat one-color silhouette (antenna, head and body, no arms or face), like the default picture of
 * a profile without a photo. Decorative. Uses Auxi's own shapes, so it always matches the bot.
 */
export const AuxiSilhouette = ({ className }: AuxiSilhouetteProps) => (
  <svg viewBox={SILHOUETTE_VIEWBOX} aria-hidden="true" focusable="false" className={className}>
    <g fill="currentColor">
      <path d={P.body} />
      <rect x="77.1" y="19" width="1.9" height="13" />
      <circle cx="78.45" cy="16.9" r="3.55" />
      <path d={P.head} />
    </g>
  </svg>
)
