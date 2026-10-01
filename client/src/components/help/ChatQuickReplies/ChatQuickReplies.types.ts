export type QuickReply = {
  label: string
  onSelect: () => void
}

export type ChatQuickRepliesProps = {
  /** Names the group for screen readers */
  label: string
  replies: QuickReply[]
}
