import { lazyContent } from "@/components/health/LazyContent"

/** Primeros auxilios · Malestares — see Section3.content.tsx (downloaded when the category opens) */
export const Section3 = lazyContent(() => import("./Section3.content"))
