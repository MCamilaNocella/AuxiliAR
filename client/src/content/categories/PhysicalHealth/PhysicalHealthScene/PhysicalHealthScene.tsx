import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

/** Salud física: a doctor with a clipboard talking to an older patient on a stool */
export const PhysicalHealthScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    {/* Backdrop: soft disc, big cross and a heartbeat line */}
    <circle cx="245" cy="200" r="138" fill="#fff" opacity="0.13" />
    <path d="M388 28h26v26h26v26h-26v26h-26v-26h-26v-26h26z" fill="#fff" opacity="0.22" />
    <path d="M40 150h70l14-30 18 58 16-44 10 16h60" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    <ellipse cx="245" cy="300" rx="190" ry="10" fill="#000" opacity="0.12" />

    {/* Stool */}
    <g fill="#3b2f2f">
      <rect x="112" y="228" width="68" height="11" rx="5.5" />
      <rect x="120" y="236" width="7" height="64" rx="3" />
      <rect x="165" y="236" width="7" height="64" rx="3" />
    </g>

    {/* Patient: older adult, seated, facing the doctor */}
    <Figure
      facing={1}
      hair="short"
      head={[150, 122]}
      shoulders={[[135, 150], [163, 150]]}
      hips={[[138, 222], [158, 222]]}
      armBack={[[128, 188], [150, 214]]}
      armFront={[[176, 190], [198, 212]]}
      legBack={[[196, 228], [192, 294]]}
      legFront={[[204, 224], [206, 294]]}
      colors={{ skin: SKIN.light, hair: HAIR.gray, top: "#f6e7d8", bottom: "#3d405b", shoes: "#2b2320" }}
    />

    {/* Doctor: white coat, stethoscope, clipboard */}
    <Figure
      facing={-1}
      hair="bun"
      head={[330, 94]}
      shoulders={[[346, 120], [314, 120]]}
      hips={[[342, 192], [318, 192]]}
      armBack={[[352, 160], [350, 196]]}
      armFront={[[306, 162], [292, 146]]}
      legBack={[[340, 246], [342, 294]]}
      legFront={[[320, 246], [316, 294]]}
      colors={{ skin: SKIN.tan, hair: HAIR.black, top: "#7fc8c2", bottom: "#1f3b57", shoes: "#2b2320", coat: "#fbf8f5" }}
    />
    <path d="M322 122c-2 14 0 24 8 30m8-30c2 14 0 24-8 30" fill="none" stroke="#2b3a4a" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="330" cy="156" r="4.5" fill="#2b3a4a" />
    <g transform="rotate(-12 282 146)">
      <rect x="268" y="124" width="28" height="38" rx="3" fill="#c9a27a" />
      <rect x="272" y="130" width="20" height="28" rx="1.5" fill="#fff" />
      <path d="M275 137h14M275 143h14M275 149h9" stroke="#b9b3ad" strokeWidth="2" strokeLinecap="round" />
      <rect x="277" y="121" width="10" height="6" rx="2" fill="#6b7280" />
    </g>
    {/* The hand holding the clipboard goes on top of it */}
    <circle cx="292" cy="146" r="6" fill={SKIN.tan} />
  </svg>
)
