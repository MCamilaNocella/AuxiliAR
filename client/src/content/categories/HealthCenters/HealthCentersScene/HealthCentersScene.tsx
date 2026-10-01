import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

const BUILDING = { wall: "#f5f1ff", trim: "#d9cdf7", window: "#b8a4ec", door: "#7d6bb5" }

/** Centros de atención: a person walking towards a health center, with a location pin */
export const HealthCentersScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="250" cy="196" r="140" fill="#fff" opacity="0.12" />
    <ellipse cx="250" cy="300" rx="210" ry="10" fill="#000" opacity="0.14" />
    {/* Location pin */}
    <g opacity="0.9">
      <path d="M96 118c-20-24-30-40-30-54a30 30 0 0 1 60 0c0 14-10 30-30 54z" fill="#fff" opacity="0.35" />
      <circle cx="96" cy="64" r="11" fill="#fff" />
    </g>

    {/* Health center */}
    <g>
      <rect x="250" y="112" width="180" height="186" fill={BUILDING.wall} />
      <rect x="242" y="100" width="196" height="16" rx="3" fill={BUILDING.trim} />
      <rect x="306" y="58" width="68" height="44" rx="8" fill="#fff" />
      <path d="M333 66h14v10h10v14h-10v10h-14v-10h-10V76h10z" fill="#e63946" />
      {[266, 380].map((x) =>
        [130, 172, 214].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="34" height="26" rx="3" fill={BUILDING.window} />),
      )}
      <rect x="322" y="130" width="36" height="26" rx="3" fill={BUILDING.window} />
      <rect x="318" y="226" width="44" height="72" rx="3" fill={BUILDING.door} />
      <path d="M340 226v72" stroke={BUILDING.wall} strokeWidth="2" />
      <rect x="310" y="214" width="60" height="10" rx="3" fill={BUILDING.trim} />
    </g>
    {/* Bush */}
    <g>
      <circle cx="238" cy="282" r="16" fill="#52b788" />
      <circle cx="254" cy="276" r="18" fill="#40916c" />
      <circle cx="268" cy="286" r="12" fill="#52b788" />
    </g>

    <Figure
      facing={1}
      hair="long"
      head={[152, 94]}
      shoulders={[[138, 120], [164, 120]]}
      hips={[[141, 192], [161, 192]]}
      armBack={[[170, 154], [182, 180]]}
      armFront={[[136, 156], [126, 184]]}
      legBack={[[166, 242], [180, 294]]}
      legFront={[[140, 244], [120, 290]]}
      colors={{ skin: SKIN.tan, hair: HAIR.black, top: "#ffd166", bottom: "#1d3557", shoes: "#1b1b24" }}
    />
  </svg>
)
