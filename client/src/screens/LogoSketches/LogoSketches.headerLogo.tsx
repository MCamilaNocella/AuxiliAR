import { useLayoutEffect, useRef, useState } from "react"
import { LogoLockup } from "@/components/layout/LogoLockup"
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings"
import { useHeaderStyle } from "@/hooks/useHeaderStyle"
import { BACKDROPS, LOGO_SKETCHES, SKETCH_FONTS_URL, THEME_LOGO_SKETCHES } from "./LogoSketches.constants"

/** Height the sketch is shrunk to on the header, in rem (the real logo is 1.75–2rem) */
const HEADER_LOGO_HEIGHT = 2.25

/**
 * A logo sketch drawn on the header, for the background it has now (the bordó, or the theme's).
 * The sketch keeps its own proportions and is scaled down to the header's height.
 */
export const HeaderSketchLogo = ({ id }: { id: string }) => {
  const { headerStyle } = useHeaderStyle()
  const { settings } = useAccessibilitySettings()
  const ref = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0, scale: 1 })

  useLayoutEffect(() => {
    const inner = ref.current
    if (!inner) return
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const { offsetWidth: width, offsetHeight: height } = inner
      if (height) setSize({ width, height, scale: (HEADER_LOGO_HEIGHT * rem) / height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [id])

  const sketch = [...THEME_LOGO_SKETCHES, ...LOGO_SKETCHES].find((candidate) => candidate.id === id)
  // A sketch that no longer exists (deleted from the page): the real logo
  if (!sketch) return <LogoLockup className="h-7 w-auto sm:h-8" />
  const backdrop = BACKDROPS.find(({ id: backdropId }) => backdropId === (headerStyle === "brand" ? "header" : settings.theme))!

  return (
    <span className="relative block" style={{ width: size.width * size.scale, height: size.height * size.scale }}>
      <link rel="stylesheet" href={SKETCH_FONTS_URL} precedence="default" />
      <span
        ref={ref}
        className="absolute top-0 left-0 inline-flex origin-top-left py-2"
        style={{ transform: `scale(${size.scale})` }}
      >
        {sketch.render(backdrop)}
      </span>
    </span>
  )
}
