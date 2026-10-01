import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

const DOG = { body: "#b87a4b", dark: "#7a4a2a", light: "#f3e1c7", nose: "#2b1d14" }
const CAT = { body: "#4a4453", light: "#f4efe9", eye: "#f4d35e" }

/** Animales: a person kneeling to pet a dog, with a cat sitting nearby */
export const AnimalsScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="250" cy="200" r="136" fill="#fff" opacity="0.13" />
    {/* Paw prints */}
    <g fill="#fff" opacity="0.28">
      {[
        [70, 70, -20],
        [110, 40, -10],
        [420, 60, 15],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y + 8} rx="11" ry="9" />
          <circle cx={x - 11} cy={y - 5} r="4.5" />
          <circle cx={x - 4} cy={y - 11} r="4.5" />
          <circle cx={x + 4} cy={y - 11} r="4.5" />
          <circle cx={x + 11} cy={y - 5} r="4.5" />
        </g>
      ))}
    </g>
    <ellipse cx="260" cy="300" rx="200" ry="10" fill="#000" opacity="0.13" />

    {/* Person kneeling */}
    <Figure
      facing={1}
      hair="long"
      head={[198, 128]}
      shoulders={[[182, 154], [208, 156]]}
      hips={[[178, 226], [196, 228]]}
      armBack={[[176, 194], [198, 214]]}
      armFront={[[232, 170], [266, 164]]}
      legBack={[[170, 290], [128, 294]]}
      legFront={[[236, 234], [232, 294]]}
      colors={{ skin: SKIN.light, hair: HAIR.blond, top: "#2a9d8f", bottom: "#264653", shoes: "#1b1b24" }}
    />

    {/* Dog, sitting, facing the person */}
    <g>
      <path d="M352 272q28-6 22-36" fill="none" stroke={DOG.body} strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="332" cy="266" rx="30" ry="28" fill={DOG.body} />
      <ellipse cx="310" cy="238" rx="24" ry="44" fill={DOG.body} transform="rotate(-16 310 238)" />
      <rect x="306" y="250" width="12" height="46" rx="6" fill={DOG.dark} />
      <ellipse cx="298" cy="232" rx="12" ry="24" fill={DOG.light} transform="rotate(-16 298 232)" />
      <rect x="290" y="252" width="12" height="44" rx="6" fill={DOG.body} />
      <ellipse cx="294" cy="296" rx="10" ry="4.5" fill={DOG.light} />
      <ellipse cx="346" cy="294" rx="15" ry="5.5" fill={DOG.dark} />
      <path d="M286 206q14 10 30 0" fill="none" stroke="#e63946" strokeWidth="6" strokeLinecap="round" />
      <circle cx="286" cy="182" r="21" fill={DOG.body} />
      <ellipse cx="266" cy="192" rx="15" ry="10.5" fill={DOG.light} />
      <ellipse cx="253" cy="188" rx="5" ry="4" fill={DOG.nose} />
      <ellipse cx="301" cy="186" rx="8.5" ry="18" fill={DOG.dark} transform="rotate(16 301 186)" />
      <circle cx="279" cy="178" r="2.8" fill={DOG.nose} />
    </g>

    {/* Cat */}
    <g>
      <path d="M428 294q42-2 30-34" fill="none" stroke={CAT.body} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="414" cy="262" rx="22" ry="34" fill={CAT.body} />
      <ellipse cx="404" cy="262" rx="9" ry="19" fill={CAT.light} />
      <path d="M391 214l2-20 12 13zM404 206l13-12 2 20z" fill={CAT.body} />
      <circle cx="404" cy="220" r="15" fill={CAT.body} />
      <ellipse cx="402" cy="295" rx="7" ry="4" fill={CAT.light} />
      <ellipse cx="414" cy="295" rx="7" ry="4" fill={CAT.light} />
      <circle cx="397" cy="218" r="2.2" fill={CAT.eye} />
    </g>
  </svg>
)
