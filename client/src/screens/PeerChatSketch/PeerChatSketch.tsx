import { Auxi } from "@/components/help/Auxi"
import { Page } from "@/components/layout/Page"
import { SKETCH_FLOWS } from "./PeerChatSketch.constants"

/**
 * Design sketch (not working): a chat inside Auxi that connects people who need help
 * with volunteers who want to help. Only by link (/boceto-chat-personas), not in the nav.
 */
export const PeerChatSketch = () => (
  <Page title="Boceto: chat entre personas" description="Pantallas de ejemplo, todavía no funcionan.">
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-4">
      <Auxi className="w-20 sm:w-24" />
      <p className="m-0 flex-1 text-muted">
        Idea: desde el chat con Auxi, conectar a quien necesita ayuda con una persona voluntaria. Auxi se queda en la conversación para sumar información y avisar si hay una emergencia.
      </p>
    </div>

    {SKETCH_FLOWS.map(({ id, title, description, screens }) => (
      <section key={id} aria-labelledby={`flow-${id}`} className="mt-12">
        <h2 id={`flow-${id}`} className="m-0 text-xl font-extrabold">{title}</h2>
        <p className="m-0 mt-1 mb-4 text-muted">{description}</p>
        <ul role="list" className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {screens.map(({ id: screenId, title: screenTitle, note, Screen }) => (
            <li key={screenId} className="flex flex-col items-center gap-3">
              <h3 className="m-0 w-full max-w-80 text-lg font-extrabold">{screenTitle}</h3>
              <Screen />
              <p className="m-0 w-full max-w-80 text-sm text-muted">{note}</p>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </Page>
)
