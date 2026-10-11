import { Phone } from "lucide-react"
import { NATIONAL_LINE, READ_ON } from "./SexEducation.coverage"

const formatRead = () => {
  const [year, month, day] = READ_ON.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** The national line of salud sexual, said inside AuxiliAR: what it is, who answers, hours, and a call button. It is not an emergency line (those are in the emergency bar, untouched) */
export const NationalLine = () => (
  <div className="rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
    <p className="m-0 font-extrabold">{NATIONAL_LINE.title}</p>
    <p className="m-0 text-ink-soft">{NATIONAL_LINE.by}</p>
    <p className="m-0 mt-2">{NATIONAL_LINE.what}</p>
    <p className="m-0 mt-2">{`Para quién: ${NATIONAL_LINE.forWhom}`}</p>
    <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5">
      {[...NATIONAL_LINE.hours, ...NATIONAL_LINE.notes].map((line) => (
        <li key={line} className="break-words">{line}</li>
      ))}
      <li>{`Correo: ${NATIONAL_LINE.email}`}</li>
    </ul>
    <div className="mt-3 flex flex-col sm:flex-row">
      <a
        href={`tel:${NATIONAL_LINE.tel}`}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-control-line bg-brand px-4 py-2 text-center font-extrabold text-on-brand no-underline hover:bg-brand-dark hover:text-on-brand"
      >
        <Phone aria-hidden="true" className="size-4 shrink-0" />
        {`Llamar al ${NATIONAL_LINE.phone}`}
      </a>
    </div>
    <p className="m-0 mt-2 text-sm text-ink-soft">
      {`Para confirmar: ${NATIONAL_LINE.pending.join(" ")} Según la página del Ministerio, leída el ${formatRead()} con una herramienta de lectura automática. No es una línea de emergencia: ante un riesgo inmediato usá los números de la barra de emergencias.`}
    </p>
  </div>
)
