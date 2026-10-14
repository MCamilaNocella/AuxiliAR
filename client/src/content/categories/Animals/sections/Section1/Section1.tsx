import { lazyContent } from "@/components/health/LazyContent"

/** Atención veterinaria · Bienestar y cuidados — see Section1.content.tsx (downloaded when the category opens) */
export const Section1 = lazyContent(() => import("./Section1.content"))
