import { Page } from "@/components/layout/Page"
import { ModelCardSoft } from "./models/ModelCardSoft"
import { ModelCardSoftTiles } from "./models/ModelCardSoftTiles"
import { ButtonStyles } from "./parts/ButtonStyles"
import { ModelSection } from "./parts/ModelSection"

/** Design playground (local only, git-ignored): the Mi Salud screen */
export const MyHealthModels = () => (
  <Page title="Modelos de Mi Salud" description="El carnet a la izquierda y, al lado, dos filas: el perfil y las recomendaciones para tu edad.">
    <ModelSection id="modelo-m3" title="M3 · Igual al M1, botones estilo 3" note="Todos los botones con fondo suave, sin borde y esquinas apenas redondeadas.">
      <ModelCardSoft />
    </ModelSection>
    <ModelSection id="modelo-m4" title="M4 · Igual al M3, carnet con el radio de los botones" note="Las cajitas de datos del carnet con el mismo redondeo que los botones del estilo 3.">
      <ModelCardSoftTiles />
    </ModelSection>
    <ModelSection id="botones" title="Estilos de botones" note="Ninguno con forma de píldora. Cada uno con los botones de la pantalla: principal, secundarios con ícono, fila y perfiles.">
      <ButtonStyles />
    </ModelSection>
  </Page>
)
