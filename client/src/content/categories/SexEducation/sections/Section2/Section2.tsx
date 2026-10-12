import { lazyContent } from "@/components/health/LazyContent"

/** Salud sexual y ESI · section 2 — see Section2.content.tsx (downloaded when the section is opened) */
export const Section2 = lazyContent(() => import("./Section2.content"))
