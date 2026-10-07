/*
 * Types of the resources dataset. They mirror resource.schema.json; the allowed values of each union
 * are the ids of taxonomy.json (client/scripts/resources-sync.test.mjs fails if they stop matching).
 */

export type ResourceKind = "emergency" | "urgent-support" | "orientation" | "service"

export type VerificationStatus = "verified" | "needs-review" | "unverified" | "outdated" | "disputed"

export type ResourceCost = "free" | "paid" | "mixed" | "unknown"

export type Audience =
  | "all"
  | "children"
  | "adolescents"
  | "adults"
  | "older-adults"
  | "women"
  | "lgbtq"
  | "people-with-disabilities"

export type ContactType = "phone" | "whatsapp"

export type CoverageLevel = "national" | "region" | "province" | "municipal"

export type AreaId = "amba" | "ugl-rosario"

export type ProvinceCode =
  | "AR-C"
  | "AR-B"
  | "AR-K"
  | "AR-H"
  | "AR-U"
  | "AR-X"
  | "AR-W"
  | "AR-E"
  | "AR-P"
  | "AR-Y"
  | "AR-L"
  | "AR-F"
  | "AR-M"
  | "AR-N"
  | "AR-Q"
  | "AR-R"
  | "AR-A"
  | "AR-J"
  | "AR-D"
  | "AR-Z"
  | "AR-S"
  | "AR-G"
  | "AR-V"
  | "AR-T"

/** Ids of the app's categories (content/categories) */
export type CategoryId =
  | "salud-fisica"
  | "salud-mental"
  | "esi"
  | "animales"
  | "centros"
  | "recursos"
  | "primeros-auxilios"
  | "sobre-auxiliar"

/** Type of establishment (taxonomy.facilityTypes) */
export type FacilityType =
  | "hospital"
  | "health-center"
  | "mental-health-center"
  | "zoonosis-center"
  | "public-veterinary"
  | "counseling-center"
  | "other"

/** What a service is (taxonomy.serviceTypes); each type belongs to categories */
export type ServiceType =
  | "primary-care"
  | "vaccination"
  | "dentistry"
  | "ophthalmology"
  | "emergency-room"
  | "laboratory"
  | "diagnostic-imaging"
  | "specialty-care"
  | "pharmacy"
  | "mental-health-care"
  | "mental-health-emergency"
  | "sexual-reproductive-health"
  | "contraception"
  | "condoms"
  | "sexual-health-counseling"
  | "emergency-contraception"
  | "pregnancy-care"
  | "sti-testing-care"
  | "ive-ile-care"
  | "zoonosis"
  | "rabies-vaccination"
  | "spaying-neutering"
  | "veterinary-care"

export type AppointmentMode = "required" | "recommended" | "not-required" | "unknown"

/** Only verified coordinates put a place on the map */
export type CoordinateStatus = "verified" | "unverified"

/** Where the point came from */
export type CoordinateMethod =
  | "official-dataset"
  | "official-dataset-reprojected"
  | "geocoded-usig"
  | "geocoded-georef"
  | "geocoded-other"
  | "manual-map"
  | "gps-survey"

export type JurisdictionLevel = "national" | "provincial" | "municipal" | "other"

/** Where it serves: the whole country, a region or area, a province or a municipality */
export type Coverage = {
  level: CoverageLevel
  provinces?: ProvinceCode[]
  areas?: AreaId[]
  note?: string
}

export type Schedule = {
  /** 0 = Sunday … 6 = Saturday (same as Date.getDay) */
  days: number[]
  /** "HH:mm", 24 h; same day: `to` is after `from` */
  from: string
  to: string
}

/** A resource's `hours` of `null` means it is not known: it is never assumed to be 24 h */
export type Hours = {
  open24h: boolean
  schedule?: Schedule[]
  note?: string
}

export type Contact = {
  type: ContactType
  /** Digits only (with + if international): what is dialed (tel:) and what numbers are compared by */
  dial: string
  /** How it is written on screen */
  display: string
  label?: string
  /** Own scope or hours, when they differ from the resource's */
  scope?: Coverage
  hours?: Hours | null
}

export type Address = {
  street?: string
  /** Street number, or "s/n" */
  number?: string
  /** Neighborhood (or comuna, in CABA) */
  neighborhood?: string
  locality?: string
  /** Departamento, partido or comuna */
  department?: string
  province?: ProvinceCode
  postalCode?: string
  /** How to get there, or where it is inside the premises */
  reference?: string
  /** Ids of the Georef API (datos.gob.ar), to search by province, department or locality */
  georef?: { provinceId?: string, departmentId?: string, localityId?: string }
}

/** Only a place with verified coordinates is shown on the map; without them it is only in the list */
export type Coordinates = {
  lat: number
  lng: number
  precision: "exact" | "approximate"
  status: CoordinateStatus
  method?: CoordinateMethod
  /** YYYY-MM-DD */
  verifiedAt?: string | null
  verifiedBy?: string | null
  note?: string
}

export type Source = {
  /** Body that publishes the data */
  organization: string
  url?: string
  /** YYYY-MM-DD: the day the source was consulted or downloaded */
  retrievedAt?: string
  /** License the body publishes the data under (e.g. CC-BY-2.5-AR) */
  license?: string
  note?: string
}

export type Verification = {
  status: VerificationStatus
  /** YYYY-MM-DD */
  verifiedAt?: string | null
  verifiedBy?: string | null
  /** YYYY-MM-DD: from this day on the resource stops being shown until it is verified again */
  nextReviewDue?: string | null
  notes?: string
}

/** Who runs the establishment (not where it serves: that is `coverage`) */
export type Jurisdiction = {
  level: JurisdictionLevel
  province?: ProvinceCode
  organization: string
  note?: string
}

export type Appointment = {
  mode: AppointmentMode
  /** How the appointment is requested */
  howTo?: string
  url?: string
}

/**
 * One thing an establishment offers. It says only what is its own; the rest it inherits from the establishment
 * (hours, cost, requirements, audience, source, verification). `hours: null` means this service's hours are not
 * known: it does not inherit. Categories are never written: they come from `type`.
 */
export type Service = {
  /** Stable, unique inside the establishment */
  id: string
  type: ServiceType
  /** Only if the name of the type isn't enough */
  name?: string
  description?: string
  hours?: Hours | null
  cost?: ResourceCost
  costNote?: string
  requirements?: string[]
  audience?: Audience[]
  appointment?: Appointment
  /** The service's own contacts, besides the establishment's */
  contacts?: Contact[]
  source?: Source
  verification?: Verification
}

/** A service with everything resolved (what it inherits filled in, categories derived): what the app and the server read */
export type ResolvedService = {
  id: string
  type: ServiceType
  name?: string
  description?: string
  hours: Hours | null
  cost: ResourceCost
  costNote?: string
  requirements: string[]
  audience: Audience[]
  appointment: Appointment
  contacts: Contact[]
  source?: Source
  verification: Verification
  categories: CategoryId[]
}

export type Resource = {
  /** Stable: never reused or changed */
  id: string
  name: string
  /** For buttons */
  shortName?: string
  kind: ResourceKind
  /** Type of establishment; required when it has services */
  facilityType?: FacilityType
  description?: string
  /** What it is for, in a sentence */
  whenToUse?: string
  /** Only for resources without services: with services, categories come from the type of each one */
  categories?: CategoryId[]
  sections?: { category: CategoryId, section: string }[]
  /** Optional for a place (kind service); required for the rest. A place can share a number with another */
  contacts?: Contact[]
  coverage?: Coverage
  jurisdiction?: Jurisdiction
  hours?: Hours | null
  cost?: ResourceCost
  costNote?: string
  requirements?: string[]
  audience?: Audience[]
  address?: Address | null
  coordinates?: Coordinates | null
  /** A single establishment, with everything it offers */
  services?: Service[]
  /** Ids in other registers (e.g. refes), to avoid loading the same establishment twice */
  externalIds?: Record<string, string>
  source?: Source
  verification: Verification
  /** Other names people search it by */
  aliases?: string[]
  display?: {
    /** Position in the emergency bar; without a value it isn't there */
    emergencyBarOrder?: number
  }
}
