import { useLayoutEffect, useRef } from "react"
import type { RefObject } from "react"

type Plan = { n: number, h: number[], cols: number[][], end: number, total: (col: number[]) => number, worst: number }

/** The most even columns for n of them: the tallest card first, each one to the shortest column; then moves and swaps while they help */
const plan = (list: HTMLElement, cards: HTMLElement[], n: number, gap: number): Plan => {
  list.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`
  cards.forEach((card) => {
    card.style.gridColumn = "1"
    card.style.gridRow = "auto"
    card.style.alignSelf = "start"
  })
  const h = cards.map((card) => Math.ceil(card.offsetHeight + gap))
  const cols: number[][] = Array.from({ length: n }, () => [])
  const total = (col: number[]) => col.reduce((sum, k) => sum + h[k], 0)
  h.map((_, k) => k)
    .sort((a, b) => h[b] - h[a])
    .forEach((k) => cols.reduce((a, b) => (total(b) < total(a) ? b : a)).push(k))
  for (let round = 0; round < 300; round++) {
    const tall = cols.reduce((a, b) => (total(b) > total(a) ? b : a))
    const top = total(tall)
    let move: [number[], number, number] | null = null
    let gain = 0
    cols.forEach((other) => {
      if (other === tall) return
      const low = total(other)
      tall.forEach((k, a) => {
        const after = Math.max(top - h[k], low + h[k])
        if (top - after > gain) {
          gain = top - after
          move = [other, a, -1]
        }
        other.forEach((j, b) => {
          const e = h[k] - h[j]
          if (e > 0 && top - Math.max(top - e, low + e) > gain) {
            gain = top - Math.max(top - e, low + e)
            move = [other, a, b]
          }
        })
      })
    })
    if (!move) break
    const [other, a, b] = move as [number[], number, number]
    const k = tall.splice(a, 1)[0]
    if (b >= 0) tall.push(other.splice(b, 1, k)[0])
    else other.push(k)
  }
  const end = Math.max(...cols.map(total))
  cols.forEach((col) => col.sort((a, b) => a - b))
  return { n, h, cols, end, total, worst: Math.max(...cols.map((col) => (col.length > 1 ? (end - total(col)) / (col.length - 1) : end - total(col)))) }
}

/**
 * Deals the cards of a grid into as many columns as fit (up to 4, each at least `minRem` wide), looking for the columns that come out most
 * even; every card keeps its height and what is left over goes between the cards, so all the columns end on the same line. Inside a column
 * the cards keep their order. It deals them again when the list changes width or the text size or theme changes. Needs grid-auto-rows: 1px.
 */
export const useBalancedColumns = (listRef: RefObject<HTMLElement | null>, minRem = 8.5, gapRem = 0.75) => {
  const lastWidth = useRef(0)
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const layout = () => {
      if (!list.clientWidth) return
      const cards = [...list.children] as HTMLElement[]
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const gap = gapRem * rem
      const most = Math.min(cards.length, Math.max(1, Math.min(4, Math.floor((list.clientWidth + gap) / (minRem * rem + gap)))))
      list.dataset.laid = ""
      const plans = [most, most - 1].filter((n) => n >= Math.min(2, most)).map((n) => plan(list, cards, n, gap))
      const best = plans.reduce((a, b) => (b.worst + 2 * gap < a.worst ? b : a))
      list.style.gridTemplateColumns = `repeat(${best.n}, minmax(0, 1fr))`
      best.cols.forEach((col, c) => {
        const extra = best.end - best.total(col)
        const between = col.length > 1 ? extra / (col.length - 1) : 0
        let top = 0
        col.forEach((k, i) => {
          const at = Math.round(i === col.length - 1 && col.length > 1 ? best.end - best.h[k] : top)
          cards[k].style.gridColumn = String(c + 1)
          cards[k].style.gridRow = `${at + 1} / span ${best.h[k]}`
          top += best.h[k] + between
        })
      })
    }
    const resize = new ResizeObserver(() => {
      if (lastWidth.current === list.clientWidth) return
      lastWidth.current = list.clientWidth
      layout()
    })
    resize.observe(list)
    // A new text size or theme changes the heights of the cards
    const settings = new MutationObserver(layout)
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-theme"] })
    return () => {
      resize.disconnect()
      settings.disconnect()
    }
  }, [listRef, minRem, gapRem])
}
