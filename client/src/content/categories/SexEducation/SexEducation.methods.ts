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
} from "./SexEducation.sources"

/**
 * What each method is, in the words of its own page of the Ministerio de Salud de la Nación (argentina.gob.ar/salud/sexual,
 * Creative Commons Atribución 4.0), read on 2026-10-09. It repeats the page: no dose, no
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

