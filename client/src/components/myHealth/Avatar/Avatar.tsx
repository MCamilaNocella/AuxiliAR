import type { AvatarProps } from "./Avatar.types"

/** Initial of the profile in a light circle (it sits on the home gradient) */
export const Avatar = ({ name, className = "size-14 text-2xl" }: AvatarProps) => (
  <span aria-hidden="true" className={`flex flex-none items-center justify-center rounded-full bg-card font-extrabold text-brand ${className}`}>
    {name[0]}
  </span>
)
