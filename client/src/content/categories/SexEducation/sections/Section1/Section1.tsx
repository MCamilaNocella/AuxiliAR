import { lazyContent } from "@/components/health/LazyContent"

/** Salud sexual y ESI · ¿Qué es la ESI? — see Section1.content.tsx (downloaded when the category opens) */
export const Section1 = lazyContent(() => import("./Section1.content"))
