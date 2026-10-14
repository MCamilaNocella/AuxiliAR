import { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ChevronDown, Info, List, Map as MapIcon } from "lucide-react"
import { MAP_TILES } from "@/data/mapTiles"
import { prefersReducedMotion } from "@/utils/scroll"
import { BlockPlaceCard } from "../BlockPlaceCard"
import { FLAG, pinHtml } from "./BlockMap.constants"
import type { BlockMapProps } from "./BlockMap.types"

const SELECT = "min-h-11 w-full cursor-pointer appearance-none rounded-xl border-2 border-control-line bg-card py-2 pr-9 pl-[0.85rem] font-bold text-ink disabled:cursor-default disabled:opacity-60"
const CHIP = "min-h-10 cursor-pointer rounded-lg border-0 px-3.5 py-1.5 text-sm font-bold aria-pressed:bg-brand aria-pressed:text-on-brand in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)]"

/** A model's map with its list: province and barrio selectors, Lista | Mapa, filter chips, the pins (tap one to see the place) */
export const BlockMap = ({ places, provinces, filters, empty, emptyExtra }: BlockMapProps) => {
  const [province, setProvince] = useState(provinces[0]?.[0] ?? "")
  const [zone, setZone] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState<"map" | "list">("map")
  const [selected, setSelected] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  const provinceName = provinces.find(([id]) => id === province)?.[1] ?? province
  const inProvince = places.filter((p) => p.province === province)
  const zones = [...new Set(inProvince.map((p) => p.zone).filter((z): z is string => !!z))].sort((a, b) => a.localeCompare(b, "es"))
  const results = inProvince.filter((p) => (!zone || p.zone === zone) && (filter === "all" || p[FLAG[filter] ?? filter]))
  const pinned = results.filter((p) => p.lat != null && p.lng != null)
  const loose = results.length - pinned.length
  const where = zone ? ` en ${zone}` : ` en ${provinceName}`
  const showMap = view === "map" && pinned.length > 0
  const selectedPlace = places.find((p) => p.id === selected)

  useEffect(() => {
    const container = mapRef.current
    if (!showMap || !container) return
    const map = L.map(container, { scrollWheelZoom: false, zoomControl: true })
    L.tileLayer(MAP_TILES.url, { maxZoom: MAP_TILES.maxZoom, attribution: MAP_TILES.attribution }).addTo(map)
    const markers = new Map<string, L.Marker>()
    const mark = (id: string | null) => markers.forEach((marker, key) => marker.getElement()?.classList.toggle("is-selected", key === id))
    pinned.forEach((place) => {
      const marker = L.marker([place.lat as number, place.lng as number], {
        icon: L.divIcon({ className: "flex items-end justify-center focus-visible:rounded-full focus-visible:outline-3 focus-visible:outline-brand", html: pinHtml(!!place.mental), iconSize: [44, 44], iconAnchor: [22, 42] }),
        keyboard: true,
        title: "",
      }).addTo(map)
      marker.bindTooltip(place.name, { direction: "top", offset: [0, -38] })
      marker.on("click", () => {
        mark(place.id)
        setSelected(place.id)
      })
      const element = marker.getElement()
      element?.setAttribute("aria-label", `${place.name}. ${place.kind}`)
      element?.setAttribute("role", "button")
      markers.set(place.id, marker)
    })
    map.fitBounds(L.latLngBounds(pinned.map((p) => [p.lat as number, p.lng as number])), { padding: [40, 40], maxZoom: 15 })
    return () => {
      map.remove()
    }
    // The map is rebuilt when what it shows changes (province, barrio, filter, view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap, province, zone, filter])

  useEffect(() => {
    if (selected) selectedRef.current?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }, [selected])

  const list = (
    <ul role="list" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-3 p-0">
      {results.map((place) => (
        <li key={place.id}>
          <BlockPlaceCard place={place} />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="mt-3 grid gap-[0.9rem]">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid min-w-0 flex-[1_1_14rem] gap-[0.3rem]">
          <label htmlFor="block-map-province" className="text-[0.85rem] font-extrabold text-ink-soft">
            Provincia
          </label>
          <div className="relative">
            <select
              id="block-map-province"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value)
                setZone("")
                setSelected(null)
              }}
              className={SELECT}
            >
              {provinces.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" />
          </div>
        </div>
        <div className="grid min-w-0 flex-[1_1_14rem] gap-[0.3rem]">
          <label htmlFor="block-map-zone" className="text-[0.85rem] font-extrabold text-ink-soft">
            Localidad o barrio
          </label>
          <div className="relative">
            <select
              id="block-map-zone"
              value={zone}
              disabled={!zones.length}
              onChange={(event) => {
                setZone(event.target.value)
                setSelected(null)
              }}
              className={SELECT}
            >
              <option value="">{zones.length ? "Todas" : "Sin lugares todavía"}</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" />
          </div>
        </div>
        <div role="group" aria-label="Ver los lugares como" className="inline-flex rounded-[0.625rem] border border-control-line bg-card p-1">
          {(
            [
              ["list", "Lista", List],
              ["map", "Mapa", MapIcon],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className="inline-flex min-h-9 min-w-20 cursor-pointer items-center justify-center gap-[0.4rem] rounded-md border-0 bg-transparent px-[0.9rem] py-[0.4rem] text-sm font-bold text-ink aria-pressed:bg-brand aria-pressed:text-on-brand"
            >
              <Icon aria-hidden="true" className="size-[1.25em]" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div role="group" aria-label="Qué buscás" className="flex flex-wrap gap-[0.4rem]">
        {filters.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => {
              setFilter(id)
              setSelected(null)
            }}
            className={`${CHIP} ${filter === id ? "" : "bg-field text-ink hover:bg-brand-soft"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="m-0 font-extrabold">
        {inProvince.length ? `${results.length} ${results.length === 1 ? "lugar" : "lugares"}${where}` : ""}
      </p>
      {!inProvince.length ? (
        <div className="grid gap-[0.6rem] rounded-[1.25rem] bg-card px-5 py-[1.1rem]">
          <b className="text-[1.05rem]">{empty.title.replace("{prov}", provinceName)}</b>
          <p className="m-0">{empty.text.replace("{prov}", provinceName)}</p>
          {emptyExtra}
        </div>
      ) : !results.length ? (
        <div className="grid gap-[0.6rem] rounded-[1.25rem] bg-card px-5 py-[1.1rem]">
          <b className="text-[1.05rem]">{`No hay lugares con ese filtro${where}.`}</b>
          <p className="m-0">Probá con «Todos» o con otra localidad.</p>
        </div>
      ) : !showMap ? (
        <div>
          {view === "map" && (
            <p className="m-0 mb-3 flex items-start gap-2 rounded-xl bg-field px-4 py-3">
              <Info aria-hidden="true" className="mt-[0.15rem] size-[1.1rem] shrink-0" />
              <span>Estos lugares todavía no tienen un punto confirmado en el mapa: te los mostramos en la lista.</span>
            </p>
          )}
          {list}
        </div>
      ) : (
        <>
          <div
            ref={mapRef}
            className="z-0 h-96 overflow-hidden rounded-[1.25rem] border-2 border-line-strong bg-field lg:h-[28rem] [font:inherit]! [&_.leaflet-control-zoom_a]:!size-11 [&_.leaflet-control-zoom_a]:!leading-[44px]"
          />
          <p className="m-0 text-[0.925rem] text-ink-soft">
            Las ubicaciones son aproximadas: marcan la dirección. Tocá un punto para ver el lugar.
            {loose > 0 && (
              <>
                {` ${loose} ${loose === 1 ? "lugar todavía no tiene" : "lugares todavía no tienen"} punto: `}
                <button type="button" onClick={() => setView("list")} className="cursor-pointer border-0 bg-transparent p-0 font-extrabold text-brand underline underline-offset-[3px]">
                  miralos en la lista
                </button>
                .
              </>
            )}
          </p>
          <div ref={selectedRef} aria-live="polite">
            {selectedPlace && <BlockPlaceCard place={selectedPlace} />}
          </div>
        </>
      )}
    </div>
  )
}
