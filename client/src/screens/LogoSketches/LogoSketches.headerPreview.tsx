import { Check } from "lucide-react"
import { AccessibilityButton } from "@/components/accessibility/AccessibilityButton"
import { HeaderWordmark } from "@/components/layout/Logo"
import { TalkToSomeoneButton } from "@/components/layout/TalkToSomeoneButton"
import { HEADER_LOGO_ALIGNMENTS } from "@/data/headerStyle"
import { useHeaderLogoAlignment } from "@/hooks/useHeaderLogoAlignment"
import type { HeaderLogoAlignment } from "@/types/headerStyle"

/**
 * A copy of the header (the same classes and buttons) with the logo sitting one way, and a dashed line at its
 * middle. Tapping it puts that alignment on the real header (a radio: one at a time); its buttons are just for show.
 */
const MockHeader = ({ label, alignment }: { label: string; alignment: HeaderLogoAlignment }) => {
  const { headerLogoAlignment, setHeaderLogoAlignment } = useHeaderLogoAlignment()
  const selected = headerLogoAlignment === alignment

  return (
    <label className="flex cursor-pointer flex-col gap-2 rounded-xl p-2 transition-shadow hover:ring-2 hover:ring-control-line has-checked:ring-3 has-checked:ring-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand">
      <input
        type="radio"
        name="header-logo-alignment"
        checked={selected}
        onChange={() => setHeaderLogoAlignment(alignment)}
        className="sr-only"
      />
      <span className="flex items-center justify-between gap-2 text-sm font-bold">
        {label}
        <span
          className={`flex flex-none items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${selected ? "bg-ink text-card" : "bg-field text-muted"}`}
        >
          {selected && <Check aria-hidden="true" className="size-4" />}
          {selected ? "En el header" : "Tocá para probarlo"}
        </span>
      </span>
      <span inert className="relative overflow-hidden rounded-lg border-b border-line bg-header">
        <span className="flex items-center gap-3 px-4 py-[0.3125rem]">
          <span className="on-header contents">
            <span className="flex flex-none items-center">
              <HeaderWordmark alignment={alignment} />
            </span>
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span className="on-header contents">
              <TalkToSomeoneButton />
            </span>
            <span className="on-header contents">
              <AccessibilityButton expanded={false} spun={false} onClick={() => {}} />
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-muted" />
      </span>
    </label>
  )
}

/**
 * The header as it is, with the logo halfway and centered, one under the other (with the header color and theme chosen above).
 * On the page's background, not on a card: the header "según el tema" is card-colored.
 */
export const HeaderAlignmentPreview = () => (
  <section aria-labelledby="header-alignment" className="mb-8 flex flex-col gap-2">
    <div className="mb-2">
      <h2 id="header-alignment" className="m-0 text-xl font-extrabold text-brand">
        Logo centrado en el header
      </h2>
      <p className="m-0 text-sm text-muted">
        La línea punteada marca el medio del header. «Centrado»: el logo entero (letras y cruz) centrado con los botones;
        «Punto medio»: a mitad de camino. Tocá uno y queda así en el header de arriba.
      </p>
    </div>
    {HEADER_LOGO_ALIGNMENTS.map(({ value, label }) => (
      <MockHeader key={value} label={label} alignment={value} />
    ))}
  </section>
)
