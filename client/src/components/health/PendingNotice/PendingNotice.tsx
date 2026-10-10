import { ClipboardCheck } from "lucide-react"

type PendingNoticeProps = {
  /** What is pending: the text says what the page is not */
  children: string
  /** What kind of validation is pending (by default professional and documental: for health content) */
  title?: string
}

/** The notice of content that summarizes official sources but is not yet validated by professionals (same look as the one of the IVE/ILE section) */
export const PendingNotice = ({ children, title = "Pendiente de validación profesional y documental" }: PendingNoticeProps) => (
  <div className="flex items-start gap-3 rounded-2xl border-2 border-brand bg-brand-soft p-4">
    <ClipboardCheck aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-brand" />
    <div>
      <p className="m-0 font-extrabold">{title}</p>
      <p className="m-0 mt-1">{children}</p>
    </div>
  </div>
)
