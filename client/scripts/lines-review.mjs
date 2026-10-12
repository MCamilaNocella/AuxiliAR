/*
 * The periodic review of the help numbers: which lines are due, with the page to open for each one.
 *   npm run lines:due            every line, the nearest review first
 *   npm run lines:due -- --days 60   only those due within 60 days (default: all)
 * The procedure is in client/src/data/resources/README.md ("Revisión periódica de los números").
 */
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const LINES_FILE = join(clientRoot, "src/data/resources/lines/nacional.json")

const dayNumber = (day) => Math.round(Date.parse(`${day}T00:00:00Z`) / 86_400_000)

/** Every verified line with how many days are left before its review (negative: it is past), nearest first */
export const linesDue = (resources, today, withinDays = Infinity) =>
  resources
    .filter((line) => line.kind !== "service" && line.verification?.status === "verified")
    .map((line) => {
      const daysLeft = dayNumber(line.verification.nextReviewDue) - dayNumber(today)
      return {
        id: line.id,
        numbers: [...new Set(line.contacts.map((contact) => contact.display))].join(", "),
        verifiedAt: line.verification.verifiedAt,
        nextReviewDue: line.verification.nextReviewDue,
        daysLeft,
        state: daysLeft <= 0 ? "VENCIDA" : daysLeft <= 30 ? "por vencer" : "vigente",
        url: line.source.url,
      }
    })
    .filter((entry) => entry.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft || a.id.localeCompare(b.id))

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = process.argv.indexOf("--days")
  const within = flag > 0 ? Number(process.argv[flag + 1]) : Infinity
  const today = new Date().toISOString().slice(0, 10)
  const { resources } = JSON.parse(await readFile(LINES_FILE, "utf8"))
  const rows = linesDue(resources, today, within)
  console.log(`Revisión de números de ayuda · hoy ${today} · ${rows.length} línea(s)\n`)
  for (const row of rows) {
    console.log(`${row.state.padEnd(10)} ${row.nextReviewDue} (${row.daysLeft >= 0 ? `faltan ${row.daysLeft} días` : `hace ${-row.daysLeft} días`})  ${row.id}  [${row.numbers}]  verificada el ${row.verifiedAt}`)
    console.log(`           ${row.url}`)
  }
  console.log("\nPara cada una: abrir la página, comparar número, alcance y horario con lo que dice el dato, y seguir el procedimiento del README.")
}
