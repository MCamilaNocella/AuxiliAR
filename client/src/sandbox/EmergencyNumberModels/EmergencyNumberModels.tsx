import { Page } from "@/components/layout/Page"
import { BAR_FRAMES, NUMBER_FRAMES, NUMBERS } from "./EmergencyNumberModels.constants"
import {
  FirstAidOutline,
  FirstAidRedBottom,
  FirstAidRedEdge,
  FirstAidSolidBrand,
  FirstAidStepByStep,
} from "./models/FirstAid"
import { LabelOnTopBigNumber, LabelOnTopBigTitle } from "./models/LabelOnTop"
import { BarPreview } from "./parts/BarPreview"
import { ModelSection } from "./parts/ModelSection"

/** Design playground (local only, git-ignored): the emergency number cards and the whole bar */
export const EmergencyNumberModels = () => (
  <Page title="Modelos de números de emergencia" description="Cada modelo a lo ancho de la barra en la compu y en el celu.">
    <ModelSection
      id="modelo-n3a"
      title="N3a · Nombre como título, número grande"
      note="El nombre arriba, chiquito, y abajo el teléfono con el número grande. Todos los números quedan a la misma altura aunque el nombre ocupe 1 o 2 líneas."
      frames={NUMBER_FRAMES}
    >
      <LabelOnTopBigNumber numbers={NUMBERS} />
    </ModelSection>
    <ModelSection
      id="modelo-n3b"
      title="N3b · Nombre como título, más grande"
      note="Igual al N3a, pero el nombre más grande y el número y el teléfono más chicos. Es el que está ahora en la barra de arriba de esta página."
      frames={NUMBER_FRAMES}
    >
      <LabelOnTopBigTitle numbers={NUMBERS} />
    </ModelSection>

    <h2 className="m-0 mt-16 text-2xl font-extrabold">Barra completa: cómo destacar primeros auxilios</h2>
    <p className="m-0 mt-1 max-w-3xl text-muted">
      Los números quedan como están ahora; solo cambia la columna de primeros auxilios. Ninguno le agrega fondo a la sección.
    </p>
    <ModelSection
      id="modelo-f1"
      title="F1 · Borde rojo al costado"
      note="Las tarjetas claras de siempre, con un borde rojo grueso a la izquierda. El título pasa a rojo, como el de los números (en todos los modelos)."
      frames={BAR_FRAMES}
    >
      <BarPreview FirstAid={FirstAidRedEdge} />
    </ModelSection>
    <ModelSection
      id="modelo-f2"
      title="F2 · Contorno rojo"
      note="Borde rojo grueso y texto rojo. Al pasar el mouse se llenan de rojo, como los números."
      frames={BAR_FRAMES}
    >
      <BarPreview FirstAid={FirstAidOutline} />
    </ModelSection>
    <ModelSection
      id="modelo-f3"
      title="F3 · Línea roja abajo"
      note="Las tarjetas claras de siempre, con una línea roja gruesa en el borde de abajo."
      frames={BAR_FRAMES}
    >
      <BarPreview FirstAid={FirstAidRedBottom} />
    </ModelSection>
    <ModelSection
      id="modelo-f4"
      title="F4 · Bordó lleno"
      note="Tarjetas llenas con el bordó de la marca: resaltan tanto como los números pero no se confunden con ellos."
      frames={BAR_FRAMES}
    >
      <BarPreview FirstAid={FirstAidSolidBrand} />
    </ModelSection>
    <ModelSection
      id="modelo-f5"
      title="F5 · Título más grande + «Paso a paso»"
      note="El título un poco más grande, y cada tarjeta con dos líneas: la guía y un «Paso a paso» en rojo."
      frames={BAR_FRAMES}
    >
      <BarPreview FirstAid={FirstAidStepByStep} />
    </ModelSection>
  </Page>
)
