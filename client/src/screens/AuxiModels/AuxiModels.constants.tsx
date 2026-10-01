import type { AuxiExtras } from "@/components/help/Auxi"
import { AUXI_COLORS } from "@/components/help/Auxi"
import { CheekPaw, Clipboard, DrapedStethoscope, HeartBubble, HuggedKit, LeftDashes, MapPin } from "./AuxiModels.accessories"
import { Cross, HeadMirror, Stethoscope } from "./AuxiModels.parts"
import type { AuxiModel, CategoryModels, CrossTone } from "./AuxiModels.types"

export const CROSS_TONES: CrossTone[] = [
  { id: "light-red", label: "Rojo clarito", color: "#ff8593", contrast: AUXI_COLORS.white },
  { id: "white", label: "Blanca", color: AUXI_COLORS.white, contrast: "#ff8593" },
]

/** The white cross every category model wears, always centered on the belly (accessories may cover it) */
const WHITE_CROSS = <Cross color={AUXI_COLORS.white} />

const model = (number: number, id: string, name: string, description: string, extras: AuxiExtras): AuxiModel => ({
  id,
  name: `${number}. ${name}`,
  description,
  variants: [{ id, extras: { belly: WHITE_CROSS, ...extras } }],
})

/** Models grouped by home category, all with the white cross. Numbered so they can be referred to. */
export const CATEGORY_MODELS: CategoryModels[] = [
  {
    categoryId: "salud-fisica",
    models: [
      // Copied from the reference as is: arms come straight to the kit (which covers the belly cross)
      model(16, "hugged-kit", "Botiquín abrazado", "Abraza un botiquín grande con las dos manos.", {
        arms: <LeftDashes />,
        headExtras: <HuggedKit />,
      }),
      // Stethoscope hanging from the neck, kept to the sides so the cross shows
      model(20, "draped-stethoscope", "Estetoscopio colgado", "Lleva el estetoscopio colgado del cuello, sin ponérselo.", {
        bodyExtras: <DrapedStethoscope />,
      }),
    ],
  },
  {
    categoryId: "salud-mental",
    models: [
      model(21, "heart-bubble", "Globito con corazón", "Un globo de diálogo con un corazón: hablar hace bien.", {
        headExtras: <HeartBubble />,
      }),
    ],
  },
  {
    categoryId: "animales",
    models: [
      model(18, "cheek-paw", "Huellita en el cachete", "Saluda con una huellita de perro negra en el cachete.", {
        headExtras: <CheekPaw />,
      }),
    ],
  },
  {
    categoryId: "centros",
    models: [
      model(9, "map-pin", "Pin de ubicación", "Levanta un pin de mapa rojo con la cruz: «acá cerca».", {
        backExtras: <MapPin />,
      }),
    ],
  },
  {
    categoryId: "recursos",
    models: [
      model(11, "clipboard", "Planilla de trámites", "Una tablita con una lista de cosas resueltas.", {
        bodyExtras: <Clipboard />,
      }),
    ],
  },
]

type ToneModel = Omit<AuxiModel, "variants"> & { draw: (tone: CrossTone) => AuxiExtras }

/** One variant per cross color */
const withTones = ({ draw, ...rest }: ToneModel): AuxiModel => ({
  ...rest,
  variants: CROSS_TONES.map((tone) => ({ id: `${rest.id}-${tone.id}`, label: tone.label, extras: draw(tone) })),
})

const FIRST_TONE_MODELS: ToneModel[] = [
  {
    id: "simple",
    name: "12. Cruz simple",
    description: "La cruz clásica, del mismo tamaño que el círculo actual. (Antes era el 1.)",
    draw: ({ color }) => ({ belly: <Cross color={color} /> }),
  },
  {
    id: "stethoscope",
    name: "13. Cruz + estetoscopio",
    description: "Estetoscopio colgado del cuello. (Antes era el 6.)",
    draw: ({ color }) => ({ belly: <Cross color={color} />, bodyExtras: <Stethoscope /> }),
  },
  {
    id: "full",
    name: "14. Doctor completo",
    description: "Cruz, estetoscopio y espejo frontal. (Antes era el 9.)",
    draw: ({ color }) => ({
      belly: <Cross color={color} />,
      bodyExtras: <Stethoscope />,
      headExtras: <HeadMirror />,
    }),
  },
]

/** Kept from the first round, still in both cross colors */
export const FIRST_MODELS = FIRST_TONE_MODELS.map(withTones)
