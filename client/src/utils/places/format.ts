import taxonomy from "@/data/resources/taxonomy.json"
import type { Address, Appointment, Audience, Hours, ResolvedService, ResourceCost } from "@/data/resources"

/*
 * How the verified data is written for people. Rule: only what the data says. A missing or unknown value
 * is never written as "null" or "unknown", and never filled in (no hours, cost, appointment or requirement is guessed).
 */

const labelOf = (list: { id: string, label: string }[], id: string) => list.find((entry) => entry.id === id)?.label

/** The name of the service: its own, or the one of its type */
export const serviceName = (service: ResolvedService) => service.name ?? labelOf(taxonomy.serviceTypes, service.type) ?? service.type

export const audienceLabel = (audience: Audience) => labelOf(taxonomy.audiences, audience) ?? audience

/* ── Hours ── */

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
/** Week order for people: Monday first (the data uses 0 = Sunday) */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const joinList = (items: string[]) => (items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`)

/** [1,2,3,4,5] → "Lunes a viernes"; any other set is listed day by day: [1,3,4,5] → "Lunes, miércoles, jueves y viernes" */
export const formatDays = (days: number[]) => {
  const positions = WEEK_ORDER.map((day, index) => (days.includes(day) ? index : -1)).filter((index) => index >= 0)
  const isOneRun = positions.length >= 3 && positions[positions.length - 1] - positions[0] === positions.length - 1
  if (isOneRun) return capitalize(`${DAY_NAMES[WEEK_ORDER[positions[0]]]} a ${DAY_NAMES[WEEK_ORDER[positions[positions.length - 1]]]}`)
  return capitalize(joinList(positions.map((position) => DAY_NAMES[WEEK_ORDER[position]])))
}

/** "08:00" → "8:00" */
const formatTime = (time: string) => time.replace(/^0/, "")

export type HoursView =
  | { kind: "unknown" }
  | { kind: "open24h", note?: string }
  | { kind: "schedule", lines: { days: string, times: string }[], note?: string }

/** `null` (or no hours at all) is "not known": it is never shown as 24 h */
export const describeHours = (hours: Hours | null | undefined): HoursView => {
  if (!hours) return { kind: "unknown" }
  if (hours.open24h) return { kind: "open24h", note: hours.note }
  const groups = new Map<string, { days: number[], ranges: string[] }>()
  for (const { days, from, to } of hours.schedule ?? []) {
    const key = [...days].sort().join(",")
    const group = groups.get(key) ?? { days, ranges: [] }
    group.ranges.push(`${formatTime(from)} a ${formatTime(to)}`)
    groups.set(key, group)
  }
  if (groups.size === 0) return hours.note ? { kind: "schedule", lines: [], note: hours.note } : { kind: "unknown" }
  return {
    kind: "schedule",
    lines: [...groups.values()].map(({ days, ranges }) => ({ days: formatDays(days), times: `${ranges.join(" y ")} h` })),
    note: hours.note,
  }
}

/* ── Cost and appointment ── */

/** `unknown` gives nothing here: not knowing the cost never means it is free */
export const costLabel = (cost: ResourceCost) => {
  if (cost === "free") return "Atención gratuita"
  if (cost === "paid") return "Arancelado"
  if (cost === "mixed") return "Parte gratuito y parte arancelado"
  return undefined
}

export const appointmentLabel = ({ mode }: Appointment) => {
  if (mode === "required") return "Con turno previo"
  if (mode === "recommended") return "Se recomienda sacar turno"
  if (mode === "not-required") return "Podés ir sin turno"
  return undefined
}

/**
 * What stands out about a service: only what its verified data states. Free care that comes with a condition
 * (costNote) is not highlighted as plain "Atención gratuita": the condition is shown instead.
 */
export const serviceHighlights = (service: ResolvedService) => {
  const highlights: string[] = []
  if (service.hours?.open24h) highlights.push("24 h")
  if (service.appointment.mode === "not-required") highlights.push("Podés ir sin turno")
  if (service.cost === "free" && !service.costNote) highlights.push("Atención gratuita")
  return highlights
}

/** Label of a type of establishment (taxonomy.facilityTypes) */
export const facilityTypeLabel = (type: string | undefined) => labelOf(taxonomy.facilityTypes, type ?? "")

/* ── Address and dates ── */

/** "Sánchez de Bustamante 2529" */
export const streetLine = ({ street, number }: Address) => [street, number].filter(Boolean).join(" ")

/** What fits on a card: street and neighborhood, when they exist */
export const shortAddress = (address: Address | null | undefined) => {
  if (!address) return undefined
  const text = [streetLine(address), address.neighborhood].filter(Boolean).join(", ")
  return text || undefined
}

/** "2026-10-07" → "7 de octubre de 2026" (no time zone shifts: it's a calendar date) */
export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}
