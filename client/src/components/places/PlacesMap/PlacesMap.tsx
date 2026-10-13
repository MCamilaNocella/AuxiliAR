import { useEffect, useRef } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./PlacesMap.css"
import { LEAFLET_PREFIX, MAP_TILES } from "@/data/mapTiles"
import type { MapPin } from "@/utils/places"
import { glyphOf } from "./PlacesMap.glyphs"

type PlacesMapProps = {
  pins: MapPin[]
  selectedId: string | null
  onSelect: (placeId: string) => void
  /** Takes the whole height of the box it is in (the full-screen map), square and without a border */
  fill?: boolean
}

/** The head of the pin is drawn at (12, 10) with radius 8: the symbol of the category goes inside it, 11 units wide, centered (24 x 24 icons scaled by 0.46) */
const GLYPH_TRANSFORM = "translate(6.48 4.48) scale(0.46)"

/** The pin: a 44px hit area with the drawing inside (CSS in PlacesMap.css): the pin and, in its head, the symbol of the category of the place */
const pinSvg = (category: MapPin["category"]) => {
  const { paths, circles = [] } = glyphOf(category)
  const lines = paths.map((d) => `<path d="${d}"/>`).join("")
  const dots = circles.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--color-on-brand)"/>`).join("")
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><g class="places-pin-glyph" transform="${GLYPH_TRANSFORM}" fill="none" stroke="var(--color-on-brand)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${lines}${dots}</g></svg>`
}

const pinIcon = (category: MapPin["category"], selected: boolean) =>
  L.divIcon({
    className: `places-pin${selected ? " is-selected" : ""}`,
    html: pinSvg(category),
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  })

/** What the pin tells when the pointer is over it or it has the keyboard focus: the kind of place and what it is for, in two short lines (built with text nodes, never HTML) */
const tooltipOf = ({ kind, purpose }: MapPin) => {
  const box = document.createElement("div")
  const type = document.createElement("strong")
  type.textContent = kind
  box.append(type)
  if (purpose) {
    const para = document.createElement("span")
    para.textContent = `Para: ${purpose}`
    box.append(para)
  }
  return box
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** The Ciudad Autónoma de Buenos Aires, as a box: the map opens framed on the pins inside it, not on the whole country */
const CABA_BOX = { south: -34.706, west: -58.536, north: -34.525, east: -58.33 }
const inCaba = ({ lat, lng }: { lat: number, lng: number }) => lat >= CABA_BOX.south && lat <= CABA_BOX.north && lng >= CABA_BOX.west && lng <= CABA_BOX.east

/**
 * The map: Leaflet inside our own wrapper (no react-leaflet). It only draws what it is given: the pins of the places
 * with verified coordinates. It never looks coordinates up. Imperative on purpose: Leaflet owns its DOM, React only
 * says which pins there are and which one is selected.
 *  - The pins are focusable buttons named after the place, its kind and what it is for; hovering or focusing a pin shows that in a short tooltip; the zoom buttons are 44px and sit on the right.
 *  - The list has the same places and every action, so nothing depends on this map.
 *  - Loaded on demand (this file brings Leaflet and its CSS with it).
 */
export default function PlacesMap({ pins, selectedId, onSelect, fill = false }: PlacesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef(new Map<string, L.Marker>())
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // The map itself, once
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const reduced = prefersReducedMotion()
    const map = L.map(container, {
      attributionControl: false,
      // The zoom buttons (+ and -) go on the right of the map, not on the left (Leaflet puts them top left by default)
      zoomControl: false,
      // The page scrolls with the wheel and the finger: the map zooms with its buttons, a double tap or a pinch
      scrollWheelZoom: false,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    })
    L.tileLayer(MAP_TILES.url, { maxZoom: MAP_TILES.maxZoom, attribution: MAP_TILES.attribution }).addTo(map)
    L.control.zoom({ position: "topright" }).addTo(map)
    L.control.attribution({ position: "bottomleft", prefix: LEAFLET_PREFIX }).addTo(map)
    mapRef.current = map
    // The box changes size when the side bar opens or closes: the map follows
    const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }))
    resize.observe(container)
    const markers = markersRef.current
    return () => {
      resize.disconnect()
      map.remove()
      mapRef.current = null
      markers.clear()
    }
  }, [])

  // The pins: those of the places shown, framed automatically
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const markers = markersRef.current
    for (const marker of markers.values()) marker.remove()
    markers.clear()
    for (const pin of pins) {
      // No native "title": it would show the name a second time after the tooltip. The pin is named for screen readers below
      const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon(pin.category, false), keyboard: true })
      marker.bindTooltip(tooltipOf(pin), { direction: "top", offset: [0, -40], opacity: 1, className: "places-tooltip" })
      // A pin near the edge of the map: the tooltip is moved sideways so it is never cut off
      marker.on("tooltipopen", () => {
        const tip = marker.getTooltip()?.getElement()
        const box = containerRef.current
        if (!tip || !box) return
        tip.style.marginLeft = "0px"
        const tipRect = tip.getBoundingClientRect()
        const mapRect = box.getBoundingClientRect()
        const margin = 6
        if (tipRect.left < mapRect.left + margin) tip.style.marginLeft = `${Math.round(mapRect.left + margin - tipRect.left)}px`
        else if (tipRect.right > mapRect.right - margin) tip.style.marginLeft = `${Math.round(mapRect.right - margin - tipRect.right)}px`
      })
      marker.on("click", () => onSelectRef.current(pin.id))
      // A focused pin is a button: Enter or Space selects it
      marker.on("keypress", (event: L.LeafletKeyboardEvent) => {
        const key = event.originalEvent.key
        if (key !== "Enter" && key !== " ") return
        event.originalEvent.preventDefault()
        onSelectRef.current(pin.id)
      })
      marker.addTo(map)
      const element = marker.getElement()
      if (element) {
        element.setAttribute("role", "button")
        element.setAttribute("aria-label", `${pin.name}. ${pin.kind}${pin.purpose ? `. Para: ${pin.purpose}` : ""}`)
        // The keyboard sees what the pointer sees
        element.addEventListener("focus", () => marker.openTooltip())
        element.addEventListener("blur", () => marker.closeTooltip())
      }
      markers.set(pin.id, marker)
    }
    if (pins.length > 0) {
      // First view: the pins of the Ciudad when there are some (a closer view); the others stay on the map, one zoom out away. With none in the Ciudad, all of them
      const framed = pins.some(inCaba) ? pins.filter(inCaba) : pins
      map.fitBounds(L.latLngBounds(framed.map(({ lat, lng }) => [lat, lng] as [number, number])), { padding: [48, 48], maxZoom: 16, animate: !prefersReducedMotion() })
    }
  }, [pins])

  // The selected pin stands out
  useEffect(() => {
    const categories = new Map(pins.map(({ id, category }) => [id, category]))
    for (const [id, marker] of markersRef.current) marker.setIcon(pinIcon(categories.get(id) ?? "salud-fisica", id === selectedId))
  }, [selectedId, pins])

  // A selected pin that the side bar would leave out of view is brought back into it
  useEffect(() => {
    const map = mapRef.current
    const marker = selectedId ? markersRef.current.get(selectedId) : undefined
    if (!map || !marker) return
    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false })
      map.panInside(marker.getLatLng(), { padding: [64, 64], animate: !prefersReducedMotion() })
    })
    return () => cancelAnimationFrame(frame)
  }, [selectedId])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Mapa de centros de atención. La lista tiene los mismos lugares."
      className={`places-map w-full overflow-hidden ${fill ? "h-full" : "h-[min(70dvh,36rem)] min-h-80 rounded-2xl border-2 border-line-strong lg:h-[max(36rem,calc(100dvh-9rem))]"}`}
    />
  )
}
