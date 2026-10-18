import { ArgentineA } from "@/components/layout/ArgentineA"
import { LogoLockup } from "@/components/layout/LogoLockup"
import { Wordmark } from "@/components/layout/Wordmark"
import { FlagAR, NAVY, QuicksandFlagAR, RedCross, SKY, SolDeMayo, WaveCross } from "./LogoSketches.marks"
import type { Backdrop, LogoSketch } from "./LogoSketches.types"

/*
 * Hardcoded colors on purpose: each preview shows a background even when its theme is not the active one
 * (values copied from index.css: the header's bordó and each theme's card, text and brand).
 */
export const BACKDROPS: Backdrop[] = [
  { id: "header", label: "Header bordó", background: "#7b2d2d", text: "#f5f5f5", brand: "#f5f5f5", logoInk: "#ffffff" },
  { id: "light", label: "Claro", background: "#f7f2ee", text: "#1f1a1a", brand: "#7b2d2d", logoInk: NAVY },
  { id: "dark", label: "Oscuro", background: "#221c1c", text: "#f4eeec", brand: "#f0a3a3", logoInk: "#f4eeec" },
  { id: "contrast", label: "Contraste alto", background: "#000000", text: "#ffffff", brand: "#ffff00", logoInk: "#ffffff" },
]

/** The header as it was before the bordó: each theme's card */
export const THEME_BACKDROPS = BACKDROPS.filter(({ id }) => id !== "header")

const WHITE = "#ffffff"
const BLUE = "#59a5de"
const LOCKUP = "h-8 w-auto max-w-full sm:h-9"

/** What the header does "según el tema": white letters, except brand red on the light card */
const currentLetters = ({ id, brand }: Backdrop) => (id === "light" ? brand : WHITE)

/** The Clásica in other fonts (Google Fonts, see SKETCH_FONTS): weights for "Auxili" and "AR", and where the sun sits in the A */
const SKETCH_FONT_OPTIONS = [
  { family: "Quicksand", light: 400, bold: 700, sunTop: "0.5em", note: "redondeada y finita, la más parecida a la imagen" },
  { family: "Poppins", light: 300, bold: 700, sunTop: "0.52em", note: "geométrica, muy usada en apps" },
  { family: "Comfortaa", light: 400, bold: 700, sunTop: "0.5em", note: "redondeada y amigable" },
  { family: "Josefin Sans", light: 300, bold: 700, sunTop: "0.42em", note: "elegante, de letras altas" },
  { family: "Fredoka", light: 400, bold: 700, sunTop: "0.5em", note: "redonda y suave, más infantil" },
  { family: "Raleway", light: 300, bold: 800, sunTop: "0.5em", note: "fina y moderna" },
  { family: "Lexend", light: 300, bold: 700, sunTop: "0.5em", note: "pensada para leer fácil" },
]

/**
 * The fonts above, from Google Fonts: loaded only by this design page (and by the header while one of these
 * sketches is on it), never by the app
 */
export const SKETCH_FONTS_URL = `https://fonts.googleapis.com/css2?${SKETCH_FONT_OPTIONS.map(
  ({ family, light, bold }) => `family=${family.replace(/ /g, "+")}:wght@${light};${bold}`,
).join("&")}&display=swap`

/*
 * The center of the hole of Quicksand's bold "A", measured on a canvas (in em, from the top left of "AR", line-height 1):
 * the hole goes from 0.217em to 0.416em across and from 0.369em to 0.602em down
 */
const QUICKSAND_A_HOLE = { left: "0.316em", top: "0.485em" }

/*
 * The white band, with sharp edges (the same white all across): from a bit under where the R's hole starts (29% of the
 * box) to the top of the A's bar (60–72%), lower than the R's one
 */
const QUICKSAND_WHITE = [33, 63] as const

/** "Auxili": Nunito, regular weight (the reference's thin geometric letters); "AR" heavy, filled with the flag */
const WORD = "relative inline-flex items-baseline text-[2.75rem] leading-none whitespace-nowrap"

/**
 * From the logo board (reference image): "AuxiliAR" with the flag in "AR", the Sol de Mayo and the red cross.
 * Only "Auxili" changes with the background: navy on the light one, light on the dark ones (navy wouldn't read there).
 */
const THEME_SKETCHES: LogoSketch[] = [
  {
    id: "quicksand-centrada",
    name: "Quicksand con el sol centrado",
    description:
      "Igual a la Quicksand, con el sol sin carita y justo en el medio del agujerito de la A.",
    render: ({ logoInk }) => (
      <span className={`${WORD} pr-[0.38em]`} style={{ fontFamily: '"Quicksand", sans-serif' }}>
        <span style={{ color: logoInk, fontWeight: 400 }}>Auxili</span>
        <QuicksandFlagAR band={QUICKSAND_WHITE} sunLeft={QUICKSAND_A_HOLE.left} sunTop={QUICKSAND_A_HOLE.top} />
        <RedCross className="absolute -top-[0.16em] right-0 size-[0.42em]" />
      </span>
    ),
  },
  {
    id: "clasica",
    name: "Clásica",
    description: "«Auxili» fino y «AR» con la bandera y el sol; la cruz arriba, como un más.",
    render: ({ logoInk }) => (
      <span className={`${WORD} pr-[0.38em]`}>
        <span className="font-normal" style={{ color: logoInk }}>Auxili</span>
        <FlagAR className="font-black" />
        <RedCross className="absolute -top-[0.16em] right-0 size-[0.42em]" />
      </span>
    ),
  },
  {
    id: "simple",
    name: "Simple",
    description: "Solo el nombre: «Auxili» fino y «AR» con la bandera y el sol.",
    render: ({ logoInk }) => (
      <span className={WORD}>
        <span className="font-light" style={{ color: logoInk }}>Auxili</span>
        <FlagAR className="ml-[0.08em] font-black" />
      </span>
    ),
  },
  {
    id: "onda",
    name: "Itálica con onda",
    description: "En itálica, con una onda celeste debajo que termina en la cruz.",
    render: ({ logoInk }) => (
      <span className="flex flex-col items-start">
        <span className={`${WORD} italic`}>
          <span className="font-light" style={{ color: logoInk }}>Auxili</span>
          <FlagAR className="ml-[0.06em] font-black" sunLeft="0.42em" />
        </span>
        <WaveCross className="-mt-1 h-7 w-[105%]" />
      </span>
    ),
  },
  {
    id: "onda-borde",
    name: "Itálica con onda y borde",
    description: "La itálica con onda, con un borde negro en «AR» para que se vea sobre el fondo claro, y la cruz más grande.",
    render: ({ logoInk }) => (
      <span className="flex flex-col items-start">
        <span className={`${WORD} italic`}>
          <span className="font-light" style={{ color: logoInk }}>Auxili</span>
          <FlagAR className="ml-[0.06em] font-black" sunLeft="0.42em" edge="#000000" />
        </span>
        <WaveCross big className="-mt-1 h-9 w-[108%]" />
      </span>
    ),
  },
  {
    id: "etiqueta",
    name: "Etiqueta celeste",
    description: "«AR» en blanco adentro de una etiqueta celeste con el sol, y la cruz arriba: se lee igual en todos los fondos.",
    render: ({ logoInk }) => (
      <span className={`${WORD} items-center pr-[0.3em]`}>
        <span className="font-light" style={{ color: logoInk }}>Auxili</span>
        <span className="relative ml-[0.08em] inline-flex items-center gap-[0.08em] rounded-[0.22em] px-[0.14em] pt-[0.02em] pb-[0.06em] font-extrabold text-white" style={{ background: SKY }}>
          AR
          <SolDeMayo className="size-[0.42em]" />
        </span>
        <RedCross className="absolute -top-[0.22em] right-0 size-[0.42em]" />
      </span>
    ),
  },
  ...SKETCH_FONT_OPTIONS.map(({ family, light, bold, sunTop, note }) => ({
    id: `fuente-${family.toLowerCase().replace(/ /g, "-")}`,
    name: `Tipografía: ${family}`,
    description: `Como la Clásica, en ${family}${note ? `: ${note}` : ""}.`,
    render: ({ logoInk }: Backdrop) => (
      <span className={`${WORD} pr-[0.38em]`} style={{ fontFamily: `"${family}", sans-serif` }}>
        <span style={{ color: logoInk, fontWeight: light }}>Auxili</span>
        <FlagAR style={{ fontWeight: bold }} sunTop={sunTop} edge={SKY} />
        <RedCross className="absolute -top-[0.16em] right-0 size-[0.42em]" />
      </span>
    ),
  })),
  {
    id: "poppins-alineada",
    name: "Poppins alineada abajo",
    description: "Igual a la Poppins, con el sol sin carita y «AR» apoyada a la misma altura que «Auxili». Es el logo de la página.",
    // "Auxili" in the theme's text color, as on the real header
    render: ({ text }) => <Wordmark ink={text} className="text-[2.75rem]" />,
  },
]

/** The reworked ones first, each over the one it comes from, to compare them */
const FIRST = ["quicksand-centrada", "fuente-quicksand", "poppins-alineada", "fuente-poppins"]

export const THEME_LOGO_SKETCHES = [
  ...FIRST.map((id) => THEME_SKETCHES.find((sketch) => sketch.id === id)!),
  ...THEME_SKETCHES.filter(({ id }) => !FIRST.includes(id)),
]

/** The ones built on the logo with the Argentine A (the one before the Poppins), for the bordó header */
export const LOGO_SKETCHES: LogoSketch[] = [
  {
    id: "actual",
    name: "Con la A",
    description: "«uxili» blanco y «AR» celeste. En el fondo claro, «uxili» pasa al bordó (así queda en el header según el tema).",
    render: (backdrop) => <LogoLockup letters={currentLetters(backdrop)} ar={BLUE} className={LOCKUP} />,
  },
  {
    id: "una-tinta",
    name: "Una sola tinta",
    description: "«uxiliAR» entero del color del texto de cada fondo; el color lo pone solo la A.",
    render: ({ text }) => <LogoLockup letters={text} ar={text} className={LOCKUP} />,
  },
  {
    id: "celeste",
    name: "Todo celeste",
    description: "«uxiliAR» entero en el celeste de la A.",
    render: () => <LogoLockup letters={BLUE} ar={BLUE} className={LOCKUP} />,
  },
  {
    id: "a-con-borde",
    name: "A con borde blanco",
    description: "Como el actual, con un borde blanco alrededor de toda la A para que se despegue del fondo.",
    render: (backdrop) => <LogoLockup letters={currentLetters(backdrop)} ar={BLUE} outline={WHITE} className={LOCKUP} />,
  },
  {
    id: "solo-a",
    name: "Solo la A",
    description: "Para el ícono de la pestaña (favicon) o lugares chicos: a 48, 32 y 16 píxeles.",
    render: () => (
      <span className="flex items-end gap-4">
        <ArgentineA className="size-12" />
        <ArgentineA className="size-8" />
        <ArgentineA className="size-4" />
      </span>
    ),
  },
  {
    id: "anterior",
    name: "Logo anterior",
    description: "La banderita y «AuxiliAR» en DM Serif, del color de marca de cada tema.",
    render: ({ brand }) => (
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="flex h-4.5 w-6.5 flex-none flex-col overflow-hidden rounded-xs shadow-[0_0_0_1px_#e3dcd9]">
          <span className="flex-1 bg-[#74acdf]" />
          <span className="flex flex-1 items-center justify-center bg-white">
            <span className="size-1 rounded-full bg-[#f6b40e]" />
          </span>
          <span className="flex-1 bg-[#74acdf]" />
        </span>
        <span className="font-display text-2xl tracking-[-0.01em]" style={{ color: brand }}>
          AuxiliAR
        </span>
      </span>
    ),
  },
]
