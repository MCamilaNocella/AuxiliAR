import taxonomy from "@/data/resources/taxonomy.json"
import type { CategoryId, ServiceType } from "@/data/resources"
import { PLACE_FILTERS } from "./filters"
import type { PlaceFilterId } from "./filters"

/** The names people see, all from the taxonomy: the screens do not write their own */
export const categoryLabel = (category: CategoryId) => taxonomy.categories.find(({ id }) => id === category)?.label ?? category

export const serviceTypeLabel = (type: ServiceType) => taxonomy.serviceTypes.find(({ id }) => id === type)?.label ?? type

export const quickFilterLabel = (filterId: PlaceFilterId) => PLACE_FILTERS.find(({ id }) => id === filterId)?.label ?? filterId
