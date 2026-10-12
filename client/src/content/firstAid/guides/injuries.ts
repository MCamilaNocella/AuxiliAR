import { CHECKED_AT, MANUAL, POISON_CENTER, VIA_PUBLICA } from "../sources"
import type { FirstAidGuideContent } from "../types"

/** "Accidentes y lesiones frecuentes": everyday injuries. Each says only what the official sources say. */
export const INJURY_GUIDES: FirstAidGuideContent[] = [
  {
    slug: "heridas",
    title: "Heridas y cortes",
    group: "injuries",
    summary: "Son muy frecuentes en el hogar. Generalmente no son graves, pero hay que evitar que se contaminen y se infecten.",
    stepSets: [
      {
        steps: [
          "Lavate bien las manos con agua y jabón.",
          "Lavá la herida y la piel de alrededor con abundante agua y jabón blanco, bajo la canilla.",
          "Si no sangra, ponele un antiséptico líquido (por ejemplo, iodopovidona).",
          "Cubrila con una compresa o gasa y, si podés, un vendaje.",
          "Si sangra, presioná con una tela limpia. Si es en un brazo o una pierna, levantalo por encima del corazón. Si no para, poné más telas y vendá.",
          "Hacé que un médico o una médica vea la herida lo antes posible: antes de las 6 horas, porque puede necesitar puntos.",
        ],
      },
    ],
    dont: ["No pongas algodón sobre la herida: se pega al tejido.", "No uses torniquete."],
    whenToCall: ["Si el sangrado es abundante o no se detiene, seguí la guía de hemorragia grave."],
    related: ["hemorragia-grave", "vacuna-antitetanica"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "golpes-y-caidas",
    title: "Golpes y caídas",
    group: "injuries",
    summary: "Después de un golpe o una caída puede haber lesiones que no se ven, sobre todo en la cabeza, el cuello y la espalda. Moverse puede empeorarlas.",
    callFirst: true,
    signs: { title: "Señales importantes", items: ["Una parte del cuerpo (un brazo, una pierna, el tronco o la cabeza) se ve deformada.", "La persona no puede levantarse o caminar sin ayuda."] },
    stepSets: [
      {
        steps: [
          "Fijate que no haya peligro para vos ni para la persona.",
          "Dejala quieta: no la muevas bruscamente ni dejes que se levante.",
          "Hablale en voz alta y fijate si responde y si respira.",
          "Si sangra mucho, presioná la zona con una tela lo más limpia posible (mirá la guía de hemorragia grave).",
          "Si hay una posible fractura de un brazo o una pierna, mirá la guía de posibles fracturas.",
          "Llamá al número de emergencias de tu localidad si no puede caminar sin ayuda o si el golpe fue en la cabeza, el cuello o la espalda.",
          "Quedate con la persona y tranquilizala.",
        ],
      },
    ],
    dont: ["No muevas ni levantes a la persona: cualquier movimiento puede empeorar una lesión de la columna.", "No la dejes sola.", "No hables en voz alta sobre su estado."],
    whenToCall: ["Si dudás, no la muevas hasta que el personal de salud te confirme (también puede ser por teléfono) que hay que hacerlo."],
    whileWaiting: ["Prestá especial atención con los niños: como es fácil moverlos, se puede empeorar una lesión o aumentar el dolor."],
    related: ["golpe-en-la-cabeza", "fracturas"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "golpe-en-la-cabeza",
    title: "Golpe en la cabeza",
    group: "injuries",
    summary: "Ante la sospecha de una lesión en la cabeza, el cuello o la espalda, la persona no debe moverse hasta que llegue ayuda especializada.",
    callFirst: true,
    stepSets: [
      {
        steps: [
          "Fijate que no haya peligro para vos.",
          "No muevas a la persona.",
          "Hablale en voz alta y fijate si responde. Mirá si el pecho se mueve y escuchá si respira.",
          "Llamá al número de emergencias de tu localidad o pedí que lo hagan.",
          "Si sangra, presioná con una tela lo más limpia posible.",
          "Si no responde y no respira o respira mal, empezá con RCP (mirá la guía de RCP).",
          "Quedate con la persona y hablale con calma hasta que llegue la ayuda.",
        ],
      },
    ],
    dont: ["No muevas ni levantes a la persona.", "No la dejes sola.", "Ante la duda, no la muevas hasta que el personal de salud te confirme, aunque sea por teléfono, que hay que hacerlo."],
    note: "Las fuentes oficiales no detallan otras señales de alarma ni cuidados para golpes leves en la cabeza. Si tenés dudas, consultá a un servicio de salud.",
    related: ["golpes-y-caidas", "rcp"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "fracturas",
    title: "Posibles fracturas",
    group: "injuries",
    summary: "Después de un golpe o una caída, un brazo, una pierna u otra parte del cuerpo puede quedar deformada: puede ser una fractura. Lo importante es no empeorar la lesión.",
    signs: { title: "Señales importantes", items: ["Un brazo, una pierna u otra parte del cuerpo se ve deformada después de un golpe o una caída."] },
    stepSets: [
      {
        steps: [
          "Si la lesión es en un brazo o una mano, sacale el reloj, los anillos y las pulseras: la hinchazón puede impedir sacarlos después y cortar la circulación.",
          "Poné a lo largo del brazo o de la pierna un objeto rígido y limpio (una madera, un palo, un cartón grueso). Tiene que ser más largo que el brazo o la pierna, para inmovilizar también la articulación de arriba y la de abajo (si es el antebrazo, el codo y la muñeca).",
          "Sujetalo con una venda, un pañuelo o una tela limpia, a lo largo de todo el brazo o la pierna.",
          "Si es un brazo, podés hacer un cabestrillo con un pañuelo, una tela o una bufanda alrededor del cuello.",
          "Si la lesión es en un brazo o una pierna, no se ve el hueso y la persona puede caminar sin ayuda, llevala a un centro de salud.",
          "Si no puede caminar sin ayuda, o la lesión no es en un brazo o una pierna, llamá al número de emergencias de tu localidad.",
        ],
      },
    ],
    dont: [
      "No muevas a la persona ni la parte lastimada si no hace falta: puede agravar la lesión.",
      "No muevas a la persona si el golpe fue grave: puede haber lesión de la columna.",
      "Si se ve el hueso, no intentes volver a meterlo: solo cubrilo con gasas o telas limpias e inmovilizá.",
    ],
    note: "Esta guía es solo sobre posibles fracturas: las fuentes oficiales no tienen una guía específica de esguinces. Si después de un golpe, una caída o una torcedura tenés dudas, consultá a un servicio de salud.",
    related: ["golpes-y-caidas"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "accidentes-de-transito",
    title: "Accidentes de tránsito",
    group: "injuries",
    summary: "En la vía pública es probable que haya lesiones graves. Quien ayuda es el eslabón entre la víctima y el servicio de emergencias.",
    callFirst: true,
    stepSets: [
      {
        steps: [
          "No te expongas: no te conviertas en otra víctima. Si hay peligro, no asumas riesgos y actuá solo si no corrés riesgo.",
          "Llamá al número de emergencias de tu localidad o pedí que lo hagan. Es lo más importante.",
          "No muevas a las víctimas: es probable que tengan lesión en la columna, y moverlas mal puede dañar la médula.",
          "Si hay una hemorragia importante, presioná firme y sin soltar sobre la zona que sangra (podés usar la ropa de la víctima). Si tenés guantes, usalos.",
          "Si hay varias víctimas, ocupate primero de quien tiene dificultad para respirar, está inconsciente, sangra mucho, tiene quemaduras o fracturas graves.",
          "Quedate con la víctima, mantené la calma para tranquilizarla y no la dejes sola hasta que llegue ayuda capacitada.",
          "Si no hay personal capacitado (policía, seguridad), ayudá a mantener alejadas a las personas que no intervienen: armá un cordón humano.",
        ],
      },
    ],
    dont: ["No te expongas a peligros.", "No muevas a la víctima si no sabés qué hacer: podés agravar su estado.", "No dejes sola a la víctima."],
    whenToCall: ["Siempre: las lesiones graves son muy probables."],
    related: ["hemorragia-grave", "golpes-y-caidas", "rcp"],
    sources: [VIA_PUBLICA, MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "electrocucion",
    title: "Electrocución",
    group: "injuries",
    summary: "El contacto con la corriente eléctrica puede causar desde quemaduras hasta un paro cardíaco. La seguridad de quien ayuda es lo primero.",
    callFirst: true,
    stepSets: [
      {
        steps: [
          "Si presenciás una electrocución y no corrés riesgo, cortá la electricidad general (llave térmica o interruptores). Apagar un solo aparato puede no cortar la corriente.",
          "Si no podés cortarla, empujá a la persona lejos de la fuente con algo que no conduzca la electricidad (un palo, una escoba, una silla de madera, un rollo de alfombra). Si es posible, parate sobre algo que tampoco conduzca (goma, papeles).",
          "Llamá al número de emergencias de tu localidad o pedí que lo hagan.",
          "Cuando la persona esté libre de la fuente, fijate si responde y si respira. Si no responde, no se mueve, no respira o respira mal, empezá con RCP (mirá la guía de RCP).",
          "Si está consciente, tranquilizala. Si tiene una quemadura, sacale la ropa que salga con facilidad y lavala con agua corriente (mirá la guía de quemaduras).",
          "Si se desmaya, se pone pálida o se marea, recostala en un lugar seco y cómodo con las piernas elevadas, y abrigala.",
          "Quedate con ella hasta que llegue la ayuda. Evitá mover la cabeza o el cuello si sospechás una lesión de la columna.",
        ],
      },
    ],
    dont: [
      "No uses un objeto húmedo ni metálico para apartarla.",
      "No te acerques a menos de 6 metros de una persona que se electrocuta con alto voltaje, hasta que la corriente esté cortada.",
      "En la vía pública, nunca cortes ni toques cables caídos.",
      "No muevas a la persona, salvo que haya peligro inmediato (fuego o explosión).",
      "No pongas hielo, manteca, ungüentos, medicamentos, algodón ni vendajes adhesivos sobre la quemadura.",
    ],
    whenToCall: [
      "La persona está inconsciente, le cuesta respirar o está en paro.",
      "Tiene quemaduras en la boca o quemaduras extensas.",
      "Estuvo en contacto con una fuente de alto voltaje.",
      "Si hubo explosión, incendio o derrame de sustancias peligrosas, llamá también a los bomberos.",
    ],
    related: ["rcp", "quemaduras"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "intoxicaciones",
    title: "Intoxicaciones",
    group: "injuries",
    summary:
      "Pueden pasar por tragar, respirar o tocar una sustancia: medicamentos, productos de limpieza, plaguicidas, monóxido de carbono, alcohol u otras. Los chicos pequeños tienen mucho riesgo por su curiosidad.",
    signs: {
      title: "Señales importantes",
      items: [
        "Malestar, dolor de cabeza, mareos, náuseas o vómitos.",
        "Ardor o dolor de garganta, tos repentina, dificultad para tragar o respirar, babeo.",
        "Falta de fuerzas, somnolencia repentina, confusión, convulsiones o desmayo.",
        "Envases de plaguicidas o medicamentos cerca de la persona, o restos de sustancias o quemaduras alrededor de la boca, los ojos o la piel.",
      ],
    },
    stepSets: [
      {
        steps: [
          "No pierdas la calma y actuá con rapidez. Pedí ayuda.",
          "Asegurate de que vos no corrés peligro. Alejá a la víctima del peligro sin arriesgarte.",
          `Si tenés dudas sobre qué hacer, llamá al Centro Nacional de Intoxicaciones del Hospital Posadas: ${POISON_CENTER.number} (línea gratuita).`,
          "Si fue por contacto con la piel: sacale rápido la ropa y lavá con abundante agua durante 15 o 20 minutos.",
          "Si fue por haber respirado la sustancia: llevala a un lugar abierto y bien ventilado.",
          "Si fue por monóxido de carbono: sacala del lugar, apagá la fuente de combustión y ventilá. Aunque los síntomas sean leves, consultá siempre a un médico, porque los daños pueden aparecer más tarde.",
          "Si fue en un ojo: pasale suavemente un paño o un papel por la cara para sacar restos del producto y lavale el ojo con agua a temperatura ambiente, con el ojo abierto, durante 15 a 20 minutos.",
          "Si fue por haberla tragado: antes de darle algo por la boca, comunicate con un centro de toxicología o consultá a un médico.",
          "En todos los casos, llevala al hospital o centro de salud más cercano sin perder tiempo.",
        ],
      },
    ],
    dont: [
      "No hagas vomitar ni des de beber a una persona inconsciente, confundida, adormecida o que tiene dificultad para tragar.",
      "No le des nada por la boca sin antes consultar a un centro de toxicología o a un médico.",
      "En la piel, no apliques loción, grasa ni aceite.",
    ],
    actions: [{ label: `Llamar al Centro Nacional de Intoxicaciones · ${POISON_CENTER.number}`, tel: POISON_CENTER.tel }],
    related: ["quemaduras"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
]

