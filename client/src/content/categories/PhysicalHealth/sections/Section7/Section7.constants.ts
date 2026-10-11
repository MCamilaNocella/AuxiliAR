import { Activity, Footprints, ShieldCheck } from "lucide-react"
import type { Subsection } from "../../SubsectionPage"

/**
 * Salud general · Actividad física y bienestar. Informative first version: how much to move (a general reference), the free options
 * in general terms, and what to do before starting. It names no place, program, day, hour or activity: none has been verified for
 * the map, and a local offer changes. Written from the general public information of the sources listed below, without a link until
 * each one is checked.
 * PENDING professional (clinical) validation, of the figures included, and documental validation of the sources before it is published.
 */
export const PHYSICAL_ACTIVITY: Subsection = {
  notice:
    "Este contenido resume orientaciones generales de fuentes oficiales. Las cifras todavía no fueron revisadas por profesionales de la salud ni se verificaron los enlaces oficiales. No es una indicación médica: para tu caso, consultá con tu equipo de salud.",
  intro: "Moverte un poco todos los días hace bien al cuerpo y al ánimo. No hace falta un gimnasio ni equipo: cualquier movimiento suma.",
  blocks: [
    {
      id: "how-much",
      icon: Activity,
      title: "Cuánto moverse",
      lead: "Referencias generales de la Organización Mundial de la Salud (a validar).",
      points: [
        "Personas adultas: entre 150 y 300 minutos por semana de actividad moderada.",
        "Niñas, niños y adolescentes: en promedio 60 minutos por día de actividad de moderada a intensa.",
        "Pasar menos tiempo sentada o sentado y hacer pausas para moverte.",
        "Empezar de a poco: hacer algo es mejor que no hacer nada.",
      ],
      note: "Son referencias para la población en general, no una indicación para tu caso.",
    },
    {
      id: "free-options",
      icon: Footprints,
      title: "Opciones que no cuestan nada",
      lead: "Estas formas de moverse no requieren pagar una cuota:",
      points: [
        "Caminar, subir escaleras o bailar en casa.",
        "Hacer ejercicios con el peso del propio cuerpo, sin equipo.",
        "Usar plazas y parques de acceso libre para caminar, correr o jugar.",
        "Algunos municipios y gobiernos ofrecen actividades gratuitas, por ejemplo al aire libre. Los lugares, los días y los horarios cambian y todavía no los tenemos verificados: preguntá en el área de deportes o de salud de tu municipio antes de ir.",
      ],
    },
    {
      id: "before-starting",
      icon: ShieldCheck,
      title: "Antes de empezar",
      lead: "Para moverte con tranquilidad:",
      points: [
        "Si tenés una condición de salud, estás embarazada o hace mucho que no te movés, consultá con tu equipo de salud antes de empezar.",
        "Empezá despacio, tomá agua y parate si algo te duele.",
        "Dolor de pecho, falta de aire intensa, mareo fuerte o desmayo son una emergencia: usá la barra de emergencias de AuxiliAR.",
      ],
    },
  ],
  mapFilter: "physical-activity",
  mapTopic: "actividad física y bienestar",
  sources: [{ organization: "Organización Mundial de la Salud", title: "Directrices sobre actividad física y hábitos sedentarios (2020)" }],
}
