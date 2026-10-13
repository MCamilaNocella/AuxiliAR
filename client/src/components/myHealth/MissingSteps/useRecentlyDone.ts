import { useEffect, useRef, useState } from "react"
import type { MissingItem } from "@/types/myHealth"
import { DONE_STAGGER_MS, DONE_VISIBLE_MS } from "./MissingSteps.constants"

/** A just-completed item, and how long it waits for its turn to show the check */
export type DoneItem = MissingItem & { delay: number }

const signature = (items: MissingItem[]) => items.map(({ key }) => key).join()

/**
 * The items that just stopped being missing (they were filled in): kept so they can show their check before going
 * away. Several at once (a whole card saved) take turns, one after the other, DONE_STAGGER_MS apart.
 * Worked out while rendering (not in an effect), so a completed item never leaves the list for a frame: it can
 * glide from its old place. The list must be remounted (keyed) when it starts showing another profile.
 */
export const useRecentlyDone = (missing: MissingItem[]) => {
  const [done, setDone] = useState<DoneItem[]>([])
  const [previous, setPrevious] = useState(missing)
  const scheduled = useRef(new Set<DoneItem>())
  const timers = useRef<number[]>([])

  if (signature(missing) !== signature(previous)) {
    const filled = previous.filter((item) => !missing.some(({ key }) => key === item.key))
    setPrevious(missing)
    if (filled.length > 0) setDone((current) => [...current, ...filled.map((item, index) => ({ ...item, delay: index * DONE_STAGGER_MS }))])
  }

  // Each one goes once its turn and its check are over
  useEffect(() => {
    done.forEach((item) => {
      if (scheduled.current.has(item)) return
      scheduled.current.add(item)
      timers.current.push(window.setTimeout(() => setDone((current) => current.filter((entry) => entry !== item)), item.delay + DONE_VISIBLE_MS))
    })
  }, [done])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return done
}
