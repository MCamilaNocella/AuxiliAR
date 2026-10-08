import type { ProgressRingProps } from "./ProgressRing.types"

const RADIUS = 15.9
const LENGTH = 2 * Math.PI * RADIUS

/** Circular progress with the percentage in the middle */
export const ProgressRing = ({ value, className = "size-20" }: ProgressRingProps) => (
  <div
    role="progressbar"
    aria-label="Perfil completo"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
    className={`relative flex-none ${className}`}
  >
    <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r={RADIUS} fill="none" strokeWidth="3.4" className="stroke-line-strong" />
      <circle
        cx="18"
        cy="18"
        r={RADIUS}
        fill="none"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * LENGTH} ${LENGTH}`}
        className="stroke-brand transition-[stroke-dasharray] duration-500"
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold">{value}%</span>
  </div>
)
