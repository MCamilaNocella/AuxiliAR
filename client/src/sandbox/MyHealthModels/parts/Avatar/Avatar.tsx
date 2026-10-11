import type { AvatarProps } from "./Avatar.types"

/** Initial of the profile in a circle */
export const Avatar = ({ name, onDark = false, className = "size-14 text-2xl" }: AvatarProps) => (
  <span
    aria-hidden="true"
    className={`flex flex-none items-center justify-center rounded-full font-extrabold ${onDark ? "bg-card text-brand" : "bg-brand text-on-brand"} ${className}`}
  >
    {name[0]}
  </span>
)
