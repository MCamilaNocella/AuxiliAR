import { useEffect, useState } from "react"
import type { RotatingPhrasesProps } from "./RotatingPhrases.types"

/** Phrases that take turns, like Mi Salud's: all share one grid cell (the box keeps its size) and the new one comes in softly */
export const RotatingPhrases = ({ phrases, every = 10 }: RotatingPhrasesProps) => {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((k) => (k + 1) % phrases.length), every * 1000)
    return () => window.clearInterval(timer)
  }, [phrases.length, every])
  return (
    <span className="grid">
      {phrases.map((phrase, k) => (
        <span key={phrase} aria-hidden={k !== index} className={`[grid-area:1/1] ${k === index ? "animate-message-in motion-reduce:animate-none" : "invisible"}`}>
          {phrase}
        </span>
      ))}
    </span>
  )
}
