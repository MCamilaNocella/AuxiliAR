import { lazyContent } from "@/components/health/LazyContent"

/** Salud general · Primeros auxilios — see Section3.content.tsx (downloaded when the section is opened) */
export const Section3 = lazyContent(() => import("./Section3.content"))
