export type ProfileChipsProps = {
  activeId: string
  onSelect: (id: string) => void
  /** On the home gradient (light chips with on-home text) */
  onDark?: boolean
}
