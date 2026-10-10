import { ActionLink } from "@/components/health/ActionLink"
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
