import { PATHS } from "@/router/paths"
import { ANMAT_ALERGIAS, CABA_ALERGIAS, CHECKED_AT, MANUAL, MEDLINEPLUS_ALERGIAS, MEDLINEPLUS_ANAFILAXIA, MINI_GUIA_RCP, RCP_ADULTOS } from "../sources"
import type { FirstAidGuideContent } from "../types"

/** "Necesito actuar ahora": situations where a life can be at risk */
export const EMERGENCY_GUIDES: FirstAidGuideContent[] = [
  {
    slug: "rcp",
    title: "RCP: la persona no responde y no respira",
    group: "now",
    summary:
      "La RCP (reanimación cardiopulmonar) son presiones rítmicas sobre el pecho de una persona que sufre un paro cardíaco. Mantiene la sangre circulando hasta que llega la atención médica.",
    callFirst: true,
    signs: {
      title: "Señales importantes",
      items: ["No responde cuando le hablás ni cuando la sacudís suavemente de los hombros.", "No respira, jadea o respira con mucha dificultad."],
    },
    stepSets: [
      {
        label: "Adultos y niños",
        steps: [
          "Fijate que el lugar sea seguro. Si hay gases tóxicos, riesgo de electrocución, incendio o explosión, no te acerques y esperá a que llegue el servicio de emergencias.",
          "Sacudila suavemente de los hombros y preguntale en voz alta: “¿Me escuchás?”.",
          "Si no responde y no respira o respira mal, llamá al número de emergencias de tu localidad o pedile a otra persona que lo haga.",
          "Acostala boca arriba sobre una superficie dura, como el piso.",
          "Apoyá el talón de una mano en el centro del pecho y poné la otra mano encima, con los dedos entrelazados.",
          "Con los brazos estirados, presioná hacia abajo hasta hundir el pecho de 5 a 6 cm y soltá. Hacelo rápido y con ritmo: entre 100 y 120 veces por minuto.",
          "Seguí sin interrumpir las compresiones. Cada 2 minutos, fijate si la persona reacciona.",
          "Si hay un desfibrilador (DEA) cerca, pedí que lo traigan y usalo: encendelo y seguí las instrucciones de su voz.",
          "Seguí hasta que llegue el equipo de emergencias. Si la persona recupera la conciencia, acostala de costado (posición de seguridad) hasta que llegue la ayuda.",
        ],
      },
      {
        label: "Bebés (hasta el año de vida)",
        steps: [
          "Si no reacciona, pedile a otra persona que llame a emergencias y traiga un DEA. Si estás solo o sola, hacé RCP unos 2 minutos y recién después llamá.",
          "Acostalo boca arriba sobre una superficie firme.",
          "Poné dos dedos en el centro del pecho, entre los pezones, y presioná hacia abajo sin hundirlo más de 4 cm.",
          "Si sabés hacer las respiraciones: cubrí con tu boca la boca y la nariz del bebé y dale 2 soplidos de 1 segundo cada uno, que levanten el pecho. Repetí el ciclo: 30 compresiones y 2 respiraciones.",
          "Si no sabés hacer las respiraciones, hacé solo compresiones continuas, sin parar, hasta que llegue ayuda.",
          "Si empieza a respirar solo, ponelo de costado (posición de recuperación) hasta que llegue la ayuda.",
        ],
      },
    ],
    dont: ["No te acerques si el lugar no es seguro.", "No dobles los codos al presionar: mantené los brazos estirados.", "No cortes la llamada hasta que la persona que te atiende te lo indique."],
    whileWaiting: ["Seguí con las compresiones hasta que llegue el equipo de emergencias."],
    related: ["atragantamiento", "electrocucion"],
    sources: [MINI_GUIA_RCP, RCP_ADULTOS, MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "atragantamiento",
    title: "Atragantamiento",
    group: "now",
    summary: "Pasa cuando un trozo de comida u otro objeto queda atorado en la garganta y no deja que el aire llegue a los pulmones. Hay que actuar con rapidez.",
    callFirst: true,
    signs: {
      title: "Señales importantes",
      items: [
        "La persona se lleva las manos al cuello, no puede respirar y se le pone roja la cara y el cuello.",
        "Si un niño balbucea, llora, habla o tose, el aire está pasando: probablemente la obstrucción es parcial.",
      ],
    },
    stepSets: [
      {
        label: "Adultos",
        steps: [
          "Pedí a alguien que llame al número de emergencias de tu localidad mientras vos actuás.",
          "Ponete detrás de la persona y rodeala con los brazos, por debajo de sus brazos.",
          "Cerrá un puño y apoyalo cuatro dedos por encima del ombligo, en la línea del medio del abdomen. Poné la otra mano sobre el puño.",
          "Inclinala hacia adelante y presioná el abdomen hacia atrás y hacia arriba, como una tos artificial.",
          "Seguí hasta que el objeto salga.",
        ],
      },
      {
        label: "Si estás sola o solo",
        steps: [
          "Apoyá la boca del estómago (encima del ombligo y debajo del hueso del pecho) sobre el borde de una silla.",
          "Presioná con decisión y con fuerza suficiente para que el objeto salga.",
        ],
      },
      {
        label: "Si la persona se desmaya",
        steps: [
          "Acostala boca arriba y hacé 5 compresiones en la boca del estómago.",
          "Fijate si responde y respira. Si no, repetí.",
          "Si después de 3 ciclos la cara está azulada, empezá con RCP (mirá la guía de RCP).",
        ],
      },
      {
        label: "Niños y bebés",
        steps: [
          "Si el niño tose, llora o habla, dejalo toser solo: no le golpees la espalda ni le des agua.",
          "Si no puede respirar, llamá ya al número de emergencias de tu localidad y seguí las indicaciones de quien te atienda.",
        ],
      },
    ],
    dont: ["No le des agua ni le golpees la espalda a un niño que está tosiendo: el objeto puede moverse y tapar del todo la respiración."],
    note: "La técnica para bebés está explicada con imágenes en el Manual oficial (págs. 17 y 18). Conviene aprenderla en un curso de primeros auxilios.",
    related: ["rcp"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "acv",
    title: "ACV: accidente cerebrovascular",
    group: "now",
    summary: "Ocurre cuando se tapa o se rompe una arteria del cerebro. Puede ser mortal o dejar secuelas. Actuar rápido es clave.",
    callFirst: true,
    signs: {
      title: "Señales importantes",
      items: [
        "Debilidad repentina o adormecimiento de la cara, el brazo o la pierna, sobre todo de un solo lado del cuerpo.",
        "Confusión de golpe, o problemas para hablar o entender.",
        "Problema repentino de la vista, en uno o en los dos ojos.",
        "Problema de golpe para caminar, mareo, pérdida del equilibrio o de la coordinación.",
        "Dolor de cabeza muy fuerte sin causa conocida.",
      ],
    },
    stepSets: [
      {
        steps: [
          "Reconocé las señales. El comienzo puede ser sutil, y la persona puede negar lo que le pasa o no darse cuenta.",
          "Ante la sospecha, llamá de inmediato al número de emergencias de tu localidad o pedí que lo hagan.",
          "No dejes sola a la persona: tranquilizala y abrigala.",
          "Si responde, acostala de costado (posición de seguridad).",
          "Si deja de respirar, empezá con RCP (mirá la guía de RCP).",
        ],
      },
    ],
    whenToCall: ["Siempre que sospeches un ACV. Los síntomas pueden empeorar, quedarse igual o disminuir."],
    whileWaiting: ["Quedate con la persona, tranquilizala y abrigala hasta que llegue la ayuda."],
    related: ["rcp"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "hemorragia-grave",
    title: "Hemorragia grave",
    group: "now",
    summary: "Cuando una herida sangra mucho, lo primero es presionar la zona que sangra con una tela lo más limpia posible.",
    callFirst: true,
    signs: { title: "Señales importantes", items: ["Hay una pérdida importante de sangre que se ve (hemorragia externa)."] },
    stepSets: [
      {
        steps: [
          "Fijate que no haya peligro para vos. Si podés, ponete guantes.",
          "Presioná firme y sin soltar sobre la zona que sangra, con una tela lo más limpia posible.",
          "Si la herida está en un brazo o en una pierna, levantá esa parte por encima del nivel del corazón.",
          "Si el sangrado no se detiene, poné más telas encima y hacé un vendaje.",
          "Llamá al número de emergencias de tu localidad o pedí que lo hagan. Según la gravedad, hay que trasladar a la persona lo antes posible para que la atiendan.",
        ],
      },
    ],
    dont: ["No uses torniquete.", "No pongas algodón sobre la herida: se pega al tejido.", "No muevas a la persona si hubo un golpe fuerte o una caída grave."],
    whileWaiting: ["Quedate con la persona y seguí presionando hasta que llegue la ayuda."],
    related: ["heridas", "accidentes-de-transito"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "convulsiones",
    title: "Convulsiones",
    group: "now",
    summary:
      "Son una pérdida súbita del conocimiento con movimientos bruscos de todo el cuerpo. Los primeros auxilios consisten en mantener segura a la persona hasta que la convulsión termine.",
    signs: {
      title: "Señales importantes",
      items: [
        "Pierde el conocimiento de golpe y mueve todo el cuerpo con sacudidas.",
        "La mandíbula se pone muy dura y puede salir espuma o un hilo de sangre por la boca.",
        "A veces se orina encima.",
      ],
    },
    stepSets: [
      {
        steps: [
          "Mantené la calma y tranquilizá a las demás personas.",
          "Evitá que se lastime: sacá objetos duros o filosos que tenga cerca. Si podés, protegela poniendo algo blando en el piso o la pared, y sacale los anteojos y aflojale la corbata o la ropa ajustada.",
          "Fijate cuánto dura la convulsión.",
          "Cuando termine, girala suavemente de costado (posición de seguridad).",
          "No te vayas hasta que se recupere. No le des agua ni comida hasta que esté bien despierta. Si está confusa, ofrecele ayuda para volver a su casa.",
        ],
      },
    ],
    dont: [
      "No intentes sujetarla ni evitar que se mueva.",
      "No le pongas nada en la boca: la lengua no se puede tragar.",
      "No le hagas respiración boca a boca, salvo que esté inconsciente y deje de respirar cuando pase la convulsión (ahí, RCP).",
    ],
    whenToCall: [
      "La convulsión dura más de 5 minutos.",
      "Respira mal cuando termina, o no se recupera de forma normal.",
      "Las convulsiones se repiten.",
      "No se despierta, se lastimó durante la convulsión o está dentro del agua.",
      "Tiene otra enfermedad (diabetes, enfermedad cardíaca) o está embarazada.",
    ],
    whileWaiting: ["Hablale con calma y mantenela lejos de cualquier peligro."],
    related: ["rcp"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "quemaduras",
    title: "Quemaduras",
    group: "now",
    summary: "Pueden ser por líquidos calientes, fuego, electricidad, vapor, plancha o líquidos inflamables. Son muy frecuentes en el hogar, sobre todo en la cocina.",
    stepSets: [
      {
        steps: [
          "Tranquilizá a la persona.",
          "Sacale la ropa, los anillos, las pulseras y los cinturones que no estén pegados a la lesión.",
          "Poné agua sobre la lesión. Si la quemadura es leve, usá agua a temperatura de la canilla: calma el dolor y evita que la lesión avance.",
          "Llamá al número de emergencias de tu localidad o andá al centro de salud más cercano.",
        ],
      },
    ],
    dont: [
      "No uses agua caliente ni muy fría.",
      "No pongas hielo, cremas, dentífrico ni otros remedios caseros: pueden empeorar la lesión y causar una infección.",
      "No abras las ampollas.",
    ],
    whenToCall: ["En niños y adultos mayores las quemaduras pueden ser más graves aunque sean del mismo tamaño y profundidad."],
    related: ["electrocucion"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
  {
    slug: "reacciones-alergicas",
    title: "Reacciones alérgicas",
    group: "now",
    summary:
      "Es la respuesta del cuerpo a una sustancia que a la mayoría de las personas no les hace daño, como ciertos alimentos, medicamentos, picaduras de insectos o el polen. Muchas reacciones son leves, pero otras pueden ser graves y poner en riesgo la vida. Pueden aparecer enseguida o después de unas horas.",
    callFirst: true,
    signs: {
      title: "Señales de una reacción leve",
      items: ["Algunas ronchas, sobre todo en el cuello y la cara.", "Picazón.", "Congestión nasal.", "Erupciones en la piel.", "Ojos rojos y llorosos."],
    },
    extraSigns: [
      {
        title: "Señales de una reacción grave (anafilaxia)",
        items: [
          "Dificultad para respirar, tos o silbidos al respirar.",
          "Voz ronca o susurrante, o ruidos al tomar aire: pueden indicar que la garganta se está hinchando.",
          "Dificultad para tragar.",
          "Hinchazón de la cara, los ojos o la lengua.",
          "Molestia u opresión en el pecho, o palpitaciones.",
          "Mareo, o pérdida del conocimiento.",
          "Urticaria en todo el cuerpo.",
          "Dolor de panza, náuseas, vómitos o diarrea.",
          "Cuando afecta a varias partes del cuerpo a la vez, es una reacción grave que, si no se atiende de inmediato, puede ser fatal.",
        ],
      },
    ],
    stepsTitle: "¿Qué hago ahora?",
    stepSets: [
      {
        label: "Si la reacción es leve",
        steps: [
          "Calmá y tranquilizá a la persona: la ansiedad puede empeorar los síntomas.",
          "Tratá de identificar qué le provocó la reacción (un alimento, un medicamento, una picadura, el polen…) y ayudala a evitar volver a tener contacto con eso.",
          "Observá cómo está. Si aparecen señales de que se siente peor, seguí los pasos de la reacción grave.",
          "Consultá a un equipo de salud. Para una reacción leve, quien la atienda puede recomendar qué medicamento tomar.",
        ],
      },
      {
        label: "Si hay señales de anafilaxia",
        steps: [
          "Llamá al número de emergencias de tu localidad o pedile a otra persona que lo haga, y pedí ayuda médica de inmediato.",
          "Fijate si respira. Si hace falta, empezá con RCP (mirá la guía de RCP).",
          "Calmá y tranquilizá a la persona.",
          "Si tiene a mano su medicamento de emergencia para alergias (por ejemplo, epinefrina inyectable o intranasal), ayudala a usarlo cuanto antes, al comienzo de la reacción. No esperes a ver si empeora.",
          "Si la causa fue una picadura de abeja, raspá el aguijón de la piel con algo firme, como una uña o una tarjeta de plástico.",
          "Para evitar el shock, acostala boca arriba, levantale los pies unos 30 cm y cubrila con una campera o una manta. No lo hagas si sospechás una lesión en la cabeza, el cuello, la espalda o las piernas, si le causa molestias o si está vomitando.",
        ],
      },
    ],
    dont: [
      "No supongas que una inyección para alergias que la persona ya recibió la protege por completo.",
      "No le des nada por la boca, ni medicamentos en pastillas, si tiene problemas para respirar.",
      "No le pongas una almohada debajo de la cabeza si le cuesta respirar: puede bloquear las vías respiratorias.",
      "No uses pinzas para sacar un aguijón: al apretarlo libera más veneno.",
      "No esperes a ver si la reacción empeora para usar su medicamento de emergencia.",
    ],
    whenToCall: [
      "Siempre que haya señales de anafilaxia: es una emergencia y necesita atención médica inmediata.",
      "Si la reacción parecía leve pero la persona se siente peor.",
      "Si no sabés si es una reacción alérgica o si es grave: lo más acertado es consultar a un equipo de salud.",
    ],
    whileWaiting: ["Quedate con la persona, mantenela tranquila y fijate cómo respira. Si deja de respirar, empezá con RCP."],
    actions: [{ label: "Buscar un centro de atención", to: PATHS.centers }],
    note: "Esta guía no indica medicamentos ni dosis: eso lo define un equipo de salud. Está armada con fuentes oficiales y todavía falta que la revise un equipo de salud de AuxiliAR.",
    clinicalReview: { status: "pending", note: "Pendiente de revisión clínica antes de publicarse. Las fuentes argentinas halladas no traen una guía de primeros auxilios para alergias; los pasos vienen de MedlinePlus (NIH)." },
    related: ["rcp", "intoxicaciones"],
    sources: [MEDLINEPLUS_ALERGIAS, MEDLINEPLUS_ANAFILAXIA, ANMAT_ALERGIAS, CABA_ALERGIAS],
    checkedAt: CHECKED_AT,
  },
]
