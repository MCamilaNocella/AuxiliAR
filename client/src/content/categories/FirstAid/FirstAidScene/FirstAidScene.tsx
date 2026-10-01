import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

/** Primeros auxilios: a person bandaging someone's arm, with the first aid kit open beside them */
export const FirstAidScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="250" cy="200" r="138" fill="#fff" opacity="0.13" />
    <path d="M396 34h24v24h24v24h-24v24h-24V82h-24V58h24z" fill="#fff" opacity="0.22" />
    <ellipse cx="240" cy="300" rx="200" ry="10" fill="#000" opacity="0.14" />

    {/* First aid kit */}
    <g>
      <rect x="84" y="258" width="70" height="40" rx="6" fill="#fff" />
      <path d="M106 258v-8a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v8" fill="none" stroke="#fff" strokeWidth="5" />
      <path d="M113 266h12v8h8v12h-8v8h-12v-8h-8v-12h8z" fill="#e63946" />
    </g>

    {/* Helper, kneeling */}
    <Figure
      facing={1}
      hair="bun"
      head={[208, 132]}
      shoulders={[[192, 158], [218, 160]]}
      hips={[[186, 230], [204, 232]]}
      armBack={[[224, 204], [258, 226]]}
      armFront={[[244, 190], [270, 214]]}
      legBack={[[178, 292], [136, 294]]}
      legFront={[[244, 240], [240, 294]]}
      sleeves="short"
      colors={{ skin: SKIN.brown, hair: HAIR.black, top: "#fefae0", bottom: "#3d405b", shoes: "#1b1b24" }}
    />

    {/* Person sitting on the floor, holding out the arm */}
    <Figure
      facing={-1}
      hair="short"
      head={[324, 184]}
      shoulders={[[338, 210], [312, 210]]}
      hips={[[336, 284], [316, 286]]}
      armBack={[[352, 248], [348, 286]]}
      armFront={[[292, 238], [266, 226]]}
      legBack={[[300, 256], [280, 294]]}
      legFront={[[286, 250], [262, 292]]}
      colors={{ skin: SKIN.light, hair: HAIR.blond, top: "#264653", bottom: "#2a9d8f", shoes: "#1b1b24" }}
    />
    {/* Bandage around the forearm + roll in the helper's hand */}
    <path d="M286 235l-14-6" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
    <path d="M283 227l-4 12M277 225l-4 12" stroke="#e5e0da" strokeWidth="1.5" />
    <circle cx="270" cy="214" r="7" fill="#fff" />
    <circle cx="270" cy="214" r="2.5" fill="#e5e0da" />
  </svg>
)
