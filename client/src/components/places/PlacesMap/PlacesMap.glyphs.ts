import type { CategoryId } from "@/data/resources"

/**
 * The drawing inside each pin, by the category of the place: Salud general (heart with pulse), Salud mental (brain),
 * Salud Sexual y Reproductiva (heart with hands), Animales (paw). Paths of the Lucide icons, 24 x 24; the pin draws them small, centered in its head.
 * `fillCircles`: the paw is drawn with solid toes so it reads at this size.
 */
export type PinGlyph = { paths: string[], circles?: [number, number, number][] }

const GLYPHS: Partial<Record<CategoryId, PinGlyph>> = {
  "salud-fisica": {
    paths: ["M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5", "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"],
  },
  "salud-mental": {
    paths: [
      "M12 18V5",
      "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
      "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
      "M17.997 5.125a4 4 0 0 1 2.526 5.77",
      "M18 18a4 4 0 0 0 2-7.464",
      "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
      "M6 18a4 4 0 0 1-2-7.464",
      "M6.003 5.125a4 4 0 0 0-2.526 5.77",
    ],
  },
  esi: {
    paths: ["M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"],
  },
  animales: {
    paths: ["M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"],
    circles: [
      [11, 4, 2],
      [18, 8, 2],
      [20, 16, 2],
    ],
  },
}

/** Any other category (none today on the map) is drawn with the general symbol, so a pin never has an empty head */
export const glyphOf = (category: CategoryId): PinGlyph => GLYPHS[category] ?? (GLYPHS["salud-fisica"] as PinGlyph)
