import { lazyContent } from "@/components/health/LazyContent"

/** Sobre AuxiliAR — see Section1.content.tsx (downloaded when the page is opened) */
export const Section1 = lazyContent(() => import("./Section1.content"))
