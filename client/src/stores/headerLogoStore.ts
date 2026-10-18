import { HEADER_LOGO_STORAGE_KEY, REAL_LOGO_SKETCH_ID } from "@/data/headerStyle"
import { createLocalStore } from "@/utils/createLocalStore"

/** The logo sketch shown on the header (id from /logos), or null for the real logo. Only development reads it */
export const headerLogoStore = createLocalStore<string | null>(HEADER_LOGO_STORAGE_KEY, (stored) =>
  stored && stored !== REAL_LOGO_SKETCH_ID ? stored : null,
)
