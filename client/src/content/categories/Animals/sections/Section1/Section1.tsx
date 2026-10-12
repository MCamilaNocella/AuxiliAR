import { lazyContent } from "@/components/health/LazyContent"

/** Atención veterinaria · section 1 — see Section1.content.tsx (downloaded when the section is opened) */
export const Section1 = lazyContent(() => import("./Section1.content"))
