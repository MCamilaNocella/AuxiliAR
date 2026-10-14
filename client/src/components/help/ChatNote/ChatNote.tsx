import type { ChatNoteProps } from "./ChatNote.types"

/** A short note from the app in the middle of the conversation (someone joined, the chat ended…) */
export const ChatNote = ({ children }: ChatNoteProps) => (
  <li className="self-center motion-safe:animate-message-in">
    <p className="m-0 rounded-full bg-field px-3 py-1 text-center text-sm font-bold text-ink-soft">{children}</p>
  </li>
)
