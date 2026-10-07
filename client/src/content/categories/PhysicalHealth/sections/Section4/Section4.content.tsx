import { Quiz } from "@/components/quiz/Quiz"
import { PATHS } from "@/router/paths"
import { physicalCentersLink } from "@/content/categories/PhysicalHealth/centersLink"
import { PHYSICAL_HEALTH_QUIZ } from "./Section4.constants"

const EXITS = [
  { label: "Encontrar atención", to: physicalCentersLink() },
  { label: "Volver a Salud física", to: PATHS.topic("salud-fisica") },
]

/** Salud física · Quiz — learn where to go and how to take care, one everyday situation at a time */
export default function Section4Content() {
  return (
    <div className="mt-2">
      <p className="m-0 max-w-2xl text-muted">
        {`${PHYSICAL_HEALTH_QUIZ.length} situaciones de todos los días para aprender dónde ir y cómo cuidarte. No hay respuestas “malas”: en cada una te explicamos por qué.`}
      </p>
      <Quiz questions={PHYSICAL_HEALTH_QUIZ} exits={EXITS} />
    </div>
  )
}
