import { Phone } from "lucide-react"
import { EMERGENCY_NUMBERS } from "@/data/emergency"
import type { MentalHealthContext } from "@/utils/places"
import { AVOID_ATTRIBUTE } from "@/utils/auxiAvoidance"
import { revealEmergencies } from "@/utils/revealEmergencies"

/*
 * The numbers are the ones of the emergency bar (src/data/emergency.ts): they are looked up there by number, never typed
 * again here, so there is one list. What emergency.ts does not say - where each one works - is taken from the table of
 * numbers the chat uses (server/.../prompts/numeros.md): 911 and 107 work all over the country; the 135 (prevención del
 * suicidio) only in CABA and Gran Buenos Aires. A test keeps this note and that table in agreement.
 */
const NATIONWIDE = [
  { number: "911", what: "Emergencias" },
  { number: "107", what: "Ambulancia" },
]
const CRISIS_LINE = { number: "135", what: "Hablar con alguien ahora (prevención del suicidio)", where: "Atiende solo en CABA y Gran Buenos Aires." }

const dialOf = (number: string) => EMERGENCY_NUMBERS.find((entry) => entry.number === number)?.number

const CallLink = ({ number, what, primary = false }: { number: string, what: string, primary?: boolean }) => (
  <a
    href={`tel:${number}`}
    aria-label={`Llamar al ${number}: ${what}`}
    className={`inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 py-2 text-lg font-extrabold no-underline ${primary ? "border-brand bg-brand text-on-brand" : "border-control-line bg-field text-ink"}`}
  >
    <Phone aria-hidden="true" className="size-5 shrink-0" />
    <span>{number}</span>
    <span className="text-base font-semibold">{what}</span>
  </a>
)

const Card = ({ crisis }: { crisis: boolean }) => {
  const nationwide = NATIONWIDE.filter(({ number }) => dialOf(number))
  const line = dialOf(CRISIS_LINE.number) ? CRISIS_LINE : null
  // In a crisis, Auxi's bubble and mascot step aside while this card is on screen: nothing may stand between a person and the call
  const avoid = crisis ? { [AVOID_ATTRIBUTE]: "" } : {}
  return (
    <section {...avoid} aria-labelledby="urgent-help-title" className="flex max-w-prose flex-col gap-3 rounded-2xl border-2 border-brand bg-card p-4">
      <h3 id="urgent-help-title" className="m-0 text-lg font-extrabold">
        {crisis ? "Si estás en crisis o pensás en hacerte daño, no esperes: pedí ayuda ahora" : "Ayuda urgente"}
      </h3>
      <p className="m-0">Si hay riesgo para tu vida o la de otra persona, llamá ya. El 911 y el 107 son gratuitos y atienden las 24 horas.</p>
      <div className="flex flex-wrap gap-2">
        {nationwide.map(({ number, what }, index) => (
          <CallLink key={number} number={number} what={what} primary={index === 0} />
        ))}
      </div>
      {line && (
        <div className="flex flex-col items-start gap-1">
          <CallLink number={line.number} what={line.what} />
          <p className="m-0 text-ink-soft">{line.where} Si estás en otro lugar, llamá al 911 o al 107.</p>
        </div>
      )}
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
