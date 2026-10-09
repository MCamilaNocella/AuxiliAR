import type { ReactNode } from "react"
import { Link } from "react-router"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { CAMPAIGN_NOT_CARE } from "../../../Animals/Animals.sources"
import { POINTS } from "../../../HealthCenters/sections/Section2/Section2.points"
import { VAGINAL_CONDOM } from "../../../SexEducation/sections/Section2/Section2.constants"

/**
 * Más recursos · Preguntas frecuentes. Every answer is a short version of text that already exists in AuxiliAR or in an official
 * page we have read; where a category holds the full text (the data rules, the vaginal condom, the campaigns), it is imported
 * from there: one copy. Each answer names its source. Pending a clinical/legal review before the presentation.
 */
type Question = { id: string, question: string, answer: ReactNode, source: string }

const linkClass = "inline-flex min-h-11 items-center font-bold"
const dataPoint = (title: string) => POINTS.find((point) => point.title === title)?.text ?? []

const QUESTIONS: Question[] = [
  {
    id: "vacunas-orden",
    question: "¿Necesito orden médica para vacunarme?",
    answer: <p className="m-0">No. Según el Ministerio de Salud de la Nación, las vacunas del Calendario están disponibles en centros de salud y hospitales públicos de todo el país y no requieren una orden médica.</p>,
    source: "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación",
  },
  {
    id: "turno-empadronamiento",
    question: "¿Tengo que anotarme antes de sacar turno en un CeSAC?",
    answer: (
      <p className="m-0">
        Sí, una sola vez: el empadronamiento en el Sistema de Salud de la Ciudad, por el 147 o en persona, con un documento que acredite tu identidad.{" "}
        <Link to={`${PATHS.resources}?${SECTION_PARAM}=section-2`} className={linkClass}>
          Ver el paso a paso
        </Link>
      </p>
    ),
    source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC",
  },
  {
    id: "residentes",
    question: "¿Me pueden atender en la Ciudad si no vivo en la Ciudad?",
    answer: <p className="m-0">La Ley 153, Ley Básica de Salud de la Ciudad, dice que alcanza a todas las personas sin excepción, sean residentes o no residentes de la Ciudad de Buenos Aires.</p>,
    source: "Ley 153 de la Ciudad de Buenos Aires, art. 2",
  },
  {
    id: "anticonceptivos-costo",
    question: "¿Tengo que pagar los métodos anticonceptivos?",
    answer: (
      <p className="m-0">
        En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que «la atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas». En el
        resto del país, la Ley 25.673 los incluye en la cobertura médica obligatoria: se piden en centros de salud y hospitales, o a la obra social o prepaga.{" "}
        <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className={linkClass}>
          Ver los métodos
        </Link>
      </p>
    ),
    source: "Gobierno de la Ciudad de Buenos Aires · Métodos anticonceptivos; Ministerio de Salud de la Nación",
  },
  {
    id: "preservativo-vaginal",
    question: "¿Qué es el preservativo vaginal?",
    answer: (
      <>
        <p className="m-0">{VAGINAL_CONDOM.what[0]}</p>
        <p className="m-0 mt-2">{VAGINAL_CONDOM.what[1]}</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className={linkClass}>
            Cómo se usa y qué más tener en cuenta
          </Link>
        </p>
      </>
    ),
    source: "Ministerio de Salud de la Nación · Preguntas frecuentes sobre preservativo vaginal",
  },
  {
    id: "gratuita",
    question: "¿Qué significa «Gratuita» y «Gratuita con condiciones» en el mapa?",
    answer: (
      <>
        {dataPoint("Qué significa gratuito")
          .slice(0, 3)
          .map((paragraph) => (
            <p key={paragraph} className="m-0 mt-2 first:mt-0">
              {paragraph}
            </p>
          ))}
      </>
    ),
    source: "AuxiliAR · cómo verificamos los datos",
  },
  {
    id: "no-aparece",
    question: "Un lugar no aparece en el mapa, ¿quiere decir que no existe?",
    answer: (
      <>
        {dataPoint("Si no aparece, no quiere decir que no exista").map((paragraph) => (
          <p key={paragraph} className="m-0 mt-2 first:mt-0">
            {paragraph}
          </p>
        ))}
      </>
    ),
    source: "AuxiliAR · cómo verificamos los datos",
  },
  {
    id: "campana-veterinaria",
    question: "¿Una campaña gratuita es atención veterinaria gratuita?",
    answer: (
      <p className="m-0">
        No necesariamente. {CAMPAIGN_NOT_CARE}{" "}
        <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className={linkClass}>
          Ver los servicios de Salud animal
        </Link>
      </p>
    ),
    source: "AuxiliAR · Salud animal, con las páginas oficiales de cada municipio",
  },
]

/** Más recursos · Preguntas frecuentes: each question opens its answer (native details: works with keyboard and screen reader) */
export default function Section3Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">Respuestas cortas a dudas frecuentes. Abrí la pregunta para leerla.</p>
      <div className="flex flex-col gap-2">
        {QUESTIONS.map(({ id, question, answer, source }) => (
          <details key={id} className="rounded-2xl border border-line-strong bg-card">
            <summary className="flex min-h-14 cursor-pointer items-center px-4 py-3 text-lg font-extrabold">{question}</summary>
            <div className="px-4 pb-4">
              {answer}
              <p className="m-0 mt-3 text-sm text-ink-soft">Fuente: {source}.</p>
            </div>
          </details>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">
        Es información general: no reemplaza la consulta con un equipo de salud ni el asesoramiento legal. Para empezar a buscar atención, mirá{" "}
        <Link to={`${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-1`} className="font-bold">
          Dónde atenderme
        </Link>
        .
      </p>
    </div>
  )
}
