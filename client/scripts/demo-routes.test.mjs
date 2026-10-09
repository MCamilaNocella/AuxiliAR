/*
 * Demo corrections: an address the app doesn't have shows its own page (not the router's technical error), with the way back;
 * the fractures link that cannot be verified is out of the guides; the map's small links have a 24px target.
 *   npm run demo:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (file) => readFile(join(root, file), "utf8")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { NotFound } = await vite.ssrLoadModule("/src/screens/NotFound/index.ts")
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")

test("404: its own page, with the way back to the home, and no number written by hand", () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(NotFound)))
  assert.match(text(html), /No encontramos esta página/)
  assert.match(html, /<h1[^>]*>No encontramos esta página<\/h1>/)
  for (const [label, href] of [["Volver al inicio", "/"], ["Encontrar atención", "/centros"], ["Primeros auxilios", "/primeros-auxilios"]]) {
    assert.ok(new RegExp(`<a[^>]*href="${href}"[^>]*>\\s*${label}\\s*</a>`).test(html), label)
  }
  assert.ok(!/\b(911|107|144|135|102)\b/.test(html), "the page says no emergency number: the layout's bar does")
})

test("404: it is the last route, inside the app layout (header, emergency bar and navigation stay)", async () => {
  const router = await read("src/router/index.tsx")
  const layout = router.indexOf("<AppLayout/>")
  const star = router.indexOf('path: "*"')
  assert.ok(layout > 0 && star > layout, "inside AppLayout")
  assert.ok(star > router.indexOf("PATHS.peerChatSketch"), "after every known route")
})

test("prototypes: /login, /auxi-modelos and /boceto-chat-personas exist only in development (import.meta.env.DEV), loaded on demand, none deleted", async () => {
  const router = await read("src/router/index.tsx")
  assert.ok(router.includes("const PROTOTYPES_ENABLED = import.meta.env.DEV"))
  for (const path of ["PATHS.auxiModels", "PATHS.peerChatSketch", "PATHS.login"]) {
    const at = router.indexOf(path)
    assert.ok(at > 0, path)
    // each one is inside a list that is empty when the flag is off
    const before = router.slice(0, at)
    assert.ok(before.lastIndexOf("PROTOTYPES_ENABLED") > before.lastIndexOf("const router"), `${path} only behind the flag`)
    assert.ok(router.slice(at, at + 120).includes("lazy:"), `${path} loaded on demand`)
  }
  assert.ok(!new RegExp('from "@[/]screens[/](AuxiModels|PeerChatSketch|Login)"').test(router),"no static import: nothing of them in the first load")
  // the screens are still there
  for (const dir of ["AuxiModels", "PeerChatSketch", "Login"]) await read(`src/screens/${dir}/index.ts`)
})

test("fractures: the page of argentina.gob.ar that cannot be opened is not a source of the guides; the Manual stays", async () => {
  const guides = await read("src/content/firstAid/guides/injuries.ts")
  assert.ok(!/FRACTURAS/.test(guides))
  assert.ok((guides.match(/sources: \[MANUAL\]/g) ?? []).length >= 2, "golpes y caídas and fracturas keep the Manual")
  const sources = await read("src/content/firstAid/sources.ts")
  assert.match(sources, /Temporarily out of the guides/)
})

test("map: the attribution links and the verification link have a target of 24px or more", async () => {
  const css = await read("src/components/places/PlacesMap/PlacesMap.css")
  assert.match(css, /leaflet-control-attribution a \{[^}]*min-height: 24px/)
  assert.match(await read("src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx"), /inline-flex min-h-11 items-center font-bold/)
})

/* ── Home: the highlighted way into Primeros auxilios ── */

test("home: a highlighted band leads to the guides, in its own color (not the red), with no number and nothing of the emergencies", async () => {
  const { FirstAidBand } = await vite.ssrLoadModule("/src/components/home/FirstAidBand/index.ts")
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(FirstAidBand)))
  assert.match(text(html), /Primeros auxilios/)
  assert.ok(new RegExp('<a[^>]*href="/primeros-auxilios"[^>]*>\s*Ver las guías').test(html), "a clear button to the guides")
  assert.ok(html.includes("bg-aid") && html.includes("text-on-aid") && !/alert/.test(html), "its own identity, not the emergency red")
  assert.ok(!/\b(911|107|144|135|102)\b|tel:/.test(html), "no number and nothing to call: the emergency block is untouched")
  // above the six cards, as the first thing of the home
  const home = await read("src/screens/Home/Home.tsx")
  assert.ok(home.indexOf("<FirstAidBand") > 0 && home.indexOf("<FirstAidBand") < home.indexOf("<Categories"))
  // the three themes define its colors (the contrast theme too), and the emergency components were not edited by this change
  const css = await read("src/index.css")
  assert.equal((css.match(/--color-aid:/g) ?? []).length, 3)
  assert.equal((css.match(/--color-on-aid:/g) ?? []).length, 3)
})
