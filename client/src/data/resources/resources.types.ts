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
  locality?: string
  province?: ProvinceCode
  postalCode?: string
}

export type Coordinates = {
  lat: number
  lng: number
  precision: "exact" | "approximate"
}

export type Source = {
  /** Body that publishes the data */
  organization: string
  url?: string
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

export type Resource = {
  /** Stable: never reused or changed */
  id: string
  name: string
  /** For buttons */
  shortName?: string
  kind: ResourceKind
  description?: string
  /** What it is for, in a sentence */
  whenToUse?: string
  categories?: CategoryId[]
  sections?: { category: CategoryId, section: string }[]
  contacts: Contact[]
  coverage?: Coverage
  hours?: Hours | null
  cost?: ResourceCost
  costNote?: string
  requirements?: string[]
  audience?: Audience[]
  address?: Address | null
  coordinates?: Coordinates | null
  source?: Source
  verification: Verification
  /** Other names people search it by */
  aliases?: string[]
  display?: {
    /** Position in the emergency bar; without a value it isn't there */
    emergencyBarOrder?: number
  }
}
