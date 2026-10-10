import { Link } from "react-router"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { RIGHTS as MENTAL_RIGHTS } from "../../../MentalHealth/MentalHealth.rights"
import { SEXUAL_RIGHTS } from "../../../SexEducation/SexEducation.rights"

/**
 * Más recursos · Tus derechos en salud. Each card is one topic with its law, in plain words. The rights of mental health and of
 * sexual health are the SAME modules the categories show (MentalHealth.rights, SexEducation.rights): one copy each. The Ley 27.610
 * is left out on purpose: it is in editorial and legal review. Ley 153 and Ley 27.491 repeat what their articles say (arts. 2, 3,
 * 4, 7, 9 and 10), with no interpretation. Pending a legal review before the presentation (see the report of the round).
 */
const cardClass = "rounded-2xl border border-line-strong bg-card p-4 sm:p-6"
const linkClass = "inline-flex min-h-11 items-center font-bold"

export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Conocer tus derechos te ayuda a pedir atención con información. Esto dicen las leyes, en palabras simples. No es asesoramiento legal.</p>

      <section aria-labelledby="rt-public" className={cardClass}>
        <h3 id="rt-public" className="m-0 text-xl font-extrabold">
          Atención en el sistema público (Ciudad de Buenos Aires)
        </h3>
        <p className="m-0 mt-1">La Ley 153, Ley Básica de Salud de la Ciudad, dice que:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>Alcanza a todas las personas sin excepción, sean residentes o no residentes de la Ciudad.</li>
          <li>
            La gratuidad de las acciones de salud significa la exención de cualquier forma de pago directo en el área estatal. Los servicios prestados a personas con cobertura social o privada se compensan económicamente, a cargo de sus respectivas entidades.
          </li>
        </ul>
        <p className="m-0 mt-3 font-bold">Todas las personas tienen derecho, en su relación con el sistema de salud, a:</p>
        <ul className="m-0 mt-1 flex list-disc flex-col gap-2 pl-5">
          <li>El respeto a su personalidad, dignidad e identidad individual y cultural.</li>
          <li>No ser discriminadas por motivos económicos, culturales, sociales, religiosos, de género, de enfermedad ni de ningún otro tipo.</li>
          <li>La intimidad, la privacidad y la confidencialidad de la información sobre su salud.</li>
          <li>Acceder a su historia clínica y recibir información completa y comprensible sobre su salud.</li>
          <li>Elegir profesional y establecimiento, en la medida en que exista la posibilidad.</li>
          <li>Que el profesional les pida su consentimiento informado antes de hacer estudios y tratamientos.</li>
        </ul>
      </section>

      <section aria-labelledby="rt-mental" className={cardClass}>
        <h3 id="rt-mental" className="m-0 text-xl font-extrabold">
          Salud mental
        </h3>
        <p className="m-0 mt-1">La Ley Nacional de Salud Mental (26.657) reconoce estos derechos a las personas con padecimiento mental:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          {MENTAL_RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-2`} className={linkClass}>
            Ver más en Salud mental
          </Link>
        </p>
      </section>

      <section aria-labelledby="rt-sexual" className={cardClass}>
        <h3 id="rt-sexual" className="m-0 text-xl font-extrabold">
          Salud sexual y reproductiva, y educación sexual integral
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          {SEXUAL_RIGHTS.map(({ lead, text }) => (
            <li key={lead}>
              <b>{lead}</b> {text}
            </li>
          ))}
        </ul>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-3`} className={linkClass}>
            Ver más en Derechos y ESI
          </Link>
        </p>
      </section>

      <section aria-labelledby="rt-vaccines" className={cardClass}>
        <h3 id="rt-vaccines" className="m-0 text-xl font-extrabold">
          Vacunas
        </h3>
        <p className="m-0 mt-1">La Ley 27.491 de control de enfermedades prevenibles por vacunación establece que:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>Las vacunas y el acceso a los servicios de vacunación son gratuitos, con equidad social, para todas las etapas de la vida.</li>
          <li>Las vacunas del Calendario Nacional de Vacunación, las recomendadas para grupos en riesgo y las indicadas en una emergencia epidemiológica son obligatorias para todos los habitantes del país.</li>
          <li>El cumplimiento del Calendario se acredita con la certificación que determine la autoridad de aplicación.</li>
          <li>Quienes tienen a cargo a niños, niñas, adolescentes o personas incapaces son responsables de su vacunación.</li>
        </ul>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-5`} className={linkClass}>
            Ver el Calendario de vacunación
          </Link>
        </p>
      </section>
    </div>
  )
}
