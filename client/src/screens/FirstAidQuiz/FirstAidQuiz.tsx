import { Page } from "@/components/layout/Page"
import { Quiz } from "@/components/quiz/Quiz"
import { FIRST_AID_HUB_PATH } from "@/content/firstAid"
import { FIRST_AID_QUIZ } from "@/content/firstAid/quiz"

const EXITS = [{ label: "Volver a las guías de primeros auxilios", to: FIRST_AID_HUB_PATH }]

/** /primeros-auxilios/quiz — the first aid quiz: every question comes from the text of a guide and sends back to it */
export const FirstAidQuizScreen = () => (
  <Page title="Quiz de primeros auxilios">
    <div className="flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">
        {`${FIRST_AID_QUIZ.length} situaciones para repasar lo que dicen las guías, una por pantalla. No hay respuestas “malas”: en cada una te explicamos por qué y te mostramos la guía.`}
      </p>
      <Quiz questions={FIRST_AID_QUIZ} exits={EXITS} />
    </div>
  </Page>
)
