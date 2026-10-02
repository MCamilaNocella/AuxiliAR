import type { ReactNode } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Auxi } from "@/components/help/Auxi"
import type { BubbleProps, FakeButtonProps, PhoneProps } from "./PeerChatSketch.types"

// Sketch pieces: they look like the app but do nothing (spans, not buttons), so nothing in the phones is focusable

/** Phone-sized screen: header on top, scrolling-looking body, footer at the bottom */
export const Phone = ({ header, footer, children }: PhoneProps) => (
  <div className="flex min-h-136 w-full max-w-80 flex-col overflow-hidden rounded-[2rem] border-4 border-line-strong bg-card text-ink shadow-lg">
    <div className="flex items-center gap-2 border-b border-line px-3 py-2">{header}</div>
    <div className="flex flex-1 flex-col gap-3 px-3 py-3">{children}</div>
    {footer && <div className="border-t border-line px-3 py-2">{footer}</div>}
  </div>
)

export const PhoneTitle = ({ back = false, children }: { back?: boolean, children: ReactNode }) => (
  <>
    {back && <ArrowLeft aria-hidden="true" className="size-5 flex-none" />}
    <span className="min-w-0 flex-1 font-extrabold">{children}</span>
  </>
)

const BUTTON_STYLES = {
  primary: "bg-brand text-on-brand",
  outline: "border-2 border-brand bg-card text-brand",
  alert: "bg-alert text-on-alert",
  ghost: "bg-field text-ink",
} as const

export const FakeButton = ({ variant = "primary", children }: FakeButtonProps) => (
  <span className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-center text-sm font-bold ${BUTTON_STYLES[variant]}`}>
    {children}
  </span>
)

export const Chip = ({ selected = false, children }: { selected?: boolean, children: ReactNode }) => (
  <span className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${selected ? "border-brand bg-brand-soft text-brand" : "border-line-strong text-ink-soft"}`}>
    {children}
  </span>
)

export const Bubble = ({ from, initial, children }: BubbleProps) =>
  from === "me" ? (
    <div className="flex justify-end">
      <p className="m-0 max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3 py-2 text-sm/snug text-on-brand">{children}</p>
    </div>
  ) : (
    <div className="flex items-start gap-2">
      <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
        {initial}
      </span>
      <p className="m-0 max-w-[85%] rounded-2xl rounded-tl-sm border border-line-strong bg-surface-alt px-3 py-2 text-sm/snug">{children}</p>
    </div>
  )

/** Auxi talking in the chat (or stepping into a chat between people) */
export const AuxiBubble = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2">
    <span aria-hidden="true" className="flex size-8 flex-none items-center justify-center rounded-full bg-brand-soft">
      <Auxi className="size-7" />
    </span>
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line-strong bg-surface-alt px-3 py-2 text-sm/snug">
      <span className="sr-only">Auxi: </span>
      {children}
    </div>
  </div>
)

/** Small centered note from the app (someone joined, chat ended…) */
export const SystemNote = ({ children }: { children: ReactNode }) => (
  <p className="m-0 self-center rounded-full bg-field px-3 py-1 text-center text-xs font-bold text-ink-soft">{children}</p>
)

export const FakeInput = ({ placeholder }: { placeholder: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex min-h-11 flex-1 items-center rounded-full border border-control-line bg-field px-4 text-sm text-muted">{placeholder}</span>
    <span aria-hidden="true" className="flex size-11 flex-none items-center justify-center rounded-full bg-brand text-on-brand">
      <Send className="size-5" />
    </span>
  </div>
)
