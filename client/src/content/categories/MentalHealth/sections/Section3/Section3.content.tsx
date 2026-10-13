import { ActionLink } from "@/components/health/ActionLink"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import { DirectoryList } from "../../DirectoryBlocks"
import { YOGA_CABA } from "../../MentalHealth.directory"
import { OMS_ANSIEDAD, OMS_ESTRES, OMS_GUIA } from "../../MentalHealth.sources"
import { PATHS, SECTION_PARAM } from "@/router/paths"

/**
 * Every habit is in the OMS page "Estrés" (30 de marzo de 2026), in its own words and without numbers or doses:
 *  - horarios fijos: "ayuda a sentir que controlamos mejor nuestra vida y a ser más eficaces"
 *  - dormir lo suficiente, con horarios parejos y sin dispositivos electrónicos antes de acostarse
 *  - hablar con familiares y amigos sobre las preocupaciones
 *  - hacer ejercicio a diario puede ayudar a reducir el estrés
 *  - alimentación equilibrada, con frutas y hortalizas frescas, e hidratación adecuada
 *  - reducir el tiempo con las noticias si generan estrés
 *  - "aprender técnicas de autoayuda practicándolas durante unos minutos al día"
 *  - "cuando resulta difícil controlar el estrés conviene acudir a un profesional de la salud o a otra persona del entorno en quien se tenga confianza"
 */
const HABITS = [
  { title: "Una rutina", text: "Tener horarios fijos ayuda a sentir que controlás mejor tu vida." },
  { title: "Dormir lo suficiente", text: "Mantené horarios parejos y evitá las pantallas antes de acostarte." },
  { title: "Hablar con quienes querés", text: "Contarle a tu familia y a tus amigos lo que te preocupa puede ayudarte a sentirte mejor." },
  { title: "Moverte todos los días", text: "Hacer ejercicio a diario puede ayudar a reducir el estrés." },
  { title: "Comer de forma equilibrada", text: "Con frutas y verduras frescas, y tomando suficiente agua." },
  { title: "Poner límites a las noticias", text: "Si te generan estrés, reducí el tiempo que les dedicás." },
  { title: "Técnicas de autoayuda", text: "Aprendelas y practicalas unos minutos por día." },
]

/** Five short ideas of pause from the skills of the OMS guide "En tiempos de estrés, haz lo que importa" */
const PAUSES = [
  { title: "Poner los pies en la tierra", text: "Apoyá los pies y registrá lo que ves y escuchás, sin exigirte eliminar la emoción." },
  { title: "Respiración pausada", text: "Probá una respiración suave, sin forzar la profundidad ni retener el aire. Si te incomoda, detené la práctica." },
  { title: "Desengancharse de los pensamientos", text: "Podés notar un pensamiento y volver a lo que estás haciendo, sin discutir con él." },
  { title: "Una acción pequeña", text: "Elegí una acción pequeña que te acerque a algo que valorás." },
  { title: "Amabilidad con vos", text: "Podés tratarte con amabilidad mientras una emoción difícil está presente." },
]

export default function Section3Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Estas ideas ayudan a manejar el estrés y a cuidar tu bienestar día a día. No reemplazan la atención profesional.</p>

      <ul className="m-0 flex list-disc flex-col gap-2.5 pl-5">
        {HABITS.map(({ title, text }) => (
          <li key={title}>
            <b>{title}.</b> {text}
          </li>
        ))}
      </ul>

      <section aria-labelledby="mh-pause" className="flex flex-col gap-3">
        <div>
          <h3 id="mh-pause" className="m-0 text-xl font-extrabold">
            Cinco ideas para una pausa
          </h3>
          <p className="m-0 mt-1">Están tomadas de las habilidades de la guía ilustrada de la OMS. Probá la que te sirva; si una te incomoda, dejala.</p>
        </div>
        <ul className="m-0 flex list-disc flex-col gap-2.5 pl-5">
          {PAUSES.map(({ title, text }) => (
            <li key={title}>
              <b>{title}.</b> {text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mh-oms">
        <h3 id="mh-oms" className="m-0 text-xl font-extrabold">
          Materiales de la OMS
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Necesitás conexión para abrirlos.</p>
        <ul role="list" className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
          <li>
            <OutLink href={OMS_GUIA.url}>{OMS_GUIA.label}</OutLink>
          </li>
          <li>
            <OutLink href={OMS_ESTRES.url}>Preguntas y respuestas sobre el estrés</OutLink>
          </li>
          <li>
            <OutLink href={OMS_ANSIEDAD.url}>Información sobre los trastornos de ansiedad</OutLink>
          </li>
        </ul>
      </section>

      <Disclosure title="Clases de yoga en la Ciudad (Plazas Activas)">
        <p className="m-0">Clases al aire libre del Gobierno de la Ciudad, para mayores de 18 años y con inscripción previa. Es una actividad de bienestar, no un tratamiento. Confirmá la grilla antes de ir.</p>
        <p className="m-0 text-ink-soft">La página oficial no informa el costo. Se pide lugar por mail a inscripciones.dsydd@buenosaires.gob.ar, aceptando los términos para actividades en espacios públicos.</p>
        <DirectoryList items={YOGA_CABA} />
      </Disclosure>

      <section aria-labelledby="mh-help" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="mh-help" className="m-0 text-xl font-extrabold">
          Cuándo pedir ayuda profesional
        </h3>
        <p className="m-0 mt-1">Cuando te resulta difícil controlar el estrés, conviene acudir a un profesional de la salud o hablar con una persona de confianza.</p>
        <div className="mt-3">
          <ActionLink to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-1`} variant="primary">
            Dónde buscar ayuda
          </ActionLink>
        </div>
      </section>

      <p className="m-0 text-sm text-ink-soft">Es una guía general de bienestar: no es un tratamiento ni un diagnóstico.</p>
    </div>
  )
}
