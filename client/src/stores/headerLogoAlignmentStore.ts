import { DEFAULT_HEADER_LOGO_ALIGNMENT, HEADER_LOGO_ALIGNMENTS, HEADER_LOGO_ALIGNMENT_STORAGE_KEY } from "@/data/headerStyle"
import { createLocalStore } from "@/utils/createLocalStore"

/** How the header logo sits (as it is, centered or halfway), tried on /logos. Only development changes it */
export const headerLogoAlignmentStore = createLocalStore(
  HEADER_LOGO_ALIGNMENT_STORAGE_KEY,
  (stored) => HEADER_LOGO_ALIGNMENTS.find(({ value }) => value === stored)?.value ?? DEFAULT_HEADER_LOGO_ALIGNMENT,
)
