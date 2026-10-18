import type { HeaderLogoAlignment, HeaderStyle, HeaderStyleOption } from "@/types/headerStyle"

/** localStorage key. The script in index.html reads it before first paint: keep both in sync. */
export const HEADER_STYLE_STORAGE_KEY = "auxiliar:header"

export const HEADER_STYLES: HeaderStyleOption[] = [
  { value: "brand", label: "Bordó", description: "El mismo bordó en los tres temas." },
  { value: "theme", label: "Según el tema", description: "Toma el fondo del tema claro, oscuro o de contraste alto (el de la página)." },
]

export const DEFAULT_HEADER_STYLE: HeaderStyle = "theme"

/** localStorage key of the logo sketch tried on the header (/logos); none: the real logo */
export const HEADER_LOGO_STORAGE_KEY = "auxiliar:header-logo"

/** localStorage key of the header logo's alignment tried on /logos */
export const HEADER_LOGO_ALIGNMENT_STORAGE_KEY = "auxiliar:header-logo-alignment"

export const HEADER_LOGO_ALIGNMENTS: { value: HeaderLogoAlignment; label: string }[] = [
  { value: "top", label: "Más arriba (como estaba)" },
  { value: "middle", label: "Punto medio" },
  { value: "center", label: "Centrado" },
]

/** Halfway: the letters still read with the buttons' text, and the cross doesn't pull the logo up */
export const DEFAULT_HEADER_LOGO_ALIGNMENT: HeaderLogoAlignment = "middle"

/** The /logos sketch that is the real logo (Wordmark): choosing it takes any sketch off the header */
export const REAL_LOGO_SKETCH_ID = "poppins-alineada"
