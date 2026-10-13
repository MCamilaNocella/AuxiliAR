import taxonomy from "@/data/resources/taxonomy.json"
import type { CategoryId, ProvinceCode, ServiceType } from "@/data/resources"
import {
  PLACE_CATEGORY_PARAM,
  PLACE_FILTER_PARAM,
  PLACE_FREE_PARAM,
  PLACE_KIND_PARAM,
  PLACE_PROVINCE_PARAM,
  PLACE_QUERY_PARAM,
  PLACE_TYPE_PARAM,
  PLACE_ZONE_PARAM,
} from "@/router/paths"
import { EMPTY_PLACE_QUERY, PLACE_FILTERS } from "./filters"
import type { PlaceFilterId, PlaceQuery } from "./filters"
import { isPlaceKind } from "./kinds"
import type { PlaceKindId } from "./kinds"

/** The categories a service can belong to (the others of the taxonomy are screens of the app, not kinds of care) */
const CARE_CATEGORIES = new Set<string>(taxonomy.serviceTypes.flatMap(({ categories }) => categories))
const SERVICE_TYPES = new Set<string>(taxonomy.serviceTypes.map(({ id }) => id))
const PROVINCES = new Set<string>(taxonomy.provinces.map(({ id }) => id))
const FILTER_IDS = new Set<string>(PLACE_FILTERS.map(({ id }) => id))

const MAX_TEXT = 120

/**
 * The query a link asks for (/centros?provincia=AR-C&zona=Comuna%204&categoria=salud-mental&prestacion=…&filtro=…&buscar=…).
 * Whatever is not valid is ignored, never guessed: an unknown province, category or service means "no filter".
 */
export const placeQueryFromParams = (params: URLSearchParams): PlaceQuery => {
  const province = params.get(PLACE_PROVINCE_PARAM)
  const category = params.get(PLACE_CATEGORY_PARAM)
  const type = params.get(PLACE_TYPE_PARAM)
  const filter = params.get(PLACE_FILTER_PARAM)
  const zone = params.get(PLACE_ZONE_PARAM)?.trim()
  const validProvince = province && PROVINCES.has(province) ? (province as ProvinceCode) : null
  return {
    text: (params.get(PLACE_QUERY_PARAM) ?? "").slice(0, MAX_TEXT),
    filterId: filter && FILTER_IDS.has(filter) ? (filter as PlaceFilterId) : EMPTY_PLACE_QUERY.filterId,
    province: validProvince,
    // A division belongs to a province: alone it means nothing
    zone: validProvince && zone ? zone.slice(0, MAX_TEXT) : null,
    category: category && CARE_CATEGORIES.has(category) ? (category as CategoryId) : null,
    type: type && SERVICE_TYPES.has(type) ? (type as ServiceType) : null,
    // The kind of place is a step inside a kind of care: alone it means nothing
    kind: category && CARE_CATEGORIES.has(category) && isPlaceKind(params.get(PLACE_KIND_PARAM)) ? (params.get(PLACE_KIND_PARAM) as PlaceKindId) : null,
    free: params.get(PLACE_FREE_PARAM) === "1",
  }
}

/** Writes a query into the params of a URL, keeping every other param (the open place, the view…). Empty criteria are removed */
export const placeQueryToParams = (previous: URLSearchParams, query: PlaceQuery): URLSearchParams => {
  const params = new URLSearchParams(previous)
  const set = (name: string, value: string | null) => (value ? params.set(name, value) : params.delete(name))
  set(PLACE_QUERY_PARAM, query.text.trim() ? query.text : null)
  set(PLACE_FILTER_PARAM, query.filterId === "all" ? null : query.filterId)
  set(PLACE_PROVINCE_PARAM, query.province)
  set(PLACE_ZONE_PARAM, query.province ? query.zone : null)
  set(PLACE_CATEGORY_PARAM, query.category)
  set(PLACE_TYPE_PARAM, query.type)
  set(PLACE_KIND_PARAM, query.category ? query.kind : null)
  set(PLACE_FREE_PARAM, query.free ? "1" : null)
  return params
}
