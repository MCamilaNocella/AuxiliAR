import type { ChatQuickRepliesProps } from "./ChatQuickReplies.types"

/** Answer buttons under Auxi's question, on the person's side of the chat */
export const ChatQuickReplies = ({ label, replies }: ChatQuickRepliesProps) => (
  <li>
    <div role="group" aria-label={label} className="flex flex-wrap justify-end gap-2">
      {replies.map((reply) => (
        <button
          key={reply.label}
          type="button"
          onClick={reply.onSelect}
          className="min-h-11 min-w-16 cursor-pointer rounded-full border-2 border-brand bg-card px-4 py-1.5 text-base font-bold text-brand transition-colors hover:bg-brand-soft"
        >
          {reply.label}
        </button>
      ))}
    </div>
  </li>
)
