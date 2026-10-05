import { Page } from "@/components/layout/Page"
import { BUBBLE_CONTEXTS, BUBBLE_VARIANTS } from "./AuxiBubbleVariants.constants"
import { BubbleStage } from "./AuxiBubbleVariants.parts"
import { setBubblePreview, useBubblePreview } from "./AuxiBubbleVariants.store"

/**
 * DEMO-ONLY design tool (branch demo/ux-review, never for main): the help bubble in five versions, each one
 * over the home gradient and the theme surface. Only by link (/auxi-burbujas), not in the nav.
 * "Probar en la app" puts a version on the floating Auxi, which then follows you through the whole app.
 * Use "Ver mejor" for the light, dark and high contrast themes, and narrow the window to test mobile.
 */
export const AuxiBubbleVariants = () => {
  const selectedId = useBubblePreview()
  const selected = BUBBLE_VARIANTS.find(({ id }) => id === selectedId)

  return (
    <Page title="Comparación de burbujas de Auxi — solo para revisión" description="Probá los temas con «Ver mejor» y achicá la ventana para ver mobile.">
      {/* React 19 moves this to <head>: keeps the page out of search engines */}
      <meta name="robots" content="noindex, nofollow" />
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card p-4">
        <p className="m-0 flex-1 text-muted" aria-live="polite">
          {selected
            ? `En el bot flotante: ${selected.name}. Navegá por la app (menú de abajo) para verla sobre las pantallas reales. Tocá a Auxi para que la burbuja vuelva a salir.`
            : "Tocá «Probar en la app» en una variante y el bot flotante de abajo a la derecha la va a usar en toda la app. Se pierde al recargar la página."}
        </p>
        <button
          type="button"
          onClick={() => setBubblePreview(null)}
          disabled={!selected}
          className="cursor-pointer rounded-full bg-brand px-4 py-2 font-bold text-on-brand disabled:cursor-default disabled:opacity-50"
        >
          Volver al original
        </button>
      </div>

      {BUBBLE_CONTEXTS.map((context) => (
        <section key={context.id} aria-labelledby={`ctx-${context.id}`} className="mt-8 first:mt-0">
          <h2 id={`ctx-${context.id}`} className="m-0 text-xl font-extrabold">{context.name}</h2>
          <p className="m-0 mt-1 mb-3 text-muted">{context.note}</p>
          <ul role="list" className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {BUBBLE_VARIANTS.map((variant) => {
              const active = variant.id === selectedId
              return (
                <li key={variant.id} className="flex flex-col gap-2">
                  <div className={`overflow-hidden rounded-2xl border border-line ${context.surfaceClassName}`}>
                    <BubbleStage variant={variant} withCard={context.withCard} />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="m-0 text-base font-extrabold">{variant.name}</h3>
                      {variant.badge && (
                        <p className="m-0 mt-1 mb-1 inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-extrabold text-brand">{variant.badge}</p>
                      )}
                      <p className="m-0 text-sm text-muted">{variant.note}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBubblePreview(variant.id)}
                      aria-pressed={active}
                      className={`cursor-pointer rounded-full border-2 px-3 py-1 text-sm font-bold ${active ? "border-brand bg-brand-soft text-brand" : "border-control-line text-ink hover:bg-field"}`}
                    >
                      {active ? "En la app ✓" : "Probar en la app"}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </Page>
  )
}
