import type { ReactNode } from "react"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import { PendingNotice } from "@/components/health/PendingNotice"
import type { CoverageEntry, EsiEntry } from "./SexEducation.coverage"

const labelClass = "m-0 mt-3 text-base font-extrabold"

const Lines = ({ items }: { items: string[] }) => (
  <ul className="m-0 mt-1 flex list-disc flex-col gap-1.5 pl-5">
    {items.map((item) => (
      <li key={item} className="break-words">{item}</li>
    ))}
  </ul>
)

/** What a card says about where its text comes from: only the date of the page's own content, when it has one (the day AuxiliAR read it and that nobody checked it in person are said once, on the page) */
const Footing = ({ sourceDate }: { sourceDate?: string }) => (sourceDate ? <p className="m-0 mt-3 text-sm text-ink-soft">{`Fecha de su contenido: ${sourceDate}.`}</p> : null)

/** What a service of another province or organization offers, for whom, at what cost, how to get it and how to reach it: all inside AuxiliAR */
export const CoverageCard = ({ entry, children }: { entry: CoverageEntry, children?: ReactNode }) => (
  <Disclosure title={entry.title} compact>
    <p className="m-0 text-ink-soft">{entry.by}</p>
    <h5 className={labelClass}>Qué ofrece</h5>
    <Lines items={entry.offers} />
    <h5 className={labelClass}>Para quién</h5>
    <p className="m-0 mt-1">{entry.forWhom}</p>
    <h5 className={labelClass}>Costo y condiciones</h5>
    <p className="m-0 mt-1">{entry.cost}</p>
    <h5 className={labelClass}>Cómo acceder</h5>
    <Lines items={entry.access} />
    <h5 className={labelClass}>Contacto</h5>
    <Lines items={entry.contact} />
    {entry.notes && <Lines items={entry.notes} />}
    {entry.pending && (
      <>
        <h5 className={labelClass}>Para confirmar</h5>
        <Lines items={entry.pending} />
      </>
    )}
    {children}
    {entry.action && (
      <div className="mt-3">
        <OutLink href={entry.action.url}>{entry.action.label}</OutLink>
      </div>
    )}
    {entry.ive && (
      <div className="mt-3">
        <PendingNotice title="Pendiente de validación legal y profesional">
          Este resumen sobre la interrupción del embarazo se hizo con la página oficial y todavía no fue revisado. No es asesoramiento legal ni médico.
        </PendingNotice>
      </div>
    )}
    <Footing sourceDate={entry.sourceDate} />
  </Disclosure>
)

/** The same for the materials and programs of ESI in the schools of a province or of the Nation */
export const EsiCard = ({ entry }: { entry: EsiEntry }) => (
  <Disclosure title={entry.title} compact>
    <p className="m-0 text-ink-soft">{entry.by}</p>
    <h5 className={labelClass}>Qué es</h5>
    <p className="m-0 mt-1">{entry.what}</p>
    <h5 className={labelClass}>Para quién</h5>
    <Lines items={entry.forWhom} />
    <h5 className={labelClass}>Qué materiales hay</h5>
    <Lines items={entry.materials} />
    <h5 className={labelClass}>Cómo acceder</h5>
    <p className="m-0 mt-1">{entry.access}</p>
    <h5 className={labelClass}>Contacto</h5>
    <Lines items={entry.contact} />
    <h5 className={labelClass}>Para confirmar</h5>
    <Lines items={entry.pending} />
    <Footing sourceDate={entry.sourceDate} />
  </Disclosure>
)
