import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

/** Salud mental: two people talking calmly on a bench, next to a plant */
export const MentalHealthScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="240" cy="190" r="140" fill="#fff" opacity="0.12" />
    <g fill="#fff" opacity="0.35">
      <path d="M70 70l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
      <path d="M418 118l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      <circle cx="96" cy="120" r="3" />
    </g>
    <ellipse cx="240" cy="300" rx="200" ry="10" fill="#000" opacity="0.14" />

    {/* Speech bubbles: one talks, the other answers with care */}
    <g fill="#fff">
      <rect x="232" y="44" width="84" height="46" rx="16" opacity="0.92" />
      <path d="M290 88l10 16 2-18z" opacity="0.92" />
      <circle cx="256" cy="67" r="4.5" fill="#4361ee" />
      <circle cx="274" cy="67" r="4.5" fill="#4361ee" />
      <circle cx="292" cy="67" r="4.5" fill="#4361ee" />
      <rect x="128" y="60" width="58" height="40" rx="14" opacity="0.8" />
      <path d="M160 98l-6 14 16-14z" opacity="0.8" />
      <path d="M157 90c-9-6-14-10-14-15a6 6 0 0 1 14-3 6 6 0 0 1 14 3c0 5-5 9-14 15z" fill="#e63946" />
    </g>

    {/* Bench */}
    <g fill="#2b2d42">
      <rect x="112" y="170" width="256" height="9" rx="4" />
      <rect x="112" y="188" width="256" height="9" rx="4" />
      <rect x="104" y="224" width="272" height="11" rx="5" />
      <rect x="120" y="232" width="8" height="66" rx="3" />
      <rect x="352" y="232" width="8" height="66" rx="3" />
    </g>

    <Figure
      facing={1}
      hair="curly"
      head={[168, 120]}
      shoulders={[[152, 148], [180, 148]]}
      hips={[[156, 222], [176, 222]]}
      armBack={[[146, 186], [166, 214]]}
      armFront={[[192, 184], [214, 208]]}
      legBack={[[212, 228], [208, 294]]}
      legFront={[[220, 224], [224, 294]]}
      colors={{ skin: SKIN.brown, hair: HAIR.black, top: "#f4a261", bottom: "#22223b", shoes: "#1b1b24" }}
    />
    <Figure
      facing={-1}
      hair="long"
      head={[316, 122]}
      shoulders={[[332, 150], [304, 150]]}
      hips={[[328, 222], [308, 222]]}
      armBack={[[340, 186], [324, 214]]}
      armFront={[[286, 180], [272, 156]]}
      legBack={[[272, 228], [276, 294]]}
      legFront={[[264, 224], [260, 294]]}
      colors={{ skin: SKIN.light, hair: HAIR.auburn, top: "#e9f5db", bottom: "#3d405b", shoes: "#1b1b24" }}
    />

    {/* Plant */}
    <g>
      <path d="M412 250c-18-26-20-58-6-80 8 26 10 52 6 80z" fill="#52b788" />
      <path d="M416 252c8-30 28-50 50-54-10 24-26 42-50 54z" fill="#40916c" />
      <path d="M408 254c-14-18-38-28-58-24 12 18 32 26 58 24z" fill="#74c69d" />
      <path d="M394 250h40l-6 48h-28z" fill="#f2cc8f" />
      <rect x="390" y="246" width="48" height="10" rx="4" fill="#e0b872" />
    </g>
  </svg>
)
