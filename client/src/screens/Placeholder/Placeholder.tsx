import { Page } from "@/components/layout/Page"
import type { PlaceholderProps } from "./Placeholder.types"

/** Temporary screen while each section is being built. */
export const Placeholder = ({ title }: PlaceholderProps) => (
  <Page title={title}>
    <p className="text-muted">Sección en construcción.</p>
  </Page>
)
