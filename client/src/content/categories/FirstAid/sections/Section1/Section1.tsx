import { lazyContent } from "@/components/health/LazyContent"

/** Primeros auxilios · Guías de primeros auxilios — see Section1.content.tsx (downloaded when the section is opened) */
export const Section1 = lazyContent(() => import("./Section1.content"))
