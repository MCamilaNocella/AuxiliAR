import { useEffect, useState } from "react"
import { loadPlaces } from "@/data/resources"
import type { ProvinceCode, Resource } from "@/data/resources"

export type PlacesState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready", places: readonly Resource[] }

/**
 * The places of several provinces together, each file loaded on demand and kept. A place that appears in two files
 * (it should not: ids are unique) is counted once. `retry` tries again after an error.
 */
export const usePlacesOf = (provinces: readonly ProvinceCode[]) => {
  const [attempt, setAttempt] = useState(0)
  const key = `${provinces.join(",")}#${attempt}`
  const [answer, setAnswer] = useState<{ key: string, state: PlacesState } | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all(provinces.map((province) => loadPlaces(province))).then(
      (lists) => {
        const byId = new Map<string, Resource>()
        for (const place of lists.flat()) if (!byId.has(place.id)) byId.set(place.id, place)
        if (!cancelled) setAnswer({ key, state: { status: "ready", places: [...byId.values()] } })
      },
      () => {
        if (!cancelled) setAnswer({ key, state: { status: "error" } })
      },
    )
    return () => {
      cancelled = true
    }
    // The key says which provinces were asked for (a new array with the same provinces is the same request)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const state: PlacesState = answer?.key === key ? answer.state : { status: "loading" }
  return { ...state, retry: () => setAttempt((count) => count + 1) }
}

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
