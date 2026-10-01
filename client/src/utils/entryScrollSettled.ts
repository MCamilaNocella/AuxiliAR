/*
 * Signal fired by useEmergencyAutoScroll when, after entering an inner screen, the
 * content has settled: the auto-scroll finished, or a restored position (reload,
 * back/forward, #anchor) was kept. It doesn't fire if the user interrupts the auto-scroll.
 */
const ENTRY_SCROLL_SETTLED_EVENT = "auxiliar:entry-scroll-settled"

export const notifyEntryScrollSettled = () => window.dispatchEvent(new Event(ENTRY_SCROLL_SETTLED_EVENT))

/** Subscribes to the signal; returns the unsubscribe function. */
export const onEntryScrollSettled = (listener: () => void) => {
  window.addEventListener(ENTRY_SCROLL_SETTLED_EVENT, listener)
  return () => window.removeEventListener(ENTRY_SCROLL_SETTLED_EVENT, listener)
}
