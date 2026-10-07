import { Link, useLocation, useNavigate } from "react-router"
import { ArrowLeft, ExternalLink, OctagonX, Phone, Siren } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { CALL_INFO, FIRST_AID_HUB_PATH, getFirstAidGuide } from "@/content/firstAid"
import type { FirstAidGuideContent } from "@/content/firstAid"
import { PATHS } from "@/router/paths"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { GuideIcon } from "../guideIcons"

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const Heading = ({ children }: { children: React.ReactNode }) => <h2 className="m-0 mb-3 text-xl font-extrabold">{children}</h2>

/** The call-for-help block: it doesn't name a number (they depend on where you are) but opens the app's emergency numbers */
const CallForHelp = () => (
  <div className="mt-5 rounded-2xl border-2 border-alert-card-line bg-alert-soft p-4">
    <p className="m-0 flex items-start gap-2 text-lg font-extrabold text-alert-text">
      <Siren aria-hidden="true" className="mt-0.5 size-6 shrink-0" />
      Si es una emergencia, llamá o pedí que llamen al número de emergencias de tu localidad.
    </p>
    <button
      type="button"
      onClick={revealEmergencies}
      className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-alert px-4 py-2 font-extrabold text-on-alert hover:bg-alert-dark"
    >
      <Phone aria-hidden="true" className="size-5 shrink-0" />
      Ver números de emergencia
    </button>
  </div>
)

const BackLink = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Came from inside the app: back goes where the person was. Opened from a link: to the guides
  const cameFromApp = location.key !== "default"
  const className = "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-control-line bg-field px-4 py-2 font-bold text-ink no-underline hover:bg-line-strong hover:text-ink"
  return cameFromApp ? (
    <button type="button" onClick={() => navigate(-1)} className={className}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      Volver
    </button>
  ) : (
    <Link to={FIRST_AID_HUB_PATH} className={className}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      Guías de primeros auxilios
    </Link>
  )
}

/**
 * One first aid guide, always laid out the same way: what it is → important signs → what to do now (numbered steps)
 * → what NOT to do → when to ask for help → source and review. Pure presentation of the content in
 * src/content/firstAid; it adds no instruction of its own.
 */
export const FirstAidGuide = ({ guide }: { guide: FirstAidGuideContent }) => {
  const related = (guide.related ?? []).map((slug) => getFirstAidGuide(slug)).filter((item) => item !== undefined)

  return (
    <article className="mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6">
      <BackLink />

      <h1 className="m-0 mt-5 flex items-start gap-3 text-2xl font-extrabold sm:text-3xl">
        <GuideIcon slug={guide.slug} className="mt-1 size-8 shrink-0 text-brand" />
        {guide.title}
      </h1>
      <p className="m-0 mt-3 text-lg text-ink-soft">{guide.summary}</p>

      {guide.callFirst && <CallForHelp />}

      {guide.signs && (
        <section aria-labelledby="guide-signs" className="mt-8">
          <h2 id="guide-signs" className="m-0 mb-3 text-xl font-extrabold">
            {guide.signs.title}
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg">
            {guide.signs.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.extraSigns?.map(({ title, items }) => (
        <section key={title} aria-label={title} className="mt-8">
          <Heading>{title}</Heading>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {guide.checklists?.map(({ title, items }) => (
        <section key={title} aria-label={title} className="mt-8">
          <Heading>{title}</Heading>
          <ul role="list" className="m-0 flex list-none flex-col gap-2 p-0">
            {items.map(({ name, use }) => (
              <li key={name} className="rounded-xl border border-line-strong bg-card px-4 py-3">
                <span className="font-bold">{name}</span>
                {use && <span className="block text-ink-soft">{use}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {guide.stepSets && guide.stepSets.length > 0 && (
        <section aria-labelledby="guide-steps" className="mt-8">
          <h2 id="guide-steps" className="m-0 mb-3 text-xl font-extrabold">
            {guide.stepsTitle ?? "¿Qué hago ahora?"}
          </h2>
          <div className="flex flex-col gap-6">
            {guide.stepSets.map(({ label, steps }) => (
              <div key={label ?? "steps"}>
                {label && <h3 className="m-0 mb-2 text-lg font-extrabold text-brand">{label}</h3>}
                <ol role="list" className="m-0 flex list-none flex-col gap-3 p-0">
                  {steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-on-brand">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-lg">
                        <span className="sr-only">{`Paso ${index + 1}: `}</span>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}

      {guide.dont && guide.dont.length > 0 && (
        <section aria-labelledby="guide-dont" className="mt-8 rounded-2xl border-2 border-alert-card-line bg-alert-soft p-4">
          <h2 id="guide-dont" className="m-0 mb-3 flex items-center gap-2 text-xl font-extrabold text-alert-text">
            <OctagonX aria-hidden="true" className="size-6 shrink-0" />
            Qué NO hacer
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg">
            {guide.dont.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.whenToCall && guide.whenToCall.length > 0 && (
        <section aria-labelledby="guide-when" className="mt-8">
          <h2 id="guide-when" className="m-0 mb-3 text-xl font-extrabold">
            Cuándo pedir ayuda
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg">
            {guide.whenToCall.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.whileWaiting && guide.whileWaiting.length > 0 && (
        <section aria-labelledby="guide-waiting" className="mt-8">
          <h2 id="guide-waiting" className="m-0 mb-3 text-xl font-extrabold">
            Mientras llega la ayuda
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg">
            {guide.whileWaiting.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.actions && guide.actions.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {guide.actions.map(({ label, tel, to }) =>
            tel ? (
              <a
                key={label}
                href={`tel:${tel}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-alert px-4 py-2 text-center font-extrabold text-on-alert no-underline hover:bg-alert-dark hover:text-on-alert"
              >
                <Phone aria-hidden="true" className="size-5 shrink-0" />
                {label}
              </a>
            ) : (
              <ActionLink key={label} to={to}>
                {label}
              </ActionLink>
            ),
          )}
        </div>
      )}

      {guide.callFirst && (
        <section aria-labelledby="guide-call" className="mt-8 rounded-2xl border border-line-strong bg-card p-4">
          <h2 id="guide-call" className="m-0 mb-2 text-lg font-extrabold">
            Qué decir cuando llamás
          </h2>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
            {CALL_INFO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.note && <p className="m-0 mt-8 rounded-xl border border-line-strong bg-surface-alt p-4 text-ink-soft">{guide.note}</p>}

      {related.length > 0 && (
        <section aria-labelledby="guide-related" className="mt-8">
          <h2 id="guide-related" className="m-0 mb-3 text-xl font-extrabold">
            También te puede servir
          </h2>
          <ul role="list" className="m-0 flex list-none flex-wrap gap-2 p-0">
            {related.map((item) => (
              <li key={item.slug}>
                <ActionLink to={PATHS.firstAidGuide(item.slug)}>{item.title}</ActionLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="guide-source" className="mt-10 border-t border-line-strong pt-4 text-ink-soft">
        <h2 id="guide-source" className="m-0 mb-2 text-base font-extrabold text-ink">
          Fuente oficial y revisión
        </h2>
        <ul role="list" className="m-0 flex list-none flex-col gap-1 p-0">
          {guide.sources.map(({ label, url }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-bold">
                {label}
                <ExternalLink aria-hidden="true" className="mt-1 size-4 shrink-0" />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-2">{`Contenido comparado con estas fuentes el ${formatDate(guide.checkedAt)}. Esta guía es una ayuda inicial: no reemplaza la atención de un equipo de salud ni la capacitación en primeros auxilios.`}</p>
      </section>
    </article>
  )
}
