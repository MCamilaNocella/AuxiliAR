import { Link } from "react-router"
import { PATHS } from "@/router/paths"

export const Logo = () => (
  <Link to={PATHS.home} className="flex flex-none items-center gap-2 no-underline" aria-label="AuxiliAR, ir al inicio">
    {/* Bandera argentina */}
    <span
      aria-hidden="true"
      className="flex h-4.5 w-6.5 flex-col overflow-hidden rounded-xs shadow-[0_0_0_1px_var(--color-line-strong)]"
    >
      <span className="flex-1 bg-[#74acdf]" />
      <span className="flex flex-1 items-center justify-center bg-white">
        <span className="size-1 rounded-full bg-[#f6b40e]" />
      </span>
      <span className="flex-1 bg-[#74acdf]" />
    </span>
    <span className="font-display text-xl tracking-[-0.01em] text-brand sm:text-2xl">AuxiliAR</span>
  </Link>
)
