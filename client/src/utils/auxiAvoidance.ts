/*
 * Where Auxi (the floating bot and its bubble) must not stay: on top of something a person needs to press. The geometry
 * is here, pure, so it can be tested; the hook that watches the page is hooks/useAuxiAvoidance.ts.
 */

export type Box = { left: number, top: number, right: number, bottom: number }

/** What a person can press or fill in: the bot must not cover it */
export const INTERACTIVE_SELECTOR = "a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [tabindex]:not([tabindex='-1'])"

/** Marks a region that must stay free while it is on screen (the urgent help card): Auxi steps aside */
export const AVOID_ATTRIBUTE = "data-auxi-avoid"

const area = ({ left, top, right, bottom }: Box) => Math.max(0, right - left) * Math.max(0, bottom - top)

const intersection = (a: Box, b: Box): Box => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) })

/**
 * Whether covering `element` with `bot` gets in the way: a small control (up to 64 px) with any overlap, a big one
 * (a card, a wide button) when the bot sits on its center or on at least a quarter of it. The corner of a big card
 * under the bot is not a problem; a phone number or a chevron under it is.
 * `strict` is for the bubble, which has text and no reason to touch a control: a control (up to 80 px tall) with an
 * overlap of 4 px or more in both directions already counts.
 */
export const overlapMatters = (bot: Box, element: Box, strict = false) => {
  const overlap = intersection(bot, element)
  const covered = area(overlap)
  if (covered === 0) return false
  const width = element.right - element.left
  const height = element.bottom - element.top
  if (width <= 64 && height <= 64) return true
  if (strict && height <= 80 && overlap.right - overlap.left >= 4 && overlap.bottom - overlap.top >= 4) return true
  const centerX = (element.left + element.right) / 2
  const centerY = (element.top + element.bottom) / 2
  const centered = centerX >= bot.left && centerX <= bot.right && centerY >= bot.top && centerY <= bot.bottom
  return centered || covered / area(element) >= 0.25
}

/** The bubble's text in the two lines of the compact design: a break after the first comma ("¡Hola! Soy Auxi," / "¿necesitás ayuda?") */
export const bubbleLines = (message: string): string[] => {
  const comma = message.indexOf(", ")
  return comma === -1 ? [message] : [message.slice(0, comma + 1), message.slice(comma + 2)]
}
