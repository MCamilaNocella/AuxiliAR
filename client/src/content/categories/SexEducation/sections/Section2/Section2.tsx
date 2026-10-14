import { lazyContent } from "@/components/health/LazyContent"

/** Salud sexual y ESI · Orientación y ayuda — see Section2.content.tsx (downloaded when the category opens) */
export const Section2 = lazyContent(() => import("./Section2.content"))
