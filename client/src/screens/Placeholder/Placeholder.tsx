import { Page } from "@/components/layout/Page"
import type { PlaceholderProps } from "./Placeholder.types"

/** Pantalla temporal mientras se construye cada sección. */
export const Placeholder = ({ title }: PlaceholderProps) => (
  <Page title={title}>
    <p className="text-muted">Sección en construcción.</p>
  </Page>
)
