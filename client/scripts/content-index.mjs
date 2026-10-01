/*
 * Builds the index of AuxiliAR's pages that Auxi's chat searches to suggest links.
 * Reads the categories (titles, descriptions and sections) and the first aid guides straight from src.
 * Auxi (the model) reads this list and decides which pages to suggest
 * and writes server/src/main/resources/content/content-index.json.
 *
 * Run it after changing the content:  npm run content:index
 */
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const output = resolve(root, "../server/src/main/resources/content/content-index.json")

// Vite loads the TypeScript content with the app's own config (the @/ alias, JSX…)
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
try {
  const { ALL_CATEGORIES } = await vite.ssrLoadModule("/src/content/categories/index.ts")
  const { PATHS, SECTION_PARAM } = await vite.ssrLoadModule("/src/router/paths.ts")
  const { FIRST_AID_GUIDES } = await vite.ssrLoadModule("/src/data/emergency.ts")
  const firstAid = ALL_CATEGORIES.find((category) => category.to === PATHS.firstAid)

  // firstAid: Primeros auxilios, the guides to follow in an emergency
  // hasInfo: the page has real content (its sections or the guide have a summary); Auxi only sends people to those
  const categoryPages = ALL_CATEGORIES.flatMap((category) => {
    const sectionsWithInfo = category.sections.filter((section) => section.summary)
    return [
      {
        title: category.title,
        path: category.to,
        summary: [`${category.description}. ${category.subtitle}`, ...sectionsWithInfo.map((section) => section.summary)].join(" "),
        firstAid: category === firstAid,
        hasInfo: sectionsWithInfo.length > 0,
      },
      ...sectionsWithInfo.map((section) => ({
        title: `${category.title} › ${section.title}`,
        path: `${category.to}?${SECTION_PARAM}=${section.id}`,
        summary: section.summary,
        firstAid: category === firstAid,
        hasInfo: true,
      })),
    ]
  })
  const guidePages = FIRST_AID_GUIDES.map((guide) => ({
    title: `${firstAid.title} › ${guide.title}`,
    path: PATHS.firstAidGuide(guide.slug),
    summary: guide.summary ?? `Guía paso a paso: ${guide.title}`,
    firstAid: true,
    hasInfo: Boolean(guide.summary),
  }))
  const pages = [...categoryPages, ...guidePages]

  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(pages, null, 2)}\n`)
  console.log(`content-index.json: ${pages.length} pages`)
} finally {
  await vite.close()
}
