/*
 * Profile of a downloaded dataset: what is in it before anyone decides how to read it. Pure (text in, object out).
 * It writes nothing and decides nothing; it is what a person reads before writing or changing an adapter and a mapping.
 */
import { getAdapter } from "./adapters/index.mjs"
import { cleanText } from "./lib/normalize.mjs"
import { parsePoint } from "./lib/wkt.mjs"

export const profileText = ({ manifest, text }) => {
  const adapter = getAdapter(manifest.adapter)
  const rows = adapter.parseRows(text)
  const columns = rows.length > 0 ? Object.keys(rows[0].fields) : []
  const missingColumns = adapter.REQUIRED_COLUMNS.filter((column) => !columns.includes(column))
  const extraColumns = columns.filter((column) => !adapter.REQUIRED_COLUMNS.includes(column))

  const stats = columns.map((name) => {
    const values = rows.map((row) => cleanText(row.fields[name]))
    return { name, filled: values.filter(Boolean).length, empty: values.filter((value) => !value).length, distinct: new Set(values.filter(Boolean)).size, maxLength: Math.max(0, ...values.map((value) => value.length)) }
  })

  const points = rows.map((row) => parsePoint(row.fields.geometry)).filter(Boolean)
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const range = (values) => (values.length ? [Math.min(...values), Math.max(...values)] : null)
  const looksGeographic = points.length > 0 && points.every(([x, y]) => Math.abs(x) <= 180 && Math.abs(y) <= 90)

  // Keys of the adapter (so duplicates and empty keys show up here, before any candidate exists)
  const keys = rows.map((row) => adapter.normalizeRow(row, { manifest, crs: null }).key)
  const duplicateKeys = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))]

  const vocabulary = {}
  for (const row of rows) {
    const fieldName = manifest.adapter === "caba-cesac" ? "especialid" : "esp"
    const separator = manifest.adapter === "caba-cesac" ? " - " : null
    const raw = cleanText(row.fields[fieldName])
    for (const item of separator ? raw.split(separator) : [raw]) {
      const term = cleanText(item)
      if (term) vocabulary[term] = (vocabulary[term] ?? 0) + 1
    }
  }

  return {
    source: manifest.id,
    rows: rows.length,
    columns,
    missingColumns,
    extraColumns,
    stats,
    keys: { distinct: new Set(keys).size, empty: keys.filter((key) => !key).length, duplicates: duplicateKeys },
    geometry: {
      points: points.length,
      withoutPoint: rows.length - points.length,
      xRange: range(xs),
      yRange: range(ys),
      looksGeographic,
      declaredCrs: manifest.crs.declared,
      consistentWithDeclared: manifest.crs.declared === "EPSG:4326" ? looksGeographic : points.length > 0 && !looksGeographic,
    },
    encodingProblems: rows.filter((row) => Object.values(row.fields).some((value) => String(value).includes("�"))).length,
    vocabulary: Object.fromEntries(Object.entries(vocabulary).sort((a, b) => b[1] - a[1])),
  }
}

export const formatProfile = (profile) => {
  const lines = [`# Perfil de ${profile.source}`, "", `- Filas: ${profile.rows}`, `- Columnas: ${profile.columns.join(", ")}`]
  if (profile.missingColumns.length > 0) lines.push(`- **Faltan columnas que el adapter necesita: ${profile.missingColumns.join(", ")}**`)
  if (profile.extraColumns.length > 0) lines.push(`- Columnas que el adapter no usa: ${profile.extraColumns.join(", ")}`)
  lines.push(`- Claves: ${profile.keys.distinct} distintas, ${profile.keys.empty} vacías, repetidas: ${profile.keys.duplicates.join(", ") || "ninguna"}`)
  const g = profile.geometry
  lines.push(`- Geometría: ${g.points} puntos, ${g.withoutPoint} filas sin punto; x ${JSON.stringify(g.xRange)}, y ${JSON.stringify(g.yRange)}; parece ${g.looksGeographic ? "latitud/longitud" : "proyectada"}; el manifiesto declara ${g.declaredCrs} (${g.consistentWithDeclared ? "coherente" : "**NO coherente**"})`)
  lines.push(`- Filas con caracteres de reemplazo (problema de codificación): ${profile.encodingProblems}`, "", "## Columnas", "", "| columna | con dato | vacías | distintos | largo máx. |", "|---|---|---|---|---|")
  for (const s of profile.stats) lines.push(`| ${s.name} | ${s.filled} | ${s.empty} | ${s.distinct} | ${s.maxLength} |`)
  lines.push("", "## Vocabulario de especialidades (para la tabla de mapeo)", "")
  for (const [term, count] of Object.entries(profile.vocabulary)) lines.push(`- ${term} (${count})`)
  return `${lines.join("\n")}\n`
}
