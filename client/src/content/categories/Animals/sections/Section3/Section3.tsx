import { lazyContent } from "@/components/health/LazyContent"

/** Atención veterinaria · Dónde atenderlo — see Section3.content.tsx (downloaded when the category opens) */
export const Section3 = lazyContent(() => import("./Section3.content"))
