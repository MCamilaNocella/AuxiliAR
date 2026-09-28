import type { SkipLinkProps } from "./SkipLink.types"

/** Link para teclado y lectores de pantalla: solo aparece al recibir foco. */
export const SkipLink = ({ targetId }: SkipLinkProps) => (
  <a
    href={`#${targetId}`}
    className="fixed top-2 left-4 z-50 -translate-y-[200%] rounded-lg bg-ink px-4 py-2 text-surface no-underline focus:translate-y-0 focus:text-surface"
  >
    Saltar al contenido
  </a>
)
