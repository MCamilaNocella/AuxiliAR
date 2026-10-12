import { lazyContent } from "@/components/health/LazyContent"

/** Salud mental · section 6 — see Section6.content.tsx (downloaded when the section is opened) */
export const Section6 = lazyContent(() => import("./Section6.content"))
