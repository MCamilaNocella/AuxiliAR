import { Figure, HAIR, SKIN } from "@/components/illustrations/Figure"

/** Más recursos: a person reading on a stack of books, next to a checklist and a question mark */
export const ResourcesScene = () => (
  <svg viewBox="0 0 480 320" aria-hidden="true" focusable="false" className="size-full">
    <circle cx="250" cy="196" r="138" fill="#fff" opacity="0.12" />
    <ellipse cx="240" cy="300" rx="200" ry="10" fill="#000" opacity="0.14" />

    {/* Checklist (trámites) */}
    <g transform="rotate(6 360 150)">
      <rect x="318" y="84" width="92" height="124" rx="8" fill="#fff" />
      <rect x="344" y="76" width="40" height="14" rx="5" fill="#8ecae6" />
      {[108, 140, 172].map((y, i) => (
        <g key={y}>
          <rect x="332" y={y} width="16" height="16" rx="4" fill="none" stroke="#219ebc" strokeWidth="2.5" />
          {i < 2 && (
            <path d={`M335 ${y + 8}l4 4 7-8`} fill="none" stroke="#fb8500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <path d={`M356 ${y + 8}h40`} stroke="#c9d6dc" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </g>
    {/* Question mark bubble */}
    <circle cx="420" cy="60" r="28" fill="#fff" opacity="0.9" />
    <path d="M410 52a10 10 0 1 1 14 9c-3 2-4 4-4 7" fill="none" stroke="#0b7285" strokeWidth="5" strokeLinecap="round" />
    <circle cx="420" cy="77" r="3.5" fill="#0b7285" />

    {/* Stack of books */}
    <g>
      <rect x="132" y="262" width="142" height="36" rx="4" fill="#ffb703" />
      <rect x="132" y="272" width="142" height="4" fill="#e09e00" />
      <rect x="142" y="232" width="124" height="30" rx="4" fill="#fb8500" />
      <rect x="258" y="236" width="4" height="22" fill="#fff" opacity="0.6" />
      <rect x="150" y="206" width="110" height="26" rx="4" fill="#e9f5f9" />
      <rect x="150" y="214" width="110" height="3" fill="#b8d8e3" />
    </g>

    <Figure
      facing={1}
      hair="short"
      head={[196, 100]}
      shoulders={[[181, 128], [209, 128]]}
      hips={[[184, 200], [204, 200]]}
      armBack={[[200, 170], [230, 160]]}
      armFront={[[222, 178], [256, 160]]}
      legBack={[[244, 204], [242, 262]]}
      legFront={[[250, 200], [254, 262]]}
      colors={{ skin: SKIN.medium, hair: HAIR.brown, top: "#fdf0d5", bottom: "#023047", shoes: "#1b1b24" }}
    />
    {/* Open book in the hands */}
    <g>
      <path d="M224 140l20 8 20-8v30l-20 8-20-8z" fill="#e63946" />
      <path d="M227 142l17 7v26l-17-7zM261 142l-17 7v26l17-7z" fill="#fff" />
    </g>
    <circle cx="256" cy="160" r="6" fill={SKIN.medium} />
  </svg>
)
