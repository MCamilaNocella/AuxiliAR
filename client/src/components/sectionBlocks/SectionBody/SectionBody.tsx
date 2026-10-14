import { BlockLookContext } from "../BlockLook"
import { SectionSources } from "../SectionSources"
import type { SectionBodyProps } from "./SectionBody.types"

/** Body of a section in the design of the category models: its blocks, then "Fuentes oficiales" and the general notice */
export const SectionBody = ({ sources = [], look = "classic", noNotice = false, children }: SectionBodyProps) => (
  <BlockLookContext value={look}>
    <div className="mt-12 flex max-w-[62rem] flex-col gap-12 @container">
      {children}
      {sources.length > 0 && <SectionSources sources={sources} />}
      {!noNotice && <p className="m-0 text-sm text-muted">Información general, orientativa: no reemplaza la consulta con un equipo de salud.</p>}
    </div>
  </BlockLookContext>
)
