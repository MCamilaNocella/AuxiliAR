import { lazyContent } from "@/components/health/LazyContent"

/** Salud animal · Si muere tu perro o gato — see Section4.content.tsx (downloaded when the section is opened) */
export const Section4 = lazyContent(() => import("./Section4.content"))
