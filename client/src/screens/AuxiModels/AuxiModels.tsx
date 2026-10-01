import { useEffect, useState } from "react"
import { Auxi } from "@/components/help/Auxi"
import { Page } from "@/components/layout/Page"
import { CATEGORIES } from "@/content/categories"
import { setAuxiPreview } from "@/hooks/useAuxiPreview"
import { CATEGORY_MODELS, FIRST_MODELS } from "./AuxiModels.constants"
import type { AuxiModel, AuxiVariant } from "./AuxiModels.types"

type PickerProps = {
  selectedId: string | null
  onSelect: (variant: AuxiVariant) => void
}

const ModelCard = ({ model, selectedId, onSelect, large = false }: PickerProps & { model: AuxiModel, large?: boolean }) => (
  <article className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4">
    <div>
      <h3 className="m-0 text-lg font-extrabold">{model.name}</h3>
      <p className="m-0 mt-1 text-muted">{model.description}</p>
    </div>
    <div className="flex flex-wrap justify-around gap-2">
      {model.variants.map((variant) => {
        const selected = variant.id === selectedId
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant)}
            aria-pressed={selected}
            aria-label={`Probar ${model.name}${variant.label ? ` (${variant.label})` : ""} en el bot flotante`}
            // Extra padding: accessories can stick out of Auxi's box
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 p-4 transition-colors hover:bg-surface-alt ${selected ? "border-brand bg-brand-soft" : "border-transparent"}`}
          >
            <Auxi className={large ? "w-36 sm:w-48" : "w-24 sm:w-32"} {...variant.extras} />
            {variant.label && <span className="text-sm font-bold text-ink-soft">{variant.label}</span>}
            {selected && <span className="text-sm font-bold text-brand">En el bot ✓</span>}
          </button>
        )
      })}
    </div>
  </article>
)

const Section = ({ title, models, ...picker }: PickerProps & { title: string, models: AuxiModel[] }) => (
  <section className="mt-12">
    <h2 className="m-0 mb-3 text-xl font-extrabold">{title}</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => <ModelCard key={model.id} model={model} {...picker} />)}
    </div>
  </section>
)

/** Design playground: variations of Auxi. Tapping one previews it on the floating help bot. Not linked from the nav. */
export const AuxiModels = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const select = (variant: AuxiVariant) => {
    setSelectedId(variant.id)
    setAuxiPreview(variant.extras)
  }

  const reset = () => {
    setSelectedId(null)
    setAuxiPreview(null)
  }

  // Leaving the page puts the regular Auxi back on the floating bot
  useEffect(() => () => setAuxiPreview(null), [])

  const picker = { selectedId, onSelect: select }

  return (
    <Page title="Modelos de Auxi" description="Tocá un Auxi para probarlo en el bot flotante de abajo a la derecha.">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-4">
        <Auxi className="w-20 sm:w-24" />
        <p className="m-0 flex-1 text-muted">Así es Auxi hoy, con el círculo celeste. Cuando salgas de esta página, el bot vuelve a ser el de siempre.</p>
        <button
          type="button"
          onClick={reset}
          disabled={selectedId === null}
          className="cursor-pointer rounded-full bg-brand px-4 py-2 font-bold text-on-brand disabled:cursor-default disabled:opacity-50"
        >
          Volver al original
        </button>
      </div>

      <h2 className="m-0 mt-8 text-2xl font-extrabold">Por categoría</h2>
      <p className="m-0 mt-1 text-muted">Todos con la cruz blanca.</p>
      {CATEGORY_MODELS.map(({ categoryId, models }) => {
        const category = CATEGORIES.find(({ id }) => id === categoryId)
        if (!category) return null
        const Icon = category.icon
        return (
          <section key={categoryId} className="mt-6">
            <h3 className="m-0 mb-3 flex items-center gap-2 text-xl font-extrabold">
              <Icon aria-hidden="true" className="size-[1.2em] text-brand" />
              {category.title}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {models.map((model) => <ModelCard key={model.id} model={model} large {...picker} />)}
            </div>
          </section>
        )
      })}

      <Section title="De la primera tanda" models={FIRST_MODELS} {...picker} />
    </Page>
  )
}
