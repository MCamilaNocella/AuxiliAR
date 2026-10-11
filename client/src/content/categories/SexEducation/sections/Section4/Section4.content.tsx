import { Link } from "react-router"
import { Scale } from "lucide-react"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { IVE_PAGINA } from "../../SexEducation.sources"

/**
 * Salud sexual y ESI · Interrupción voluntaria y legal del embarazo (IVE/ILE). What the official sources say about rights, free
 * access, confidentiality and where to ask, in plain words. Sources: the Ley 27.610 (arts. 2, 4, 5, 10, 11 and 12) and the page
 * «Acceso a la Interrupción Voluntaria del Embarazo (IVE)» of argentina.gob.ar (texts in docs/investigacion/evidencia/
 * ive-ile-ley-27610-y-pagina-oficial.txt).
 *
 * It says nothing about procedures, methods or medication, names NO center as a provider (no source of this round says that a
 * specific center offers the service, so none is listed as confirmed) and copies no phone number: the national line and the line
 * against violence are named and their numbers are on their official pages (the second one is in the emergency bar).
 * PENDING professional (clinical and legal) validation before it is published: see docs/investigacion/ronda-contenido-4.
 */
const cardClass = "rounded-2xl border border-line-strong bg-card p-4 sm:p-6"

export default function Section4Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border-2 border-brand bg-brand-soft p-4">
        <Scale aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-brand" />
        <div>
          <p className="m-0 font-extrabold">Pendiente de validación legal y profesional</p>
          <p className="m-0 mt-1">
            Este contenido resume fuentes oficiales y todavía no fue revisado por profesionales del derecho ni de la salud. No es asesoramiento legal ni médico. Para tu caso, consultá a tu equipo de salud o a una línea de orientación.
          </p>
        </div>
      </div>

      <p className="m-0 text-lg text-ink">
        La Ley 27.610 regula el acceso a la interrupción voluntaria del embarazo (IVE) y a la atención postaborto en todo el país. Acá encontrás lo que dicen las fuentes oficiales sobre tus derechos, el acceso gratuito, la confidencialidad y
        dónde pedir orientación.
      </p>

      <section aria-labelledby="ive-rights" className={cardClass}>
        <h3 id="ive-rights" className="m-0 text-xl font-extrabold">
          Qué derechos reconoce la ley
        </h3>
        <p className="m-0 mt-1">Las mujeres y las personas con otras identidades de género con capacidad de gestar tienen derecho a:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Decidir la interrupción del embarazo, de acuerdo con la ley.</li>
          <li>Pedir y recibir la atención de la interrupción del embarazo en los servicios del sistema de salud.</li>
          <li>Pedir y recibir atención postaborto, aunque la decisión no estuviera dentro de los casos que la ley habilita.</li>
          <li>Prevenir embarazos no intencionales con información, educación sexual integral y métodos anticonceptivos eficaces.</li>
        </ul>
      </section>

      <section aria-labelledby="ive-kinds" className={cardClass}>
        <h3 id="ive-kinds" className="m-0 text-xl font-extrabold">
          IVE e ILE: qué es cada una
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>
            <b>IVE (interrupción voluntaria):</b> es el derecho a decidir y acceder a la interrupción del embarazo hasta la semana 14, inclusive, del proceso gestacional.
          </li>
          <li>
            <b>ILE (interrupción legal):</b> después de la semana 14, la ley habilita la interrupción solo en dos situaciones: si el embarazo es resultado de una violación, o si está en peligro la vida o la salud integral de la persona
            gestante.
          </li>
        </ul>
        <p className="m-0 mt-2 text-ink-soft">En los casos de violación, la ley pide una declaración jurada de la persona gestante ante el personal de salud; en niñas menores de 13 años no se la pide.</p>
      </section>

      <section aria-labelledby="ive-free" className={cardClass}>
        <h3 id="ive-free" className="m-0 text-xl font-extrabold">
          Acceso gratuito
        </h3>
        <p className="m-0 mt-1">
          La ley establece que el sector público de salud, las obras sociales y las prepagas deben incluir la cobertura integral y gratuita de la interrupción voluntaria del embarazo. El Gobierno nacional informa que el derecho rige en todo
          el territorio nacional, de forma gratuita y en todos los sistemas de salud: público, obras sociales y prepagas.
        </p>
        <p className="m-0 mt-2 text-ink-soft">
          Que la cobertura sea gratuita no asegura que haya turno o disponibilidad en un centro en particular. AuxiliAR no confirma centros concretos que brinden este servicio: el mapa solo muestra prestaciones con la gratuidad documentada
          para esa prestación.
        </p>
      </section>

      <section aria-labelledby="ive-how" className={cardClass}>
        <h3 id="ive-how" className="m-0 text-xl font-extrabold">
          Qué hace falta y en cuánto tiempo
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Alcanza con la expresión de voluntad y la firma del consentimiento informado: un documento que se firma después de recibir toda la información.</li>
          <li>El consentimiento informado es personal: nadie puede reemplazarte en ese ejercicio.</li>
          <li>El plazo máximo para acceder a la atención es de 10 días corridos desde que la pedís.</li>
        </ul>
        <p className="m-0 mt-2 text-ink-soft">La ley prevé reglas específicas para adolescentes y para personas con capacidad restringida. Consultalas en el texto de la ley o en la guía oficial (ver «Fuentes oficiales» más abajo).</p>
      </section>

      <section aria-labelledby="ive-privacy" className={cardClass}>
        <h3 id="ive-privacy" className="m-0 text-xl font-extrabold">
          Confidencialidad y trato
        </h3>
        <p className="m-0 mt-1">La ley establece que el personal de salud debe garantizar:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>
            <b>Trato digno</b>, con respeto por tus convicciones personales y morales.
          </li>
          <li>
            <b>Privacidad y confidencialidad:</b> debe informarte que la confidencialidad está garantizada y alcanzada por el secreto médico. Solo se comparte información o se incluye a tu familia o acompañante con tu autorización expresa.
          </li>
          <li>
            <b>Respeto por tus decisiones:</b> no deben juzgarse por consideraciones personales, religiosas o de otro tipo del personal de salud.
          </li>
          <li>
            <b>Información:</b> tenés derecho a recibir información actualizada, comprensible y en un formato accesible, y a una escucha activa y respetuosa.
          </li>
          <li>Acceso a la atención postaborto y a métodos anticonceptivos.</li>
        </ul>
      </section>

      <Disclosure title="Si el profesional objeta por motivos de conciencia">
        <p className="m-0">
          Según la ley, el profesional que deba intervenir directamente puede ejercer la objeción de conciencia, pero tiene que derivarte de buena fe, sin demoras, a otro profesional. No puede negarse si tu vida o tu salud están en peligro y
          necesitás atención inmediata, y no se puede objetar la atención postaborto.
        </p>
        <p className="m-0 text-ink-soft">Si el efector es privado o de una obra social y no tiene profesionales que no objeten, tiene que derivarte a otro efector similar y hacerse cargo de la gestión y los costos de la derivación.</p>
      </Disclosure>

      <section aria-labelledby="ive-help" className={cardClass}>
        <h3 id="ive-help" className="m-0 text-xl font-extrabold">
          Orientación y si te ponen obstáculos
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>
            <b>Para consultar sobre la IVE o la ILE, o para denunciar incumplimientos u obstáculos:</b> la página oficial indica comunicarse con la línea nacional de salud sexual del Ministerio de Salud (sus días y horarios están en «Dónde buscar atención») o con la línea nacional de violencia de género, que está entre los números de la barra de emergencias de esta página.
          </li>
          <li>
            <b>Si te niegan o te demoran la atención:</b> el Gobierno nacional señala que impedir el acceso a la IVE es violencia contra la libertad reproductiva.
          </li>
          <li>
            <b>Si tu obra social o prepaga no cumple:</b> la página oficial indica iniciar un reclamo ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.
          </li>
        </ul>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
          <li>
            <OutLink href={IVE_PAGINA.url}>Cómo acceder a la IVE: la página oficial del Gobierno nacional</OutLink>
          </li>
          <li>
            <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
              Línea nacional de salud sexual: horarios y contacto
            </Link>
          </li>
          <li>
            <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className="inline-flex min-h-11 items-center font-bold">
              Consejerías de la Ciudad, con un contacto por IVE/ILE de cada centro
            </Link>
          </li>
        </ul>
        <p className="m-0 mt-2 text-ink-soft">
          Son páginas oficiales que se abren afuera, para ver contactos y horarios que cambian. AuxiliAR no verificó cada centro de la lista ni confirma que ofrezca el servicio: consultalo antes de ir.
        </p>
      </section>

      <section aria-labelledby="ive-limits" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="ive-limits" className="m-0 text-xl font-extrabold">
          Lo que esta página no dice
        </h3>
        <p className="m-0 mt-1">
          No explica procedimientos, métodos ni medicación, y no recomienda ningún centro. Para eso, consultá a un equipo de salud o a una línea de orientación.
        </p>
        <p className="m-0 mt-1">
          <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className="inline-flex min-h-11 items-center font-bold">
            Para prevenir un embarazo no intencional: Anticoncepción y prevención
          </Link>
        </p>
      </section>

    </div>
  )
}
