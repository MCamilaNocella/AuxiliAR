/**
 * A small global value saved in localStorage, compatible with useSyncExternalStore.
 * `parse` turns what was saved (or null) into a valid value; `apply` runs on load and on every change.
 */
export const createLocalStore = <T>(key: string, parse: (stored: string | null) => T, apply?: (value: T) => void) => {
  const load = () => {
    try {
      return parse(localStorage.getItem(key))
    } catch {
      return parse(null)
    }
  }

  let value = load()
  apply?.(value)

  const listeners = new Set<() => void>()

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => value,
    set: (next: T) => {
      value = next
      apply?.(next)
      try {
        if (next === null) localStorage.removeItem(key)
        else localStorage.setItem(key, String(next))
      } catch {
        // No storage (private mode, blocked): the choice lasts until the page is reloaded
      }
      listeners.forEach((listener) => listener())
    },
  }
}
