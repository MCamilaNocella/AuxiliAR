/* Markdown report of a run: deterministic (no clock), so re-running with the same inputs gives the same bytes */
import { countBy } from "./candidates.mjs"

const table = (rows, headers) => [`| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n")

export const buildReport = ({ manifest, snapshot, candidates, diff, linkedProposals }) => {
  const byTier = countBy(candidates, (c) => c.tier)
  const warnings = countBy(candidates, (c) => c.gates.filter((g) => g.level !== "info").map((g) => g.code))
  const infos = countBy(candidates, (c) => c.gates.filter((g) => g.level === "info").map((g) => g.code))
  const withCoordinates = candidates.filter((c) => c.proposal?.coordinates || (c.record.coordinates && !c.gates.some((g) => g.level === "warn" && g.code.startsWith("coordinates")))).length
  const publishable = candidates.filter((c) => c.publishable.ready).length
  const lines = [
    `# Candidatos de ${manifest.id}`,
    "",
    `Fuente: ${manifest.label} — ${manifest.organization}`,
    `Licencia: ${manifest.license}. ${manifest.attribution}`,
    `Descarga: ${snapshot.retrievedAt}${snapshot.officialUpdatedAt ? ` (actualizado por el publicador el ${snapshot.officialUpdatedAt})` : ""}, sha256 ${snapshot.sha256.slice(0, 12)}…`,
    "",
    "## Resumen",
    "",
    `- Registros: ${candidates.length}`,
    `- T1 (todo en orden): ${byTier.T1 ?? 0} · T2 (necesitan revisión): ${byTier.T2 ?? 0} · T3 (bloqueados): ${byTier.T3 ?? 0}`,
    `- Con coordenadas utilizables: ${withCoordinates}`,
    `- **Publicables hoy: ${publishable}** (necesitan al menos una prestación con mapeo aprobado y tipo de establecimiento aprobado)`,
    `- Ya publicados / enlazados: ${candidates.filter((c) => c.link.status === "linked").length} · parecidos a uno publicado: ${candidates.filter((c) => c.link.status === "suggested").length}`,
    "",
    "## Avisos (cuentan para el tier)",
    "",
    Object.keys(warnings).length ? table(Object.entries(warnings).sort(), ["código", "registros"]) : "Ninguno.",
    "",
    "## Información (no cambia el tier)",
    "",
    Object.keys(infos).length ? table(Object.entries(infos).sort(), ["código", "registros"]) : "Ninguna.",
    "",
  ]
  if (diff) {
    lines.push("## Cambios desde la descarga anterior", "", diff.comparedWith ? `Comparado con la descarga del ${diff.comparedWith}.` : "No hay una descarga anterior con la que comparar.", "", `- Nuevos: ${diff.added.join(", ") || "ninguno"}`, `- Ya no están (posible baja: nunca se borra solo): ${diff.removed.join(", ") || "ninguno"}`, `- Cambiaron: ${diff.changed.map((c) => `${c.key} (${c.fields.join(", ")})`).join("; ") || "ninguno"}`, "")
  }
  if (linkedProposals.length > 0) {
    lines.push("## Propuestas sobre lugares ya publicados (NO se aplican solas)", "", table(linkedProposals.flatMap(({ resourceId, proposals }) => proposals.map((p) => [resourceId, p.field, String(p.published), String(p.source)])), ["lugar", "campo", "publicado", "la fuente dice"]), "")
  }
  lines.push("## Detalle", "", table(candidates.map((c) => [c.key, c.id, c.tier, c.link.status === "linked" ? `enlazado (${c.link.resourceId})` : c.link.status, c.gates.filter((g) => g.level !== "info").map((g) => g.code).join(", ") || "—", c.publishable.ready ? "sí" : c.publishable.blockers.join(", ") || "no"]), ["clave", "id", "tier", "enlace", "avisos", "publicable"]), "")
  return `${lines.join("\n")}`
}
