import type { BubbleContext, BubbleVariant } from "./AuxiBubbleVariants.types"

export const BUBBLE_VARIANTS: BubbleVariant[] = [
  {
    id: "current",
    name: "1. Actual",
    badge: "Burbuja actual del producto",
    note: "HelpBubble real de main, tal cual está en el producto, con el mensaje nuevo.",
    real: true,
  },
  { id: "compact", name: "2. Compacta", note: "Mismo diseño; salto de línea después de la coma, y la burbuja mide lo que su línea más larga.", compact: true },
  {
    id: "compact-air",
    name: "3. Compacta + más aire",
    note: "Como la 2, con la burbuja 0,5 rem (8 px) más arriba: de -0,25 rem a +0,25 rem respecto del borde superior de Auxi.",
    compact: true,
    air: true,
  },
  {
    id: "inverted",
    name: "4. Contraste invertido",
    note: "Formato actual; fondo bg-ink y texto text-card (oscura en claro, clara en oscuro). En alto contraste queda la burbuja actual.",
    inverted: true,
  },
  {
    id: "inverted-compact",
    name: "5. Invertida + compacta",
    note: "Combina la 2 y la 4.",
    compact: true,
    inverted: true,
  },
]

export const BUBBLE_CONTEXTS: BubbleContext[] = [
  { id: "home", name: "Degradé del home, con tarjeta", note: "bg-home con una tarjeta de categoría detrás de Auxi.", surfaceClassName: "bg-home", withCard: true },
  { id: "surface-card", name: "Superficie del tema, con tarjeta", note: "bg-surface con una tarjeta (bg-card): sigue el tema de «Ver mejor».", surfaceClassName: "bg-surface", withCard: true },
  { id: "surface", name: "Superficie del tema, sin tarjeta", note: "bg-surface vacío: sigue el tema de «Ver mejor».", surfaceClassName: "bg-surface", withCard: false },
]
