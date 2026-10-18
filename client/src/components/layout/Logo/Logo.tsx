import { lazy, Suspense } from "react"
import { Link } from "react-router"
import { DEFAULT_HEADER_LOGO_ALIGNMENT } from "@/data/headerStyle"
import { useHeaderLogo } from "@/hooks/useHeaderLogo"
import { useHeaderLogoAlignment } from "@/hooks/useHeaderLogoAlignment"
import { PATHS } from "@/router/paths"
import type { HeaderLogoAlignment } from "@/types/headerStyle"
import { Wordmark } from "../Wordmark"

/** In development, a logo sketch chosen on /logos can take the logo's place (loaded only then) */
const HeaderSketchLogo = import.meta.env.DEV
  ? lazy(async () => ({ default: (await import("@/screens/LogoSketches/LogoSketches.headerLogo")).HeaderSketchLogo }))
  : null

/*
 * Centered as one piece, the logo's box goes from the cross's top (0.16em over the word) to the letters' bottom
 * (Poppins' baseline, 0.15em over the word's bottom); halfway, half of each. Margins, not a shift, so the letters stay
 * sharp; in em, so it holds at every text size. Flex: no line box under it.
 */
const ALIGNMENT_MARGINS: Record<Exclude<HeaderLogoAlignment, "top">, string> = {
  middle: "mt-[0.08em] -mb-[0.075em]",
  center: "mt-[0.16em] -mb-[0.15em]",
}

/**
 * The logo at the header's size, sitting as `alignment` says. The room for the cross goes around it, not in it (padding
 * would lift the cross off "AR").
 */
export const HeaderWordmark = ({ alignment = DEFAULT_HEADER_LOGO_ALIGNMENT }: { alignment?: HeaderLogoAlignment }) =>
  alignment === "top" ? (
    <span className="py-2">
      <Wordmark className="text-[1.625rem]" />
    </span>
  ) : (
    <span className="flex py-2">
      <Wordmark className={`${ALIGNMENT_MARGINS[alignment]} text-[1.625rem]`} />
    </span>
  )

export const Logo = () => {
  const { headerLogo } = useHeaderLogo()
  const { headerLogoAlignment } = useHeaderLogoAlignment()
  const realLogo = <HeaderWordmark alignment={headerLogoAlignment} />

  return (
    <Link to={PATHS.home} className="flex flex-none items-center no-underline" aria-label="AuxiliAR, ir al inicio">
      {HeaderSketchLogo && headerLogo ? (
        <Suspense fallback={realLogo}>
          <HeaderSketchLogo id={headerLogo} />
        </Suspense>
      ) : (
        realLogo
      )}
    </Link>
  )
}
