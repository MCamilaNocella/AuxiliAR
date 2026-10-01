import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

/** ESI: two young people reading an information leaflet together, a big heart behind them */
export const SexEducationScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <path d="M240 262C140 196 118 140 142 100c22-36 76-34 98 6 22-40 76-42 98-6 24 40 2 96-98 162z" fill="#fff" opacity="0.14" />
    {/* Shield with a check: rights */}
    <g opacity="0.3" fill="#fff">
      <path d="M72 44l30 10v22c0 20-14 32-30 38-16-6-30-18-30-38V54z" />
    </g>
    <path d="M60 78l9 9 17-18" fill="none" stroke="#00b894" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    <g fill="#fff" opacity="0.35">
      <path d="M404 64l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
      <circle cx="430" cy="120" r="3.5" />
    </g>
    <ellipse cx="240" cy="300" rx="170" ry="10" fill="#000" opacity="0.14" />

    <Figure
      facing={1}
      hair="bun"
      head={[196, 94]}
      shoulders={[[181, 120], [209, 120]]}
      hips={[[184, 192], [206, 192]]}
      armBack={[[174, 160], [176, 194]]}
      armFront={[[218, 164], [229, 152]]}
      legBack={[[188, 246], [186, 294]]}
      legFront={[[204, 246], [208, 294]]}
      colors={{ skin: SKIN.medium, hair: HAIR.brown, top: "#ffe8d6", bottom: "#264653", shoes: "#f8f9fa" }}
    />
    <Figure
      facing={-1}
      hair="short"
      sleeves="short"
      head={[290, 90]}
      shoulders={[[305, 116], [277, 116]]}
      hips={[[302, 190], [280, 190]]}
      armBack={[[312, 156], [310, 190]]}
      armFront={[[272, 160], [265, 146]]}
      legBack={[[298, 244], [300, 294]]}
      legFront={[[284, 244], [280, 294]]}
      colors={{ skin: SKIN.deep, hair: HAIR.black, top: "#ffb4a2", bottom: "#1d3557", shoes: "#f8f9fa" }}
    />

    {/* Leaflet held by both */}
    <g transform="rotate(-4 247 142)">
      <rect x="228" y="118" width="38" height="50" rx="4" fill="#fff" />
      <path d="M247 142c-6-4-9-7-9-10a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c0 3-3 6-9 10z" fill="#e63946" />
      <path d="M235 152h24M235 159h16" stroke="#b7c4c0" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    <circle cx="229" cy="152" r="6" fill={SKIN.medium} />
    <circle cx="265" cy="146" r="6" fill={SKIN.deep} />
  </svg>
)
