import { useEffect, useRef } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./PlacesMap.css"
import { LEAFLET_PREFIX, MAP_TILES } from "@/data/mapTiles"
import type { MapPin } from "@/utils/places"

type PlacesMapProps = {
  pins: MapPin[]
  selectedId: string | null
  onSelect: (placeId: string) => void
}

/** The pin: a 44px hit area with the drawing inside (CSS in PlacesMap.css) */
const PIN_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="var(--color-on-brand)" stroke="none"/></svg>'

const pinIcon = (selected: boolean) =>
  L.divIcon({
    className: `places-pin${selected ? " is-selected" : ""}`,
    html: PIN_SVG,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  })

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * The map: Leaflet inside our own wrapper (no react-leaflet). It only draws what it is given: the pins of the places
 * with verified coordinates. It never looks coordinates up. Imperative on purpose: Leaflet owns its DOM, React only
 * says which pins there are and which one is selected.
 *  - The pins are focusable buttons named after the place; the zoom buttons are 44px.
 *  - The list has the same places and every action, so nothing depends on this map.
 *  - Loaded on demand (this file brings Leaflet and its CSS with it).
 */
export default function PlacesMap({ pins, selectedId, onSelect }: PlacesMapProps) {
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
      // The page scrolls with the wheel and the finger: the map zooms with its buttons, a double tap or a pinch
      scrollWheelZoom: false,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    })
    L.tileLayer(MAP_TILES.url, { maxZoom: MAP_TILES.maxZoom, attribution: MAP_TILES.attribution }).addTo(map)
    L.control.attribution({ position: "bottomleft", prefix: LEAFLET_PREFIX }).addTo(map)
    mapRef.current = map
    const markers = markersRef.current
    return () => {
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
      const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon(false), title: pin.name, alt: pin.name, keyboard: true })
      marker.on("click", () => onSelectRef.current(pin.id))
      // A focused pin is a button: Enter or Space selects it
      marker.on("keypress", (event: L.LeafletKeyboardEvent) => {
        const key = event.originalEvent.key
        if (key !== "Enter" && key !== " ") return
        event.originalEvent.preventDefault()
        onSelectRef.current(pin.id)
      })
      marker.addTo(map)
      markers.set(pin.id, marker)
    }
    if (pins.length > 0) {
      map.fitBounds(L.latLngBounds(pins.map(({ lat, lng }) => [lat, lng] as [number, number])), { padding: [48, 48], maxZoom: 16, animate: !prefersReducedMotion() })
    }
  }, [pins])

  // The selected pin stands out
  useEffect(() => {
    for (const [id, marker] of markersRef.current) marker.setIcon(pinIcon(id === selectedId))
  }, [selectedId, pins])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Mapa de centros de atención. La lista tiene los mismos lugares."
      className="places-map h-[min(62dvh,32rem)] min-h-80 w-full overflow-hidden rounded-2xl border-2 border-line-strong"
    />
  )
}
