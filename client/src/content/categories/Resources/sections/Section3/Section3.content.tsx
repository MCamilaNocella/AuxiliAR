import type { ReactNode } from "react"
import { Link } from "react-router"
import { Disclosure } from "@/components/health/Disclosure"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { CAMPAIGN_NOT_CARE } from "../../../Animals/Animals.sources"
import { POINTS } from "../../../About/About.points"
import { VAGINAL_CONDOM } from "../../../SexEducation/sections/Section2/Section2.constants"
import { FAQ_REFERENCES } from "./Section3.references"

/**
 * Más recursos · Preguntas frecuentes. Every answer is a short version of text that already exists in AuxiliAR or in an official
 * page we have read; where a category holds the full text (the data rules, the vaginal condom, the campaigns), it is imported
 * from there: one copy. The source of each answer is in "Sobre AuxiliAR" (Section3.references.ts), not under the answer. Pending a clinical/legal review before the presentation.
 */
type Answer = { id: string, answer: ReactNode }

const linkClass = "inline-flex min-h-11 items-center font-bold"
const dataPoint = (title: string) => POINTS.find((point) => point.title === title)?.text ?? []

const ANSWERS: Answer[] = [
  {
    id: "vacunas-orden",
    answer: <p className="m-0">No. Según el Ministerio de Salud de la Nación, las vacunas del Calendario están disponibles en centros de salud y hospitales públicos de todo el país y no requieren una orden médica.</p>,
  },
  {
    id: "turno-empadronamiento",
    answer: (
      <p className="m-0">
        Sí, una sola vez: el empadronamiento en el Sistema de Salud de la Ciudad, por el 147 o en persona, con un documento que acredite tu identidad.{" "}
        <Link to={`${PATHS.resources}?${SECTION_PARAM}=section-2`} className={linkClass}>
          Ver el paso a paso
        </Link>
      </p>
    ),
  },
  {
    id: "residentes",
    answer: <p className="m-0">La Ley 153, Ley Básica de Salud de la Ciudad, dice que alcanza a todas las personas sin excepción, sean residentes o no residentes de la Ciudad de Buenos Aires.</p>,
  },
  {
    id: "anticonceptivos-costo",
    answer: (
      <p className="m-0">
        En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que «la atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas». En el
        resto del país, la Ley 25.673 los incluye en la cobertura médica obligatoria: se piden en centros de salud y hospitales, o a la obra social o prepaga.{" "}
        <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className={linkClass}>
          Ver los métodos
        </Link>
      </p>
    ),
  },
  {
    id: "preservativo-vaginal",
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
  },
  {
    id: "gratuita",
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
  },
  {
    id: "no-aparece",
    answer: (
      <>
        {dataPoint("Si no aparece, no quiere decir que no exista").map((paragraph) => (
          <p key={paragraph} className="m-0 mt-2 first:mt-0">
            {paragraph}
          </p>
        ))}
      </>
    ),
  },
  {
    id: "campana-veterinaria",
    answer: (
      <p className="m-0">
        No necesariamente. {CAMPAIGN_NOT_CARE}{" "}
        <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className={linkClass}>
          Ver los servicios de Atención veterinaria
        </Link>
      </p>
    ),
  },
]

/** Más recursos · Preguntas frecuentes: each question opens its answer (native details: works with keyboard and screen reader) */
export default function Section3Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">Respuestas cortas a dudas frecuentes. Abrí la pregunta para leerla.</p>
      <div className="flex flex-col gap-2">
        {FAQ_REFERENCES.map(({ id, question }) => (
          <Disclosure key={id} title={question}>
            {ANSWERS.find((entry) => entry.id === id)?.answer}
          </Disclosure>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">
        Es información general: no reemplaza la consulta con un equipo de salud ni el asesoramiento legal. Para empezar a buscar atención, mirá{" "}
        <Link to={`${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
          Dónde atenderme
        </Link>
        .
      </p>
    </div>
  )
}
