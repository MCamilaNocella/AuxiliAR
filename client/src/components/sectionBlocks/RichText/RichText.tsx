import type { ReactNode } from "react"
import type { RichTextProps } from "./RichText.types"


const TAG = /<(\/?)(b|strong|i|em|a)\b([^>]*)>/g

/** The few inline tags of the models, turned into React elements (no raw HTML is ever inserted) */
const parse = (text: string): ReactNode[] => {
  const root: { tag: string, href?: string, children: ReactNode[] } = { tag: "root", children: [] }
  const stack = [root]
  let last = 0
  for (const match of text.matchAll(TAG)) {
    const top = stack[stack.length - 1]
    if (match.index > last) top.children.push(text.slice(last, match.index))
    last = match.index + match[0].length
    const [, closing, tag, attrs] = match
    if (closing) {
      if (stack.length > 1 && top.tag === tag) {
        stack.pop()
        const parent = stack[stack.length - 1]
        const key = parent.children.length
        const kids = top.children
        parent.children.push(
          tag === "a" ? (
            <a key={key} href={top.href} target="_blank" rel="noopener noreferrer">
              {kids}
            </a>
          ) : tag === "i" || tag === "em" ? (
            <i key={key}>{kids}</i>
          ) : (
            <b key={key}>{kids}</b>
          ),
        )
      }
      continue
    }
    stack.push({ tag, href: tag === "a" ? /href="([^"]*)"/.exec(attrs)?.[1] : undefined, children: [] })
  }
  if (last < text.length) stack[stack.length - 1].children.push(text.slice(last))
  return root.children
}

const isPlain = (text: string) => !text.includes("<")

/** A text of the category models, with its bold, italics and links */
export const RichText = ({ text }: RichTextProps) => <>{isPlain(text) ? text : parse(text)}</>

