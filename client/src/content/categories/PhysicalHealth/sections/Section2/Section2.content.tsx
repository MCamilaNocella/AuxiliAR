import { PendingNotice } from "@/components/health/PendingNotice"
import { CONTROLS_NOTICE_TEXT, CONTROLS_NOTICE_TITLE, CONTROLS_READ_ON, FREQUENCY_BLOCKS } from "./Section2.constants"

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * Salud general · Controles de salud. Information only, with no buttons and no links: for each control (salud bucal, salud visual, corazón,
 * vacunas and chequeos generales) how often the official pages recommend it, as they say it, and what they leave open. Who needs which control and
 * how often is for each person's health team to say. The sources are in Sobre AuxiliAR.
 */
export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Cada cuánto conviene hacerte estos controles, según las recomendaciones generales de organismos oficiales. Es solo información: lo que te corresponde a vos lo define tu equipo de salud, según tu edad, tus antecedentes y tu situación.
      </p>

      {FREQUENCY_BLOCKS.map(({ id, title, icon: Icon, items, pending }) => (
        <section key={id} aria-labelledby={`control-${id}`} className="rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
          <h3 id={`control-${id}`} className="m-0 flex items-center gap-2 text-xl font-extrabold">
            <Icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
            {title}
          </h3>
          <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-5">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {pending && (
            <>
              <h4 className="m-0 mt-4 text-base font-extrabold">Lo que no encontramos</h4>
              <ul className="m-0 mt-1 flex list-disc flex-col gap-2 pl-5 text-ink-soft">
                {pending.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      ))}

      <PendingNotice title={CONTROLS_NOTICE_TITLE}>{CONTROLS_NOTICE_TEXT}</PendingNotice>

      <p className="m-0 text-sm text-ink-soft">
        {`Datos de páginas oficiales del Ministerio de Salud de la Nación y del Gobierno de la Ciudad de Buenos Aires, consultadas el ${formatDate(CONTROLS_READ_ON)}. Las fuentes están en Sobre AuxiliAR. Esta información es orientativa y no reemplaza la consulta con un equipo de salud.`}
      </p>
    </div>
  )
}
