import { lazyContent } from "@/components/health/LazyContent"

/** Salud general · Calendario de vacunación — see Section5.content.tsx (downloaded when the section is opened) */
export const Section5 = lazyContent(() => import("./Section5.content"))
