import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

const CHAIR = "#2b2d42"

/** Sobre AuxiliAR: a diverse group of people together, one of them waving */
export const AboutScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="240" cy="196" r="142" fill="#fff" opacity="0.12" />
    <g fill="#fff" opacity="0.3">
      <path d="M78 96c-10-7-15-12-15-17a7 7 0 0 1 15-3 7 7 0 0 1 15 3c0 5-5 10-15 17z" />
      <path d="M408 70c-8-6-12-9-12-13a6 6 0 0 1 12-3 6 6 0 0 1 12 3c0 4-4 7-12 13z" />
      <path d="M420 150l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
    </g>
    <ellipse cx="240" cy="300" rx="200" ry="10" fill="#000" opacity="0.14" />

    {/* Left: standing */}
    <Figure
      facing={1}
      hair="curly"
      head={[132, 92]}
      shoulders={[[117, 118], [145, 118]]}
      hips={[[120, 190], [140, 190]]}
      armBack={[[110, 156], [112, 190]]}
      armFront={[[152, 156], [152, 190]]}
      legBack={[[124, 244], [122, 294]]}
      legFront={[[138, 244], [140, 294]]}
      colors={{ skin: SKIN.brown, hair: HAIR.black, top: "#ffd166", bottom: "#1d3557", shoes: "#1b1b24" }}
    />

    {/* Center: wheelchair user */}
    <path d="M212 238l-6-60" stroke={CHAIR} strokeWidth="6" strokeLinecap="round" />
    <rect x="208" y="234" width="64" height="8" rx="4" fill={CHAIR} />
    <Figure
      facing={1}
      hair="long"
      head={[236, 148]}
      shoulders={[[221, 174], [249, 174]]}
      hips={[[224, 240], [244, 240]]}
      armBack={[[214, 208], [226, 236]]}
      armFront={[[262, 210], [278, 232]]}
      legBack={[[282, 244], [282, 290]]}
      legFront={[[290, 240], [292, 288]]}
      colors={{ skin: SKIN.light, hair: HAIR.brown, top: "#bde0fe", bottom: "#3d405b", shoes: "#1b1b24" }}
    />
    <g fill="none" stroke={CHAIR}>
      <circle cx="228" cy="262" r="36" strokeWidth="6" />
      <circle cx="228" cy="262" r="26" strokeWidth="2" opacity="0.6" />
      <path d="M228 236v52M202 262h52" strokeWidth="2" opacity="0.6" />
      <path d="M264 262l24 22h16" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <circle cx="228" cy="262" r="5" fill={CHAIR} />
    <circle cx="292" cy="290" r="8" fill={CHAIR} />

    {/* Right: older adult, waving */}
    <Figure
      facing={-1}
      hair="short"
      head={[352, 92]}
      shoulders={[[367, 118], [339, 118]]}
      hips={[[364, 190], [344, 190]]}
      armBack={[[374, 156], [372, 190]]}
      armFront={[[324, 124], [318, 90]]}
      legBack={[[360, 244], [362, 294]]}
      legFront={[[346, 244], [344, 294]]}
      colors={{ skin: SKIN.tan, hair: HAIR.gray, top: "#fefae0", bottom: "#264653", shoes: "#1b1b24" }}
    />
  </svg>
)
