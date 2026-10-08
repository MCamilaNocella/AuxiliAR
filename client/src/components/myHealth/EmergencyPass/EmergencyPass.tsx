import { Maximize2, Pencil, Printer, ShieldPlus } from "lucide-react"
import { RECORD_FIELDS } from "./EmergencyPass.constants"
import type { EmergencyPassProps } from "./EmergencyPass.types"

const actionClass =
  "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-soft px-4 py-1.5 text-sm font-bold text-brand transition-colors hover:bg-field in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"

/**
 * "Mi ficha para emergencias" as an ID card: red header band, then name, age and the record as little tiles.
 * Missing important data (allergies, contact) is flagged; the rest just says it's empty.
 */
export const EmergencyPass = ({ name, age, record }: EmergencyPassProps) => {
  const tiles = [
    { key: "name", label: "Nombre", value: name, important: false },
    { key: "age", label: "Edad", value: age === undefined ? undefined : `${age} años`, important: false },
    ...RECORD_FIELDS.map(({ key, label, important }) => ({ key, label, value: record[key], important: Boolean(important) })),
  ]

  return (
    <section aria-labelledby="emergency-pass-title" className="flex h-full flex-col overflow-hidden rounded-3xl border border-alert-card-line bg-alert-soft text-ink shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-alert px-5 py-3.5 text-on-alert">
        <h2 id="emergency-pass-title" className="m-0 flex items-center gap-2.5 text-xl/tight font-extrabold">
          <ShieldPlus aria-hidden="true" className="size-7 flex-none" />
          Mi ficha para emergencias
        </h2>
        <button
          type="button"
          className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-on-alert/15 px-3.5 py-1.5 text-sm font-bold text-on-alert transition-colors hover:bg-on-alert/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"
        >
          <Pencil aria-hidden="true" className="size-4 flex-none" />
          Editar
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
        <dl className="m-0 grid grid-cols-[repeat(auto-fill,minmax(max(min(100%,7rem),calc((100%-0.75rem)/2)),1fr))] gap-3">
          {tiles.map(({ key, label, value, important }) => {
            const missing = !value && important
            return (
              <div key={key} className={`min-w-0 rounded-2xl bg-card px-3.5 py-2.5 text-ink ${missing ? "ring-2 ring-alert" : ""}`}>
                <dt className="text-xs font-bold tracking-wide text-muted uppercase">{label}</dt>
                <dd className={`m-0 wrap-break-word ${value ? "text-lg font-extrabold" : missing ? "font-bold text-alert-text" : "text-muted"}`}>
                  {value ?? (important ? "Falta agregar" : "Sin completar")}
                </dd>
              </div>
            )
          })}
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <button type="button" className={actionClass}>
            <Maximize2 aria-hidden="true" className="size-4 flex-none" />
            Mostrar en pantalla completa
          </button>
          <button type="button" className={actionClass}>
            <Printer aria-hidden="true" className="size-4 flex-none" />
            Imprimir
          </button>
        </div>
        <p className="m-0 text-sm text-muted">Para mostrarle al médico o a la ambulancia.</p>
      </div>
    </section>
  )
}
