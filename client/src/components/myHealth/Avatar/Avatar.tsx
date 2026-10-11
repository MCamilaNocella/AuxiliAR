import { AuxiSilhouette } from "@/components/help/AuxiSilhouette"
import type { AvatarProps } from "./Avatar.types"

/** Initial of the profile (or Auxi's silhouette, like a missing photo, with no profile) in a light circle (it sits on the home gradient) */
export const Avatar = ({ name, className = "size-14 text-2xl" }: AvatarProps) => (
  <span aria-hidden="true" className={`flex flex-none items-center justify-center overflow-hidden rounded-full bg-card font-extrabold text-brand ${className}`}>
    {name ? name[0] : <AuxiSilhouette className="size-full text-muted/45" />}
  </span>
)
