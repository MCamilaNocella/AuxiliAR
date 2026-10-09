import { Link } from "react-router"
import { Page } from "@/components/layout/Page"
import { PATHS } from "@/router/paths"

/** Any address the app doesn't have: says so and offers the way back, inside the normal layout (header, emergency bar, navigation) */
export const NotFound = () => (
  <Page title="No encontramos esta página" description="Puede que el enlace esté mal escrito o que la página ya no exista.">
    <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
      <li>
        <Link to={PATHS.home} className="inline-flex min-h-11 items-center font-bold">
          Volver al inicio
        </Link>
      </li>
      <li>
        <Link to={PATHS.centers} className="inline-flex min-h-11 items-center">
          Encontrar atención
        </Link>
      </li>
      <li>
        <Link to={PATHS.firstAid} className="inline-flex min-h-11 items-center">
          Primeros auxilios
        </Link>
      </li>
    </ul>
  </Page>
)
