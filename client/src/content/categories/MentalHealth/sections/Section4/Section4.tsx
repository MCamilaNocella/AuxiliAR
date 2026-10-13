import { lazyContent } from "@/components/health/LazyContent"

/** Salud mental · section 4 — see Section4.content.tsx (downloaded when the section is opened) */
export const Section4 = lazyContent(() => import("./Section4.content"))
