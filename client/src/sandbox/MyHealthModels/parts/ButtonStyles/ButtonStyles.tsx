import { ArrowRight, Pencil, Printer } from "lucide-react"
import { BUTTON_STYLES } from "./ButtonStyles.constants"

/** Catalog of button styles, each shown with the buttons the Mi Salud screen uses */
export const ButtonStyles = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-5">
    {BUTTON_STYLES.map(({ id, name, description, primary, secondary, row, chipOn, chipOff }) => (
      <section key={id} aria-labelledby={`button-style-${id}`} className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5">
        <div>
          <h3 id={`button-style-${id}`} className="m-0 text-lg font-extrabold">
            {name}
          </h3>
          <p className="m-0 mt-1 text-sm text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={primary}>
            Agregarlo ahora
          </button>
          <button type="button" className={secondary}>
            <Pencil aria-hidden="true" className="size-4 flex-none" />
            Editar
          </button>
          <button type="button" className={secondary}>
            <Printer aria-hidden="true" className="size-4 flex-none" />
            Imprimir
          </button>
        </div>
        <button type="button" className={row}>
          Agregar contacto de emergencia
          <ArrowRight aria-hidden="true" className="size-4 flex-none text-brand" />
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed="true" className={chipOn}>
            Federico
          </button>
          <button type="button" aria-pressed="false" className={chipOff}>
            Mamá
          </button>
        </div>
      </section>
    ))}
  </div>
)
