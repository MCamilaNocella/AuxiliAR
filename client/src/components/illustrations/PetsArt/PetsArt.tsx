import type { PetsArtProps } from "./PetsArt.types"

/** A dog and a cat, side by side (the illustration of the Atención veterinaria model). Decorative */
export const PetsArt = ({ className = "" }: PetsArtProps) => (
  <svg className={className} viewBox="236 150 236 156" aria-hidden="true" focusable="false">
    <ellipse cx="350" cy="300" rx="118" ry="6" fill="#000" opacity="0.13" />
    <g>
      <path d="M352 272q28-6 22-36" fill="none" stroke="#b87a4b" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="332" cy="266" rx="30" ry="28" fill="#b87a4b" />
      <ellipse cx="310" cy="238" rx="24" ry="44" fill="#b87a4b" transform="rotate(-16 310 238)" />
      <rect x="306" y="250" width="12" height="46" rx="6" fill="#7a4a2a" />
      <ellipse cx="298" cy="232" rx="12" ry="24" fill="#f3e1c7" transform="rotate(-16 298 232)" />
      <rect x="290" y="252" width="12" height="44" rx="6" fill="#b87a4b" />
      <ellipse cx="294" cy="296" rx="10" ry="4.5" fill="#f3e1c7" />
      <ellipse cx="346" cy="294" rx="15" ry="5.5" fill="#7a4a2a" />
      <path d="M286 206q14 10 30 0" fill="none" stroke="#e63946" strokeWidth="6" strokeLinecap="round" />
      <circle cx="286" cy="182" r="21" fill="#b87a4b" />
      <ellipse cx="266" cy="192" rx="15" ry="10.5" fill="#f3e1c7" />
      <ellipse cx="253" cy="188" rx="5" ry="4" fill="#2b1d14" />
      <ellipse cx="301" cy="186" rx="8.5" ry="18" fill="#7a4a2a" transform="rotate(16 301 186)" />
      <circle cx="279" cy="178" r="2.8" fill="#2b1d14" />
    </g>
    <g>
      <path d="M428 294q42-2 30-34" fill="none" stroke="#4a4453" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="414" cy="262" rx="22" ry="34" fill="#4a4453" />
      <ellipse cx="404" cy="262" rx="9" ry="19" fill="#f4efe9" />
      <path d="M391 214l2-20 12 13zM404 206l13-12 2 20z" fill="#4a4453" />
      <circle cx="404" cy="220" r="15" fill="#4a4453" />
      <ellipse cx="402" cy="295" rx="7" ry="4" fill="#f4efe9" />
      <ellipse cx="414" cy="295" rx="7" ry="4" fill="#f4efe9" />
      <circle cx="397" cy="218" r="2.2" fill="#f4d35e" />
    </g>
  </svg>
)
