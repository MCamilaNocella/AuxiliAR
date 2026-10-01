import type { ChatLink } from "@/api/chat"

export type ChatLinksProps = {
  links: ChatLink[]
  /** Called when one is followed */
  onNavigate: () => void
}
