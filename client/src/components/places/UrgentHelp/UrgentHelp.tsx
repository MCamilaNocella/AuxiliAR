import { Phone } from "lucide-react"
import { GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
import { callButton, describeHelpContacts, describeHelpLine, telHref, uncheckedNotice } from "@/utils/helpLines"
import type { HelpLineView } from "@/utils/helpLines"
import type { MentalHealthContext } from "@/utils/places"
import { AVOID_ATTRIBUTE } from "@/utils/auxiAvoidance"
import { revealEmergencies } from "@/utils/revealEmergencies"

/*
 * Nothing about a number is written here: which numbers, where each one works, when it answers and whether it is free
 * come from the verified help lines (data/resources/lines/nacional.json) through describeHelpLine. If the dataset says
 * less, this card says less. The order is the one that helps most in a crisis: the general emergency, the national
 * mental health line, the suicide prevention line (with where it works and its hours) and, last, the ambulance, which
 * exists by jurisdiction.
 */
const first = () => [describeHelpLine("emergencias-911"), describeHelpLine("urgencias-salud-mental-0800")]
const more = () => describeHelpContacts("prevencion-suicidio-cas")
const ambulance = () => describeHelpLine("emergencias-107")

const CallLink = ({ line, primary = false }: { line: HelpLineView, primary?: boolean }) => (
  <a
    href={telHref(line.dial)}
    aria-label={`Llamar al ${line.display}: ${line.name}`}
    className={`inline-flex min-h-12 max-w-full flex-wrap items-center gap-x-2 gap-y-0 rounded-xl border px-4 py-2 text-lg font-extrabold no-underline ${primary ? "border-brand bg-brand text-on-brand" : "border-control-line bg-field text-ink"}`}
  >
    <Phone aria-hidden="true" className="size-5 shrink-0" />
    <span className="whitespace-nowrap">{line.display}</span>
    <span className="text-base font-semibold">{line.name}</span>
  </a>
)

/** One number with what the sources say about it, under it */
const Line = ({ line, primary = false }: { line: HelpLineView, primary?: boolean }) => {
  const facts = [line.where, line.hours, line.cost].filter(Boolean)
  return (
    <div className="flex flex-col items-start gap-1">
      <CallLink line={line} primary={primary} />
      {facts.length > 0 && <p className="m-0 text-ink-soft">{facts.map((fact) => (fact?.endsWith(".") ? fact : `${fact}.`)).join(" ")}</p>}
    </div>
  )
}

const Card = ({ crisis }: { crisis: boolean }) => {
  const [general, national] = first()
  const [caba, nationalAlternative] = more()
  const same = ambulance()
  // A line past its review date is still here (a number a person may need must not vanish) but it is not presented as checked:
  // said once for the whole card, not on every line
  const notice = uncheckedNotice([general, national, caba, nationalAlternative, same].map((line) => callButton(line.display)), GENERAL_EMERGENCY_NUMBER)
  return (
    <section {...(crisis ? { [AVOID_ATTRIBUTE]: "" } : {})} aria-labelledby="urgent-help-title" className="flex max-w-prose flex-col gap-3 rounded-2xl border-2 border-brand bg-card p-4">
      <h3 id="urgent-help-title" className="m-0 text-lg font-extrabold">
        {crisis ? "Si estás en crisis o pensás en hacerte daño, no esperes: pedí ayuda ahora" : "Ayuda urgente"}
      </h3>
      {notice && (
        <p role="note" className="m-0 rounded-lg bg-surface-alt p-2 text-ink-soft">
          {notice}
        </p>
      )}
      <p className="m-0">Si hay riesgo para tu vida o la de otra persona, llamá ya al {general.display}.</p>
      <Line line={general} primary />
      <p className="m-0 font-bold">Para hablar con alguien en una crisis emocional:</p>
      <Line line={national} primary />
      <p className="m-0 font-bold">Otras líneas, con su alcance y su horario:</p>
      <Line line={caba} />
      <Line line={nationalAlternative} />
      <p className="m-0 font-bold">Ambulancia:</p>
      <Line line={same} />
      <button type="button" onClick={revealEmergencies} className="inline-flex min-h-11 w-fit cursor-pointer items-center rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold">
        Ver todos los números de emergencia
      </button>
    </section>
  )
}

/**
 * Orientation when what was asked is about mental health. In a crisis it opens at the top with the numbers one tap
 * away (no searching inside the emergency bar); for the usual search for a psychologist it is a calm line that opens to the
 * same numbers. It gives no clinical advice and takes nothing away from the results.
 */
export const UrgentHelp = ({ context }: { context: MentalHealthContext }) => {
  if (context === "crisis") return <Card crisis />
  if (context === "habitual") {
    return (
      <details className="max-w-prose rounded-xl border border-line-strong bg-card p-3">
        <summary className="min-h-11 cursor-pointer py-2 font-bold">Si necesitás ayuda urgente ahora, tocá acá</summary>
        <div className="mt-2">
          <Card crisis={false} />
        </div>
      </details>
    )
  }
  return null
}
