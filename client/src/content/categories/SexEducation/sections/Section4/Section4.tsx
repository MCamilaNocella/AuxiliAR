import { lazyContent } from "@/components/health/LazyContent"

/** Salud sexual y ESI · Interrupción voluntaria y legal del embarazo (IVE/ILE) — see Section4.content.tsx (downloaded when the section is opened) */
export const Section4 = lazyContent(() => import("./Section4.content"))
