import type { Source } from "@/components/health/SourceList"
import {
  METODO_AHE,
  METODO_DIU,
  METODO_IMPLANTE,
  METODO_INYECTABLES,
  METODO_LIGADURA,
  METODO_PASTILLAS_COMBINADAS,
  METODO_PASTILLAS_UNA_HORMONA,
  METODO_VASECTOMIA,
} from "../../SexEducation.sources"

/**
 * What each method is, in the words of its own page of the Ministerio de Salud de la Nación (argentina.gob.ar/salud/sexual,
 * Creative Commons Atribución 4.0), read on 2026-10-09; the text is saved in
 * docs/investigacion/evidencia/nacion-metodos-anticonceptivos-y-preservativo-vaginal.txt. It repeats the page: no dose, no
 * efficacy figure and no indication of its own. Which method suits a person is for their health team to say.
 * Marked for clinical review before the presentation (see the report of the round).
 */
export type Method = {
  id: string
  title: string
  /** What it is and how it is used, as the page says it */
  about: string[]
  source: Source
}

export const METHODS: Method[] = [
  {
    id: "pastillas-combinadas",
    title: "Pastillas combinadas",
    about: [
      "Contienen dos hormonas similares a las producidas por el cuerpo de las mujeres (estrógeno y progesterona). En general vienen en cajas de 21 pastillas: se toman 21 días seguidos, se descansa 7 días y luego se empieza otra caja. También hay cajas de 28 pastillas: se toman todos los días hasta terminar la caja y, sin pausa, se empieza una nueva.",
      "No se recomiendan en algunas situaciones de salud, que evalúa un profesional.",
    ],
    source: METODO_PASTILLAS_COMBINADAS,
  },
  {
    id: "pastillas-una-hormona",
    title: "Pastillas de una sola hormona («minipíldora»)",
    about: [
      "Cambian el moco del cuello del útero y también impiden la ovulación. Se recomiendan a quienes estén amamantando o a quienes, por razones de salud, no puedan recibir estrógenos.",
      "Se toman todos los días hasta terminar la caja y se comienza con otra al día siguiente. En general no se presenta el sangrado todos los meses.",
    ],
    source: METODO_PASTILLAS_UNA_HORMONA,
  },
  {
    id: "inyectables",
    title: "Anticonceptivos inyectables",
    about: [
      "Tienen hormonas que evitan la ovulación. Algunos se colocan una vez al mes y otros cada tres meses. El efecto es el mismo que con las pastillas, pero no hay que tomarlas todos los días.",
      "La inyección mensual debe aplicarse siempre en la misma fecha (por ejemplo, todos los días 4 de cada mes). La trimestral, cada 3 meses, siempre el mismo día. Es importante recordar la fecha de colocación.",
    ],
    source: METODO_INYECTABLES,
  },
  {
    id: "implante",
    title: "Implante subdérmico",
    about: [
      "Contiene una o más varillas pequeñas, finas y flexibles que se colocan en el brazo, debajo de la piel, con anestesia local. Liberan una hormona (progestágeno) en forma continua que inhibe la ovulación.",
      "Brinda protección entre 3 y 5 años, según indique el prospecto del dispositivo, y puede retirarse cuando se desee. Conviene anotar la fecha de colocación y cuándo debe retirarse. La mayoría de las mujeres pueden usarlo, incluso quienes no pueden tomar estrógenos y quienes están amamantando.",
    ],
    source: METODO_IMPLANTE,
  },
  {
    id: "diu",
    title: "Dispositivo intrauterino (DIU)",
    about: [
      "DIU de cobre: es un pequeño objeto de plástico recubierto de un hilo de cobre que se coloca dentro del útero y que impide la fecundación. Es efectivo durante cinco o diez años, según el modelo, y puede retirarse en cualquier momento. Todos los modelos deben ser colocados por un profesional de la salud.",
      "DIU con levonorgestrel: protege de 3 a 5 años, según el modelo. Su principal mecanismo de acción es la alteración del moco cervical.",
      "Según el Ministerio, el papanicolaou y las ecografías no son requisito para colocarlo, y no se necesita el consentimiento de la pareja ni de nadie más. Es fundamental hacer controles periódicos y recordar la fecha de colocación y de retiro.",
    ],
    source: METODO_DIU,
  },
  {
    id: "ahe",
    title: "Anticoncepción hormonal de emergencia (AHE)",
    about: [
      "Es una pastilla que se usa después de una relación sexual sin protección, si no se usó otro método o si falló el que se estaba usando. Es más efectiva cuanto antes se tome, sobre todo dentro de las primeras 12 horas. Se puede tomar hasta cinco días después, pero cuanto más tiempo pasa, menos efectiva es.",
      "Tiene cobertura integral en hospitales, centros de salud, obras sociales y prepagas. También se consigue en farmacias sin necesidad de receta médica.",
    ],
    source: METODO_AHE,
  },
  {
    id: "ligadura",
    title: "Ligadura tubaria",
    about: [
      "Es un método anticonceptivo permanente. Profesionales médicos lo realizan con una cirugía en las trompas uterinas, que evita que el espermatozoide se junte con el óvulo. Después se sigue ovulando y menstruando como siempre, y el placer sexual no cambia.",
      "Según la Ley 26.130, a partir de la mayoría de edad las personas pueden acceder: solo hay que dejar constancia por escrito de la decisión después de recibir información completa y comprensible. No hace falta el consentimiento de la pareja ni de nadie más, ni haber tenido hijos.",
      "La Ley 27.655 reconoce que las personas con discapacidad tienen derecho a dar su consentimiento informado por sí mismas, y que en ningún caso se requiere autorización judicial.",
    ],
    source: METODO_LIGADURA,
  },
  {
    id: "vasectomia",
    title: "Vasectomía",
    about: [
      "Es un método anticonceptivo irreversible: una cirugía sencilla en los conductos deferentes, que transportan los espermatozoides. Después se sigue eyaculando como siempre, no afecta las erecciones y el placer sexual no cambia. El semen se ve igual, pero no contiene espermatozoides.",
      "Es efectiva luego de los primeros tres meses o de las primeras 20 eyaculaciones: por eso se recomienda usar otro método durante ese período y hacer el control médico para comprobarlo.",
      "Según la Ley 26.130, a partir de la mayoría de edad las personas pueden acceder; solo hay que dejar constancia por escrito de la decisión. No hace falta el consentimiento de la pareja ni de nadie más, ni haber tenido hijos.",
    ],
    source: METODO_VASECTOMIA,
  },
]

/** The Ministerio's own sentence, repeated on the page of every method except the condom and the AHE (which has its own) */
export const NO_STI_PROTECTION = "Este método no protege del VIH ni de otras infecciones de transmisión sexual: por eso se recomienda la doble protección con preservativo."

/** The Ministerio's own text on the vaginal condom, by question. Repeats its page; nothing is added */
export const VAGINAL_CONDOM = {
  what: [
    "El preservativo vaginal es un método de barrera que se usa en prácticas sexuales de penetración, ya sea con pene, dildo u otros juguetes sexuales. Protege el interior de la vagina y parte de la vulva.",
    "Mide aproximadamente 17 cm, como el preservativo peneano, y es de nitrilo, un material apto para personas alérgicas al látex. Viene lubricado con silicona. Tiene un anillo externo, más ancho en el extremo abierto, y un anillo interno flexible.",
    "Usado correctamente, ayuda a reducir el riesgo de transmisión del VIH y de otras ITS, como la sífilis, y reduce la posibilidad de embarazos no intencionales. No elimina el riesgo por completo. Permite mayor autonomía en las prácticas sexuales de las personas con vagina.",
  ],
  how: [
    "Antes de abrirlo, revisá que el envase no esté roto o dañado y verificá la fecha de vencimiento. Sin abrirlo, frotá el paquete entre las manos limpias para esparcir el lubricante.",
    "Abrilo desde la flecha o la ranura del borde, sin tijeras ni dientes, y sacá el preservativo.",
    "Elegí una posición cómoda. Agarrá el anillo interno (extremo cerrado) entre el pulgar y el índice y apretalo por los lados hasta formar una punta.",
    "Separá los labios externos de la vulva y usá esa punta para empujar el preservativo hacia adentro. Deslizá los dedos dentro y empujá el anillo interior hasta donde sea posible.",
    "Tiene que ajustarse a la pared de la vagina sin retorcerse. Sostené el anillo exterior al inicio de la penetración: queda fuera del cuerpo y cubre en parte la vulva.",
    "Para retirarlo, agarrá el anillo exterior y giralo para extraerlo con suavidad. Podés envolverlo en un pañuelo de papel o en su envase y tirarlo a la basura.",
  ],
  notes: [
    "Se usa una sola vez, y siempre uno nuevo en cada práctica sexual, sea con la misma persona o con otras.",
    "Puede colocarse hasta 8 horas antes de la práctica sexual, pero es importante usarlo desde el inicio.",
    "No se usa junto con el preservativo peneano, porque pueden romperse con la fricción. Su uso no está recomendado para prácticas vulva-vulva ni para sexo oral o anal.",
    "Se puede combinar con pastillas, DIU, inyectables e implantes. Se puede usar durante la menstruación (si usás copita o tampón, retiralos antes de colocarlo) y se puede orinar con él puesto, corriendo el anillo externo hacia un lado.",
    "Pueden usarlo todas las personas con vagina, también en el posparto, posaborto o poscesárea reciente. El Ministerio indica que no está recomendado para personas con neovagina o histerectomizadas, porque no puede ajustarse al cuello del útero.",
    "Si una persona con discapacidad motora elige este método y tiene dificultad para colocarlo, puede pedir asistencia a otra persona.",
  ],
  ifItFails: [
    "Su rotura es poco frecuente. Para evitarla, no uses el preservativo vaginal junto con el peneano.",
    "Si se corrió, se rompió o no lo usaste, es importante que consultes cuanto antes en un centro de salud u hospital público, para reducir la posibilidad de infección por VIH y otras ITS y evitar un embarazo no intencional.",
    "Según el Ministerio, la profilaxis post exposición al VIH (PEP) debe tomarse dentro de las 72 horas de la posible exposición, y cuanto antes mejor. La anticoncepción de emergencia puede tomarse hasta 5 días después, aunque es más efectiva en las primeras 12 horas.",
  ],
  where: [
    "El Ministerio informa que los preservativos vaginales se entregan en espacios de salud como centros de salud, consejerías, hospitales y organizaciones de la sociedad civil, y que dónde conseguirlos se consulta con el referente de cada provincia.",
    "AuxiliAR no tiene confirmado en qué centros concretos se entregan: preguntalo en tu centro de salud u hospital público antes de ir.",
  ],
}
