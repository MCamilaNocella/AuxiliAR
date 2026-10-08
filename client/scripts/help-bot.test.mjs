/*
 * Tests of Auxi's help bot: the compact greeting bubble and the rules that keep it from covering what a person needs.
 * The rules are checked here as pure geometry and as markup; what the page really does when it scrolls is checked in a real browser.
 *   npm run help:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const avoid = await vite.ssrLoadModule("/src/utils/auxiAvoidance.ts")
const { HelpBubble } = await vite.ssrLoadModule("/src/components/help/HelpBubble/index.ts")
const { HELP_MESSAGE } = await vite.ssrLoadModule("/src/components/help/HelpBot/HelpBot.constants.ts")
const { UrgentHelp } = await vite.ssrLoadModule("/src/components/places/UrgentHelp/index.ts")

const box = (left, top, right, bottom) => ({ left, top, right, bottom })

test("the greeting is the one the team approved, and the bubble breaks it after the comma", () => {
  assert.equal(HELP_MESSAGE, "¡Hola! Soy Auxi, ¿necesitás ayuda?")
  assert.deepEqual(avoid.bubbleLines(HELP_MESSAGE), ["¡Hola! Soy Auxi,", "¿necesitás ayuda?"])
  assert.deepEqual(avoid.bubbleLines("¿Necesitás ayuda?"), ["¿Necesitás ayuda?"], "no comma, no break")
  const html = renderToStaticMarkup(createElement(HelpBubble, { message: HELP_MESSAGE, onOpen() {}, onClose() {} }))
  assert.ok(html.includes("¡Hola! Soy Auxi,<!-- --><br/>¿necesitás ayuda?") || (html.includes("¡Hola! Soy Auxi,") && html.includes("<br/>") && html.includes("¿necesitás ayuda?")))
  // the close button stays, named, and the bubble keeps its design (w-max: as wide as its longest line)
  assert.ok(html.includes('aria-label="Cerrar mensaje"') && html.includes("w-max"))
})

test("the bot keeps its mascot, its name for assistive technology and its close button, and it can step aside", async () => {
  const source = await readFile(join(root, "src/components/help/HelpBot/HelpBot.tsx"), "utf8")
  assert.ok(source.includes('aria-label="Abrir chat de ayuda con Auxi"'))
  assert.ok(source.includes("<Auxi ") && source.includes("hideBubble"))
  // it asks the hook where it must not be, and tucks (never removes) the bot: the button keeps working
  assert.ok(source.includes("useAuxiAvoidance(containerRef, bubbleRef)"))
  assert.ok(source.includes("hover:translate-x-0 focus-within:translate-x-0"))
  // the bubble is hidden, not unmounted, while it would cover something: it can still be measured, and it comes back
  assert.ok(source.includes('"invisible opacity-0"'))
})

test("what the bot must not cover: a small control under it counts, the corner of a big card does not", () => {
  const bot = box(300, 700, 372, 772)
  // a phone button, a chevron, a checkbox: small, any overlap
  assert.equal(avoid.overlapMatters(bot, box(340, 720, 380, 760)), true)
  assert.equal(avoid.overlapMatters(bot, box(360, 740, 384, 764)), true)
  // nothing in common
  assert.equal(avoid.overlapMatters(bot, box(10, 10, 60, 60)), false)
  assert.equal(avoid.overlapMatters(bot, box(373, 700, 420, 772)), false, "touching is not covering")
  // a big card: its corner under the bot is fine, its center or a quarter of it is not
  const card = box(16, 600, 374, 900)
  assert.equal(avoid.overlapMatters(bot, card), false)
  assert.equal(avoid.overlapMatters(box(100, 700, 300, 800), card), true, "on its center")
  assert.equal(avoid.overlapMatters(box(16, 600, 374, 720), box(16, 650, 374, 890)), true, "more than a quarter of it")
  // a wide button: covered at its end, not its middle, still matters when it is a quarter or more
  const wide = box(16, 740, 374, 790)
  assert.equal(avoid.overlapMatters(box(300, 700, 372, 772), wide), false, "a fifth of it")
  assert.equal(avoid.overlapMatters(box(200, 700, 372, 772), wide), true, "covers its right half")
})

test("what is pressable is what the bot looks at, and the urgent help card asks it to step aside", async () => {
  for (const piece of ["a[href]", "button", "input", "select", "textarea", "summary", "[role=button]"]) assert.ok(avoid.INTERACTIVE_SELECTOR.includes(piece), piece)
  assert.equal(avoid.AVOID_ATTRIBUTE, "data-auxi-avoid")
  const draw = (context) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(UrgentHelp, { context })))
  assert.ok(draw("crisis").includes('data-auxi-avoid=""'), "the crisis card is a region the bot steps aside from")
  assert.ok(!draw("habitual").includes("<section data-auxi-avoid"), "the calm line is not")
  // the hook decides on a modal panel too, and waits for the scroll to stop before moving the bot
  const hook = await readFile(join(root, "src/hooks/useAuxiAvoidance.ts"), "utf8")
  assert.ok(hook.includes("[role=dialog][aria-modal=true]") && hook.includes("SETTLE_MS") && hook.includes("checkVisibility"))
  // the ficha of a place is that modal panel
  const detail = await readFile(join(root, "src/components/places/PlaceDetail/PlaceDetail.tsx"), "utf8")
  assert.ok(detail.includes('role="dialog"') && detail.includes('aria-modal="true"'))
})

test("every page ends clear of the bot", async () => {
  const layout = await readFile(join(root, "src/components/layout/AppLayout/AppLayout.tsx"), "utf8")
  assert.ok(layout.includes("pb-[calc(var(--bottom-nav-h)+6.5rem)]"))
})
