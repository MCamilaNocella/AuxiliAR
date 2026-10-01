import { useEffect, useState } from "react"
import { searchZones } from "./ChatInput.zones"

/** Zone suggestions for what's being typed ("" = none) */
export const useZoneSuggestions = (query: string) => {
  const [result, setResult] = useState<{ query: string, zones: string[] }>({ query: "", zones: [] })

  useEffect(() => {
    if (!query.trim()) return
    let current = true
    searchZones(query).then((zones) => {
      if (current) setResult({ query, zones })
    })
    // A newer query wins over a late answer
    return () => {
      current = false
    }
  }, [query])

  // Results of an older query (or of a cleared field) aren't shown
  return result.query === query && query.trim() ? result.zones : []
}
