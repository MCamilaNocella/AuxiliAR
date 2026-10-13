import type { CategoryId } from "@/data/resources"

/**
 * The drawing inside each pin, by the category of the place: the same symbols as the category of the site (Salud general: heart with pulse, Salud mental:
 * brain, Salud sexual y ESI: two speech bubbles (consejería and education), apart from the hearts, Animales: paw). Paths of the Lucide icons, 24 x 24; the pin draws them small, centered in its head.
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
    paths: ["M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z", "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"],
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
