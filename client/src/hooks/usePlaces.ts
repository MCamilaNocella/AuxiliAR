import { useEffect, useState } from "react"
import { loadPlaces } from "@/data/resources"
import type { ProvinceCode, Resource } from "@/data/resources"

export type PlacesState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready", places: readonly Resource[] }

/**
 * The places of a province, loaded on demand (one file per province, kept after the first time).
 * `retry` tries again after an error.
 */
export const usePlaces = (province: ProvinceCode) => {
  const [attempt, setAttempt] = useState(0)
  // The answer says which request it belongs to: any other one (another province, a retry) is "loading"
  const key = `${province}#${attempt}`
  const [answer, setAnswer] = useState<{ key: string, state: PlacesState } | null>(null)

  useEffect(() => {
    let cancelled = false
    loadPlaces(province).then(
      (places) => {
        if (!cancelled) setAnswer({ key, state: { status: "ready", places } })
      },
      () => {
        if (!cancelled) setAnswer({ key, state: { status: "error" } })
      },
    )
    return () => {
      cancelled = true
    }
  }, [province, key])

  const state: PlacesState = answer?.key === key ? answer.state : { status: "loading" }
  return { ...state, retry: () => setAttempt((count) => count + 1) }
}
