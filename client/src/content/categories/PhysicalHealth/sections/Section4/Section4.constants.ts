import { centersLink } from "@/router/centersLink"
import type { QuizQuestion } from "@/utils/quiz/quiz"

/**
 * Quiz of Salud general: eight everyday situations about where to go, vaccines, prevention, mouth and eyes care,
 * and how to use AuxiliAR. It teaches how to find the right care; it never asks to diagnose anything.
 * Every wrong answer says why, kindly. Places named here are the ones AuxiliAR has verified in the Ciudad de Buenos Aires.
 */
export const PHYSICAL_HEALTH_QUIZ: QuizQuestion[] = [
  {
    id: "control-de-rutina",
    format: "¿Dónde ir?",
    topic: "Atención primaria",
    prompt: "Hace tiempo que no te hacés un control. Te sentís bien, pero querés revisar cómo estás. ¿A dónde te conviene ir?",
    options: [
      {
        id: "guardia",
        text: "A una guardia",
        correct: false,
        feedback: "La guardia es para problemas que necesitan atención en el momento. Para un control, un centro de salud es una mejor puerta de entrada.",
      },
      {
        id: "centro",
        text: "A un centro de salud (CeSAC)",
        correct: true,
        feedback: "Los centros de salud son el lugar para controles, consultas habituales y prevención. Ahí un equipo puede conocer tu situación y acompañarte en el tiempo.",
      },
      {
        id: "emergencias",
        text: "Llamo al número de emergencias",
        correct: false,
        feedback: "El número de emergencias es para cuando hay riesgo inmediato. Un control de rutina se hace en un centro de salud.",
      },
    ],
    why: "Un control sin urgencia se hace en la atención primaria: en un centro de salud, sin esperar a tener un problema.",
    learning: "Controles y consultas de rutina: centro de salud. No hace falta esperar a tener un problema.",
    action: { label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) },
  },
  {
    id: "carnet",
    format: "Verdadero o falso",
    topic: "Vacunación",
    prompt: "Verdadero o falso: para saber si tenés vacunas pendientes, conviene revisar tu carnet de vacunación.",
    options: [
      {
        id: "verdadero",
        text: "Verdadero",
        correct: true,
        feedback: "El carnet muestra qué vacunas ya te dieron. Con él, el equipo del vacunatorio puede ver qué falta y orientarte.",
      },
      {
        id: "falso",
        text: "Falso",
        correct: false,
        feedback: "Es al revés: el carnet es la mejor guía para saber qué vacunas ya tenés. Si no lo encontrás, igual podés consultar en un vacunatorio.",
      },
    ],
    why: "El carnet es el registro de tus vacunas. Tenerlo a mano ayuda a saber qué te falta.",
    learning: "Llevá tu carnet de vacunación al vacunatorio. Si no lo tenés, consultá igual.",
    action: { label: "Encontrar vacunatorio", to: centersLink({ filter: "vaccination" }) },
  },
  {
    id: "desmayo",
    format: "¿Qué harías primero?",
    topic: "Emergencias",
    prompt: "Una persona se desmaya delante tuyo y no responde cuando la llamás. ¿Qué hacés primero?",
    options: [
      {
        id: "traslado",
        text: "La llevo yo a una guardia",
        correct: false,
        feedback: "Es normal querer actuar rápido, pero ante un riesgo inmediato conviene pedir ayuda profesional al número de emergencias antes que improvisar un traslado.",
      },
      {
        id: "esperar",
        text: "Espero un rato a ver si se le pasa",
        correct: false,
        feedback: "Esperar puede hacer perder un tiempo valioso. Si una persona no responde, es una emergencia.",
      },
      {
        id: "emergencias",
        text: "Llamo al número de emergencias y pido ayuda",
        correct: true,
        feedback: "Cuando hay riesgo inmediato, pedir ayuda al número de emergencias de tu localidad es lo primero. Pueden orientarte y enviar ayuda.",
      },
    ],
    why: "Una persona que no responde es una situación de emergencia: lo primero es llamar al número de emergencias.",
    learning: "Riesgo inmediato: llamá primero al número de emergencias de tu localidad. Los números están siempre arriba en AuxiliAR.",
    action: { label: "Ver números de emergencia", emergency: true },
  },
  {
    id: "dolor-de-muela",
    format: "¿Dónde ir?",
    topic: "Salud bucal",
    prompt: "Tenés un dolor de muela muy fuerte que no te deja dormir y es de noche. ¿Qué es lo más adecuado?",
    options: [
      {
        id: "turno",
        text: "Esperar a que abra un consultorio y pedir turno",
        correct: false,
        feedback: "Pedir turno sirve para controles y tratamientos. Un dolor muy fuerte puede necesitar atención el mismo día, y para eso existen las guardias odontológicas.",
      },
      {
        id: "guardia-odontologica",
        text: "Buscar una guardia odontológica",
        correct: true,
        feedback:
          "Las guardias odontológicas atienden urgencias. En la Ciudad de Buenos Aires, AuxiliAR tiene verificadas las de los hospitales Carrillo y Dueñas: atienden las 24 horas, todos los días, y son gratuitas.",
      },
      {
        id: "emergencias",
        text: "Llamo al número de emergencias",
        correct: false,
        feedback: "El número de emergencias es para riesgo inmediato para la vida. Un dolor de muela necesita atención urgente, y la guardia odontológica es el lugar indicado.",
      },
    ],
    why: "Las guardias odontológicas existen para las urgencias de la boca; los turnos, para controles y tratamientos programados.",
    learning: "Urgencia odontológica: guardia odontológica. Controles y tratamientos: turno en un servicio de odontología.",
    action: { label: "Ver guardias odontológicas", to: centersLink({ filter: "emergency", query: "odontol" }) },
  },
  {
    id: "me-siento-bien",
    format: "Verdadero o falso",
    topic: "Controles preventivos",
    prompt: "Verdadero o falso: si me siento bien, no necesito ningún control.",
    options: [
      {
        id: "verdadero",
        text: "Verdadero",
        correct: false,
        feedback: "Es una idea muy común, pero no siempre es así: hay cosas que se pueden detectar antes de dar molestias.",
      },
      {
        id: "falso",
        text: "Falso",
        correct: true,
        feedback: "Muchos controles sirven justamente para prevenir o detectar a tiempo, aunque no tengas molestias.",
      },
    ],
    why: "Los controles preventivos te cuidan antes de que aparezca un problema. Cuáles te corresponden depende de tu edad y tu situación, y tu equipo de salud te orienta.",
    learning: "Sentirte bien no reemplaza los controles. Consultá cuáles te corresponden a vos.",
    action: { label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) },
  },
  {
    id: "odontologo",
    format: "Cuidarte",
    topic: "Salud bucal",
    prompt: "¿Cuándo conviene ir al odontólogo o a la odontóloga?",
    options: [
      {
        id: "solo-dolor",
        text: "Solo cuando me duele",
        correct: false,
        feedback: "Cuando duele, muchas veces el problema ya avanzó. Revisarte antes ayuda a atenderlo a tiempo.",
      },
      {
        id: "nunca",
        text: "Nunca, si me cepillo bien los dientes",
        correct: false,
        feedback: "Cepillarte bien es fundamental, pero no reemplaza la revisión de un o una profesional.",
      },
      {
        id: "controles",
        text: "También para controles, aunque no me duela nada",
        correct: true,
        feedback: "Los controles odontológicos ayudan a prevenir problemas y a atenderlos a tiempo.",
      },
    ],
    why: "Cuidar la boca incluye cepillarte bien y hacerte controles, no solo ir cuando hay dolor.",
    learning: "La salud bucal también se controla: no hace falta esperar a que duela.",
    action: { label: "Buscar atención odontológica", to: centersLink({ filter: "dentistry" }) },
  },
  {
    id: "golpe-en-el-ojo",
    format: "¿Dónde ir?",
    topic: "Salud visual",
    prompt: "Te golpeaste un ojo y te duele mucho. ¿Qué hacés?",
    options: [
      {
        id: "guardia-oftalmologica",
        text: "Voy a una guardia oftalmológica",
        correct: true,
        feedback:
          "Un golpe en el ojo con dolor fuerte puede necesitar atención urgente. En la Ciudad de Buenos Aires, AuxiliAR tiene verificada la guardia del Hospital Santa Lucía: atiende las 24 horas, todos los días.",
      },
      {
        id: "esperar",
        text: "Espero unos días a ver cómo sigue",
        correct: false,
        feedback: "Con un golpe y dolor fuerte conviene no esperar: puede necesitar atención urgente.",
      },
      {
        id: "turno",
        text: "Pido un turno para el mes que viene",
        correct: false,
        feedback: "Los turnos programados sirven para controles. Un golpe con dolor intenso es mejor que lo vea una guardia.",
      },
    ],
    why: "Las guardias oftalmológicas existen para las urgencias de los ojos; los turnos, para controles.",
    learning: "Urgencia en los ojos: guardia oftalmológica. Control de la vista: atención de rutina.",
    action: { label: "Ver guardias oftalmológicas", to: centersLink({ filter: "emergency", query: "oftalm" }) },
  },
  {
    id: "informacion-verificada",
    format: "Usar AuxiliAR",
    topic: "Usar AuxiliAR",
    prompt: "En la ficha de un centro de AuxiliAR leés “Información verificada”. ¿Qué significa?",
    options: [
      {
        id: "turnos",
        text: "Que seguro hay turnos disponibles",
        correct: false,
        feedback: "La verificación habla de que los datos fueron revisados, no de que haya turnos libres. Para eso, mirá cómo atenderte en la ficha o usá los contactos.",
      },
      {
        id: "revisada",
        text: "Que revisamos sus datos en fuentes oficiales y los volvemos a revisar cada tanto",
        correct: true,
        feedback: "AuxiliAR muestra solo información verificada, con la fecha de revisión y la fuente oficial. Cuando vence el plazo, deja de mostrarla hasta volver a comprobarla.",
      },
      {
        id: "nunca-cambia",
        text: "Que esos datos nunca cambian",
        correct: false,
        feedback: "Los datos pueden cambiar. Por eso se revisan cada tanto y la ficha te dice cuándo fue la última vez.",
      },
    ],
    why: "“Verificada” quiere decir que se comprobó contra una fuente oficial y que se vuelve a revisar en una fecha que figura en la ficha.",
    learning: "Cada ficha muestra qué atención hay, cómo contactar, cuándo se verificó y la fuente oficial.",
    action: { label: "Ver centros de atención", to: centersLink() },
  },
]
