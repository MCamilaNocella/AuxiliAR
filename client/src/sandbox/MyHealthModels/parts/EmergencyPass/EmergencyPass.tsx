import { Maximize2, Pencil, Printer, ShieldPlus } from "lucide-react"
import { ID_CARD_FIELDS, RECORD_FIELDS } from "./EmergencyPass.constants"
import { useSoftButtons } from "../../useButtonLook"
import type { EmergencyPassProps } from "./EmergencyPass.types"

/**
 * "Mi ficha para emergencias" as an ID card: red header band, the fields as little tiles.
 * `solid`: the whole card red (for when it must stand out the most).
 * `identity`: adds name and age as the first row, with the ID card order of fields after them.
 * `flatBottom`: square bottom corners, for accent bars right under it.
 * `tileRadius`: corner radius of the data tiles (e.g. to match the buttons).
 * Missing important data (allergies, contact) is flagged; the rest just says it's empty.
 */
export const EmergencyPass = ({ record, solid = false, identity, flatBottom = false, tileRadius = "rounded-2xl" }: EmergencyPassProps) => {
  const tiles = [
    ...(identity
      ? [
          { key: "name", label: "Nombre", value: identity.name, important: false },
          { key: "age", label: "Edad", value: identity.age === undefined ? undefined : `${identity.age} años`, important: false },
        ]
      : []),
    ...(identity ? ID_CARD_FIELDS : RECORD_FIELDS).map(({ key, label, important }) => ({ key, label, value: record[key], important: Boolean(important) })),
  ]

  const soft = useSoftButtons()
  const action = soft
    ? solid
      ? "rounded-lg border-transparent bg-on-alert/15 text-on-alert hover:bg-on-alert/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"
      : "rounded-lg border-transparent bg-brand-soft text-brand hover:bg-field in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
    : solid
      ? "rounded-full border-on-alert/70 bg-transparent text-on-alert hover:bg-on-alert/10"
      : "rounded-full border-control-line bg-card text-ink hover:bg-field"
  // "Editar" sits on the red band
  const onBand = soft
    ? "rounded-lg border-transparent bg-on-alert/15 hover:bg-on-alert/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-alert"
    : "rounded-full border-on-alert/70 bg-transparent hover:bg-on-alert/10"

  return (
    <section
      aria-label="Mi ficha para emergencias"
      className={`flex h-full flex-col overflow-hidden shadow-sm ${flatBottom ? "rounded-t-3xl" : "rounded-3xl"} ${solid ? "bg-linear-to-br from-alert to-alert-dark text-on-alert" : "border border-alert-card-line bg-alert-soft text-ink"}`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3.5 ${solid ? "" : "bg-alert text-on-alert"}`}>
        <h3 className="m-0 flex items-center gap-2.5 text-xl/tight font-extrabold">
          <ShieldPlus aria-hidden="true" className="size-7 flex-none" />
          Mi ficha para emergencias
        </h3>
        <button
          type="button"
          className={`flex min-h-10 cursor-pointer items-center gap-1.5 border px-3.5 py-1.5 text-sm font-bold text-on-alert transition-colors ${onBand}`}
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
              <div key={key} className={`min-w-0 bg-card px-3.5 py-2.5 text-ink ${tileRadius} ${missing ? "ring-2 ring-alert" : ""}`}>
                <dt className="text-xs font-bold tracking-wide text-muted uppercase">{label}</dt>
                <dd className={`m-0 wrap-break-word ${value ? "text-lg font-extrabold" : missing ? "font-bold text-alert-text" : "text-muted"}`}>
                  {value ?? (important ? "Falta agregar" : "Sin completar")}
                </dd>
              </div>
            )
          })}
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <button type="button" className={`flex min-h-10 cursor-pointer items-center gap-2 border px-4 py-1.5 text-sm font-bold transition-colors ${action}`}>
            <Maximize2 aria-hidden="true" className="size-4 flex-none" />
            Mostrar en pantalla completa
          </button>
          <button type="button" className={`flex min-h-10 cursor-pointer items-center gap-2 border px-4 py-1.5 text-sm font-bold transition-colors ${action}`}>
            <Printer aria-hidden="true" className="size-4 flex-none" />
            Imprimir
          </button>
        </div>
        <p className={`m-0 text-sm ${solid ? "" : "text-muted"}`}>Para mostrarle al médico o a la ambulancia.</p>
      </div>
    </section>
  )
}
