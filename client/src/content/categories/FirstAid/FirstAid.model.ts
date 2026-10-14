import type { SectionView } from "@/types/blocks"

/** The content of every section, from the chosen model (diseñoCategorias/primeros-auxilios-1-renglones-con-resumen.html): blocks, summary and sources */
export const FIRST_AID_VIEWS: Record<string, SectionView> = {
  "rcp": {
    "key": [
      {
        "title": "Paso a paso",
        "value": "RCP",
        "label": "adultos, niños y bebés",
        "to": "rcp"
      },
      {
        "title": "Si hay uno cerca",
        "value": "DEA",
        "label": "te guía con su voz",
        "to": "dea"
      },
      {
        "title": "Si respira",
        "value": "De costado",
        "label": "posición de seguridad",
        "to": "posicion"
      },
      {
        "title": "Ritmo",
        "value": "100 a 120",
        "label": "compresiones por minuto",
        "to": "rcp"
      }
    ],
    "blocks": [
      {
        "type": "callout",
        "id": "llamar",
        "tone": "alert",
        "icon": "phone",
        "title": "Cuando llamás a emergencias, decí:",
        "list": [
          "Dónde estás: calle, entre calles, número y barrio.",
          "Qué pasó y qué lesiones hay.",
          "Cuántas personas están involucradas.",
          "Si hay peligros para otras personas.",
          "Qué estás haciendo (RCP u otra maniobra).",
          "Desde qué teléfono llamás."
        ],
        "paras": [],
        "foot": "Cortá recién cuando te lo indiquen: te pueden dar instrucciones.",
        "button": {
          "emergency": true,
          "label": "Ver números de emergencia"
        }
      },
      {
        "type": "guide",
        "id": "rcp",
        "title": "RCP: no responde y no respira",
        "call": true,
        "lead": "Son presiones rítmicas sobre el pecho que mantienen la sangre circulando hasta que llega la atención médica. Empezarla enseguida, aunque no seas profesional, puede aumentar en un 40% las posibilidades de sobrevivir.",
        "signs": {
          "title": "Cuándo hacerla",
          "items": [
            "No responde cuando le hablás ni cuando la sacudís suavemente de los hombros.",
            "No respira, jadea o respira de forma anormal."
          ]
        },
        "sets": [
          {
            "label": "Adultos y niños",
            "steps": [
              "Fijate que el lugar sea seguro. Si hay gases tóxicos, riesgo de electrocución, incendio o explosión, no te acerques.",
              "Sacudila suavemente de los hombros y preguntale en voz alta: “¿Me escuchás?”.",
              "Si no responde y no respira o respira mal, llamá a emergencias o pedile a alguien que lo haga, y que traiga un DEA si hay uno cerca.",
              "Acostala boca arriba sobre una superficie dura, como el piso.",
              "Apoyá el talón de una mano en el centro del pecho y poné la otra mano encima, con los dedos entrelazados.",
              "Con los brazos estirados, hundí el pecho de 5 a 6 cm y soltá. Rápido y con ritmo: entre 100 y 120 veces por minuto.",
              "No pares. Cada 2 minutos, fijate si reacciona. Si sabés dar respiraciones podés sumarlas; si no, seguí solo con compresiones.",
              "Seguí hasta que llegue la ayuda. Si vuelve en sí, ponela en posición de seguridad."
            ]
          },
          {
            "label": "Bebés (menos de 1 año)",
            "steps": [
              "Pedile a alguien que llame a emergencias y traiga un DEA. Si estás solo o sola, hacé RCP unos 2 minutos y recién después llamá.",
              "Acostalo boca arriba sobre una superficie firme.",
              "Poné dos dedos en el centro del pecho, entre los pezones, y presioná sin hundirlo más de 4 cm, entre 100 y 120 veces por minuto.",
              "Si sabés dar respiraciones: cubrí con tu boca su boca y su nariz y dale 2 soplidos de 1 segundo que le levanten el pecho. Repetí 30 compresiones y 2 respiraciones.",
              "Si no sabés, hacé solo compresiones, sin parar, hasta que llegue la ayuda.",
              "Si empieza a respirar, ponelo de costado y quedate mirándolo."
            ]
          }
        ],
        "dont": [
          "No hagas RCP a quien responde y respira normalmente.",
          "No te acerques si el lugar no es seguro.",
          "No dobles los codos al presionar.",
          "No cortes la llamada hasta que te lo indiquen."
        ],
        "note": "Esta guía no reemplaza un curso: el Ministerio de Salud recomienda aprender RCP y repetir el entrenamiento. La Ley 26.835 promueve que se enseñe en las escuelas secundarias y en el nivel superior."
      },
      {
        "type": "guide",
        "id": "dea",
        "title": "DEA: desfibrilador",
        "lead": "Es un aparato portátil que puede devolverle al corazón su ritmo cuando el paro se debe a una arritmia grave. Cualquier persona puede usarlo: te dice qué hacer con su voz.",
        "sets": [
          {
            "steps": [
              "Pedí que lo traigan y seguí con las compresiones. Si son dos, una persona hace RCP y la otra prepara el DEA.",
              "Encendelo y seguí sus instrucciones. Usarlo cuanto antes es vital.",
              "Si indica una descarga, fijate que nadie esté tocando a la persona y apretá el botón.",
              "Seguí sus indicaciones hasta que llegue la ayuda o la persona se recupere."
            ]
          }
        ],
        "tip": {
          "icon": "map-pin",
          "text": "<b>Dónde hay:</b> en lugares con mucha gente, como estadios, clínicas, aeropuertos, terminales, oficinas públicas e hipermercados. Están en gabinetes señalizados, cerca de los matafuegos."
        }
      },
      {
        "type": "guide",
        "id": "posicion",
        "title": "Posición de seguridad",
        "lead": "Si la persona está desmayada pero respira, ponela de costado: así, si vomita o sangra, no se ahoga.",
        "sets": [
          {
            "steps": [
              "Arrodillate al lado de la persona, que está boca arriba, y estirale los brazos y las piernas.",
              "Poné el brazo que está más cerca tuyo en ángulo recto con el cuerpo, con el codo doblado y la palma hacia arriba.",
              "Girala con cuidado hasta dejarla de costado.",
              "Doblale la pierna de arriba, con la cadera y la rodilla en ángulo recto, para que no se dé vuelta.",
              "Inclinale suavemente la cabeza hacia atrás para que pase el aire.",
              "Quedate a su lado y fijate todo el tiempo que siga respirando."
            ]
          }
        ],
        "dont": [
          "No la muevas si tuvo un golpe fuerte, un choque o una caída grave: puede tener una lesión en la columna.",
          "Ante la duda, esperá a que el personal de salud te diga que la muevas, aunque sea por teléfono."
        ],
        "tip": {
          "icon": "info",
          "text": "Si pasa mucho tiempo, cambiala de lado cada 20 minutos más o menos. Si está embarazada, acostala sobre el lado izquierdo."
        }
      }
    ],
    "sources": [
      {
        "label": "Reanimación cardiopulmonar (RCP) · Primeros auxilios, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/primerosauxilios/RCP"
      },
      {
        "label": "Preguntas frecuentes sobre RCP · Primeros auxilios, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/primerosauxilios/RCP/preguntas"
      },
      {
        "label": "Mini Guía de Reanimación Cardiopulmonar Básica (RCP.B) 2025 · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/sites/default/files/mini-guia-reanimacion-cardiovascular-2025.pdf"
      },
      {
        "label": "RCP en adultos · Primeros auxilios, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/primerosauxilios/rcp/adultos"
      },
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Ley 26.835 · Promoción y capacitación en las técnicas de reanimación cardiopulmonar básicas, argentina.gob.ar/normativa",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-26835-207654"
      },
      {
        "label": "Posición de recuperación (en “Sobredosis”) · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU.",
        "url": "https://medlineplus.gov/spanish/ency/article/000016.htm"
      }
    ]
  },
  "ahogos": {
    "key": [
      {
        "title": "Se atragantó",
        "value": "Atragantamiento",
        "label": "adultos, chicos y bebés",
        "to": "atragantamiento"
      },
      {
        "title": "Estuvo bajo el agua",
        "value": "En el agua",
        "label": "qué hacer al sacarla",
        "to": "agua"
      },
      {
        "title": "En bebés",
        "value": "5 y 5",
        "label": "golpes en la espalda y compresiones en el pecho",
        "to": "atragantamiento"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "atragantamiento",
        "title": "Atragantamiento",
        "call": true,
        "lead": "Pasa cuando un trozo de comida u otro objeto queda atorado en la garganta y no deja pasar el aire.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Se lleva las manos al cuello, no puede respirar, hablar ni toser, y se le pone roja la cara.",
            "En un bebé: no puede llorar ni hacer ruido, tose débil, hace ruidos agudos al tomar aire o se pone azulado.",
            "Si tose fuerte, llora o habla, el aire está pasando: dejalo toser y no hagas nada más."
          ]
        },
        "sets": [
          {
            "label": "Adultos y chicos",
            "steps": [
              "Pedile a alguien que llame a emergencias mientras vos actuás.",
              "Ponete detrás de la persona y rodeala con los brazos, por debajo de los suyos.",
              "Cerrá un puño y apoyalo cuatro dedos arriba del ombligo, en el medio de la panza. Poné la otra mano sobre el puño.",
              "Inclinala hacia adelante y presioná hacia atrás y hacia arriba, como una tos artificial.",
              "Seguí hasta que el objeto salga."
            ]
          },
          {
            "label": "Bebés",
            "steps": [
              "Si no puede toser ni llorar, pedí que llamen a emergencias.",
              "Acostalo boca abajo sobre tu antebrazo, apoyado en tu muslo, con la cabeza más baja que el cuerpo. Sostenele la mandíbula con la mano.",
              "Dale hasta 5 golpes firmes con la base de la mano, entre los omóplatos.",
              "Si no sale, dalo vuelta boca arriba sosteniéndole la cabeza, y hacé hasta 5 compresiones rápidas con dos dedos en el centro del pecho, justo debajo de la línea de los pezones.",
              "Repetí 5 golpes y 5 compresiones hasta que salga el objeto.",
              "Si deja de responder, empezá la RCP para bebés."
            ]
          },
          {
            "label": "Si estás solo o sola",
            "steps": [
              "Apoyá la boca del estómago (arriba del ombligo y debajo del hueso del pecho) sobre el respaldo de una silla.",
              "Empujá con fuerza, de golpe, hasta que el objeto salga."
            ]
          },
          {
            "label": "Si se desmaya",
            "steps": [
              "Acostala boca arriba y hacé 5 compresiones en la boca del estómago.",
              "Fijate si responde y respira. Si no, repetí.",
              "Si después de 3 ciclos tiene la cara azulada, empezá con la RCP."
            ]
          }
        ],
        "dont": [
          "No le golpees la espalda ni le des agua a un chico que tose, llora o habla: el objeto puede moverse y tapar del todo la respiración.",
          "No intentes sacar con los dedos algo que no ves."
        ],
        "help": {
          "title": "Después",
          "items": [
            "Aunque el objeto haya salido y parezca estar bien, que lo vea un médico o una médica."
          ]
        },
        "prevent": [
          "Cortá la comida en trozos chicos y masticá despacio, sobre todo si usás dentadura postiza.",
          "Evitá reírte o hablar mientras masticás.",
          "Guardá bolitas, piedras, tachuelas, globos y cosas chicas lejos de menores de 3 años, y fijate la edad indicada en los juguetes.",
          "Que los chicos no corran ni jueguen con comida o juguetes en la boca.",
          "A menores de 4 años no les des salchichas, nueces, maní, pochoclo ni caramelos duros o pegajosos."
        ]
      },
      {
        "type": "guide",
        "id": "agua",
        "title": "En el agua",
        "call": true,
        "lead": "Un bebé puede ahogarse en muy poca agua, como la de un balde, y sin hacer ruido. Primero deja de respirar y, si sigue sin aire, se le para el corazón: actuar rápido cambia todo.",
        "sets": [
          {
            "steps": [
              "Sacala del agua y pedí ayuda, sin ponerte en riesgo: la reanimación no se hace dentro del agua.",
              "Si está despierta y respira bien, abrigala y esperá la ayuda.",
              "Si no responde, el ahogamiento fue delante tuyo y duró menos de 3 minutos: abrile la boca y empezá con respiraciones boca a boca.",
              "Si se recupera, sacale la ropa mojada y secala para que no se enfríe.",
              "Si no reacciona, o no viste cuánto tiempo estuvo en el agua y no responde ni respira, empezá la RCP. Acá tiene que incluir respiraciones, no solo compresiones.",
              "Seguí hasta que llegue la ayuda."
            ]
          }
        ],
        "dont": [
          "No intentes sacarle el agua golpeándole el pecho ni con la maniobra de Heimlich."
        ],
        "help": {
          "title": "Después",
          "items": [
            "Todas las personas que perdieron el conocimiento tienen que ir al hospital, aunque se recuperen."
          ]
        },
        "prevent": [
          "Que un adulto mire siempre a los chicos en el agua, de cerca y sin distraerse.",
          "Cercá las piletas y tapá baldes, tachos, aljibes y pozos con agua.",
          "Usá chalecos salvavidas homologados: los inflables de juguetería no protegen.",
          "Que los chicos aprendan a nadar y los adultos, RCP."
        ]
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Asfixia en niños menores de 1 año · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU.",
        "url": "https://medlineplus.gov/spanish/ency/article/000048.htm"
      },
      {
        "label": "Recomendaciones para evitar ahogamientos (17/12/2021) · Sociedad Argentina de Pediatría",
        "url": "https://www.sap.org.ar/docs/subcomisiones/medios/9files_prevencion-ahogamientos-2021_1639778883.pdf"
      }
    ]
  },
  "malestares": {
    "key": [
      {
        "title": "Dolor de pecho",
        "value": "Infarto",
        "label": "señales y qué hacer",
        "to": "infarto"
      },
      {
        "title": "Cara o brazo que no responden",
        "value": "ACV",
        "label": "llamá ya",
        "to": "acv"
      },
      {
        "title": "Sacudidas",
        "value": "Convulsiones",
        "label": "cuidala hasta que pase",
        "to": "convulsiones"
      },
      {
        "title": "Se cayó redondo",
        "value": "Desmayo",
        "label": "piernas arriba",
        "to": "desmayo"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "infarto",
        "title": "Infarto",
        "call": true,
        "lead": "No es lo mismo que un paro cardíaco. Si tiene señales de infarto pero responde y respira, no se hace RCP: se pide ayuda de inmediato.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Presión o dolor fuerte en el centro del pecho, que no se va y puede irse a los hombros, el cuello, la mandíbula o los brazos.",
            "Molestia en el pecho con mareos, desmayo, sudor, náuseas o falta de aire.",
            "No siempre aparecen todas las señales."
          ]
        },
        "sets": [
          {
            "steps": [
              "Pedile que se siente o se acueste.",
              "Llamá a emergencias o pedí que lo hagan: en un infarto el tiempo lo es todo. Si no se puede llamar, llevala al hospital más cercano.",
              "Quedate con ella y fijate si responde y si respira.",
              "Si deja de responder y no respira, o jadea, es un paro: empezá con la RCP."
            ]
          }
        ],
        "dont": [
          "No hagas RCP mientras responda y respire normalmente."
        ]
      },
      {
        "type": "guide",
        "id": "acv",
        "title": "ACV: accidente cerebrovascular",
        "call": true,
        "lead": "Pasa cuando se tapa o se rompe una arteria del cerebro. Llegar rápido al hospital, en 1 o 2 horas, da más chances de sobrevivir y de recuperarse.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Debilidad o adormecimiento repentino de la cara, el brazo o la pierna, sobre todo de un solo lado.",
            "Confusión de golpe, o problemas para hablar o entender.",
            "Problemas repentinos para ver, en uno o en los dos ojos.",
            "Problemas de golpe para caminar, mareo o pérdida del equilibrio.",
            "Dolor de cabeza muy fuerte sin causa conocida."
          ]
        },
        "sets": [
          {
            "steps": [
              "Ante la sospecha, llamá a emergencias de inmediato. El comienzo puede ser sutil, y la persona puede negar lo que le pasa.",
              "No la dejes sola: tranquilizala y abrigala.",
              "Si responde, ponela en posición de seguridad.",
              "Si deja de respirar, empezá con la RCP."
            ]
          }
        ],
        "help": {
          "title": "Pedí ayuda aunque",
          "items": [
            "Las señales se calmen o desaparezcan: pueden volver o empeorar."
          ]
        }
      },
      {
        "type": "guide",
        "id": "convulsiones",
        "title": "Convulsiones",
        "lead": "Es una pérdida repentina del conocimiento con sacudidas de todo el cuerpo. Lo que hay que hacer es cuidar que no se lastime hasta que pase.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Pierde el conocimiento de golpe y se sacude entera.",
            "Aprieta mucho la mandíbula; puede salirle espuma o un hilo de sangre por la boca.",
            "A veces se orina encima."
          ]
        },
        "sets": [
          {
            "steps": [
              "Mantené la calma y tranquilizá a quienes estén cerca.",
              "Sacá lo que sea duro o filoso de alrededor. Si podés, poné algo blando en el piso, sacale los anteojos y aflojale la ropa ajustada.",
              "Fijate cuánto dura.",
              "Cuando termine, girala suavemente de costado (posición de seguridad).",
              "Quedate hasta que se recupere. Si está confundida, ofrecele ayuda para volver a su casa."
            ]
          }
        ],
        "dont": [
          "No la sujetes ni intentes que deje de moverse.",
          "No le pongas nada en la boca: la lengua no se traga.",
          "No le des agua ni comida hasta que esté bien despierta.",
          "No le hagas boca a boca, salvo que deje de respirar cuando termine (ahí, RCP)."
        ],
        "help": {
          "title": "Llamá a emergencias si",
          "items": [
            "Dura más de 5 minutos o se repite.",
            "Respira mal cuando termina o no se despierta.",
            "Se lastimó o estaba en el agua.",
            "Tiene diabetes, una enfermedad del corazón o está embarazada."
          ]
        }
      },
      {
        "type": "guide",
        "id": "desmayo",
        "title": "Desmayo",
        "lead": "Es una pérdida breve del conocimiento, con caída. Es común en adolescentes, casi nunca es grave y suele pasar en uno o dos minutos.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Debilidad de golpe, piel pálida y sudor frío.",
            "Visión borrosa o aturdimiento.",
            "Puede perder el conocimiento un momento y caerse, pero sigue respirando."
          ]
        },
        "sets": [
          {
            "steps": [
              "Fijate si respira. Llevala a un lugar ventilado, lejos del calor, del frío o de otros peligros.",
              "Si todavía no se desmayó, acostala boca arriba y aflojale la ropa. Ante la duda, ponela en posición de seguridad.",
              "Pedile que tosa varias veces: ayuda a que la sangre llegue al cerebro.",
              "Si se desmayó, levantale un poco las piernas.",
              "Si hace frío, abrigala."
            ]
          }
        ],
        "dont": [
          "No le des comida ni bebida hasta que esté bien. Después, agua; nunca alcohol.",
          "No la dejes sola."
        ],
        "help": {
          "title": "Llamá a emergencias si",
          "items": [
            "Dura más de 5 minutos: puede ser, por ejemplo, una baja de azúcar en alguien con diabetes.",
            "Empieza a convulsionar.",
            "Es una persona mayor: puede deberse a un problema del corazón u otro.",
            "Se golpeó fuerte al caer."
          ]
        }
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Enfermedades cardiovasculares · Glosario, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/glosario/enfermedadcardiovascular"
      }
    ]
  },
  "heridas": {
    "key": [
      {
        "title": "Sangra mucho",
        "value": "Sangrado fuerte",
        "label": "presioná sin soltar",
        "to": "hemorragia"
      },
      {
        "title": "En casa",
        "value": "Cortes",
        "label": "lavar, cubrir y vacuna",
        "to": "cortes"
      },
      {
        "title": "Cabeza adelante",
        "value": "Nariz",
        "label": "nunca hacia atrás",
        "to": "nariz"
      },
      {
        "title": "Ojo, oído o nariz",
        "value": "Algo adentro",
        "label": "qué hacer y qué no",
        "to": "cuerpos"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "hemorragia",
        "title": "Sangrado fuerte",
        "call": true,
        "lead": "Cuando una herida sangra mucho, lo primero es presionar firme sobre la zona con una tela lo más limpia posible.",
        "sets": [
          {
            "steps": [
              "Fijate que no haya peligro para vos. Si podés, ponete guantes.",
              "Presioná firme y sin soltar sobre la zona que sangra, con una tela lo más limpia posible.",
              "Si es en un brazo o una pierna, levantalo por encima del corazón.",
              "Si no para, poné más telas encima y hacé un vendaje.",
              "Llamá a emergencias o pedí que lo hagan, y quedate presionando hasta que llegue la ayuda."
            ]
          }
        ],
        "dont": [
          "No uses torniquete.",
          "No pongas algodón sobre la herida: se pega.",
          "No la muevas si hubo un golpe fuerte o una caída grave."
        ]
      },
      {
        "type": "guide",
        "id": "cortes",
        "title": "Cortes y raspones",
        "lead": "Son muy comunes en casa. Casi nunca son graves, pero hay que evitar que se infecten.",
        "sets": [
          {
            "steps": [
              "Lavate bien las manos con agua y jabón.",
              "Lavá la herida y alrededor con mucha agua y jabón blanco, bajo la canilla.",
              "Si no sangra, ponele un antiséptico (por ejemplo, iodopovidona).",
              "Cubrila con una gasa y, si podés, un vendaje.",
              "Que la vea un médico o una médica antes de las 6 horas: puede necesitar puntos."
            ]
          }
        ],
        "dont": [
          "No pongas algodón sobre la herida.",
          "No uses torniquete."
        ],
        "help": {
          "title": "En la consulta",
          "items": [
            "Llevá tu carnet de vacunas: según tus dosis y cuánto pasó desde la última, te pueden indicar la vacuna antitetánica.",
            "Si no sabés qué dosis tenés, decilo: cambia lo que te indiquen."
          ]
        },
        "prevent": [
          "Usá cuchillos, tijeras y alfileres con cuidado y buena luz.",
          "Protegé las puntas de mesas y mesadas si hay chicos.",
          "Que los chicos no jueguen con vidrios ni latas.",
          "Pegá un autoadhesivo en los ventanales para que no se confundan con una abertura."
        ]
      },
      {
        "type": "guide",
        "id": "nariz",
        "title": "Sangrado de nariz",
        "lead": "Es frecuente, sobre todo en chicos y en mayores de 50 años. En general sangra poco y para solo.",
        "sets": [
          {
            "steps": [
              "Sentá a la persona con la cabeza un poco inclinada hacia adelante.",
              "Pedile que se suene la nariz varias veces.",
              "Apretale la nariz con el índice y el pulgar, de los dos lados."
            ]
          }
        ],
        "dont": [
          "No le pidas que tire la cabeza hacia atrás.",
          "No le pongas gasas ni algodón adentro de la nariz."
        ]
      },
      {
        "type": "guide",
        "id": "cuerpos",
        "title": "Algo en el ojo, el oído o la nariz",
        "lead": "Arena, una pestaña, una semilla, un juguete chico… Lo importante es no empujarlo más adentro.",
        "sets": [
          {
            "label": "Ojo",
            "steps": [
              "Inclinale la cabeza hacia el lado del ojo afectado.",
              "Lavale el ojo con agua corriente o solución fisiológica.",
              "Si la molestia sigue, llevala a un centro oftalmológico."
            ]
          },
          {
            "label": "Oído",
            "steps": [
              "Casi nunca es grave: puede esperar al día siguiente para que lo saquen en un centro de salud.",
              "Si hay dolor, no escucha o le sale pus, llevala ya, con el oído afectado hacia abajo."
            ]
          },
          {
            "label": "Nariz",
            "steps": [
              "Pedile que se suene la nariz tapando el otro lado.",
              "Si no sale, llevala a un hospital."
            ]
          }
        ],
        "dont": [
          "En el ojo: no uses hisopos, gasas ni pañuelos para sacarlo, no lo frotes y no pongas gotas ni cremas.",
          "En el oído: no intentes sacarlo con pinzas."
        ]
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Doble bacteriana · Calendario Nacional de Vacunación, Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/vacunas/doblebacteriana"
      }
    ]
  },
  "quemaduras": {
    "key": [
      {
        "title": "Agua, fuego, vapor",
        "value": "Quemaduras",
        "label": "agua de la canilla",
        "to": "quemaduras"
      },
      {
        "title": "Descarga",
        "value": "Electrocución",
        "label": "primero cortá la luz",
        "to": "electrocucion"
      },
      {
        "title": "Mucho calor",
        "value": "Golpe de calor",
        "label": "sombra y agua fresca",
        "to": "calor"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "quemaduras",
        "title": "Quemaduras",
        "lead": "Las más comunes son con líquidos calientes, en la cocina. También pasan con fuego, vapor, planchas o líquidos inflamables.",
        "sets": [
          {
            "steps": [
              "Tranquilizá a la persona.",
              "Sacale la ropa, anillos, pulseras y cinturones que no estén pegados a la quemadura.",
              "Echale agua de la canilla, ni caliente ni muy fría: calma el dolor y frena la lesión.",
              "Llamá a emergencias o andá al centro de salud más cercano."
            ]
          }
        ],
        "dont": [
          "No pongas hielo, cremas, pasta de dientes ni remedios caseros: empeoran la lesión.",
          "No revientes las ampollas."
        ],
        "help": {
          "title": "Ojo con",
          "items": [
            "Los chicos y las personas mayores: la misma quemadura puede ser más grave."
          ]
        },
        "prevent": [
          "Cociná en las hornallas de atrás, con los mangos hacia adentro.",
          "No dejes a un chico solo con la plancha prendida o con ollas en el fuego.",
          "Probá la temperatura del agua del baño de los chicos.",
          "Guardá fósforos, encendedores y líquidos inflamables en un lugar seguro.",
          "No dejes braseros, velas ni cigarrillos prendidos de noche.",
          "Usá bolsas de agua caliente con tapa de seguridad."
        ]
      },
      {
        "type": "guide",
        "id": "electrocucion",
        "title": "Electrocución",
        "call": true,
        "lead": "Una descarga puede causar desde quemaduras hasta un paro cardíaco. Tu seguridad es lo primero.",
        "sets": [
          {
            "steps": [
              "Si no corrés riesgo, cortá la luz desde la llave general o la térmica: apagar solo el aparato puede no alcanzar.",
              "Si no podés cortarla, alejala de la fuente con algo que no conduzca (un palo, una escoba, una silla de madera), parado sobre algo seco, como goma o papel.",
              "Llamá a emergencias o pedí que lo hagan.",
              "Cuando esté lejos de la corriente, fijate si responde y respira. Si no, empezá con la RCP.",
              "Si está consciente, tranquilizala. Si se quemó, sacale la ropa que salga fácil y lavá con agua corriente.",
              "Si se marea o se pone pálida, acostala en un lugar seco con las piernas un poco levantadas, y abrigala."
            ]
          }
        ],
        "dont": [
          "No uses nada mojado ni de metal para alejarla.",
          "No te acerques a menos de 6 metros si es alto voltaje, hasta que corten la corriente.",
          "En la calle, no toques cables caídos.",
          "No la muevas, salvo que haya fuego o riesgo de explosión.",
          "No le pongas hielo, manteca, cremas ni algodón en la quemadura."
        ],
        "help": {
          "title": "Llamá siempre si",
          "items": [
            "Está desmayada, le cuesta respirar o no respira.",
            "Tiene quemaduras en la boca o grandes.",
            "Fue alto voltaje.",
            "Hubo explosión, incendio o derrame: llamá también a bomberos."
          ]
        },
        "prevent": [
          "Instalá disyuntor y llave térmica, y cortá la luz antes de cualquier arreglo.",
          "No toques aparatos eléctricos descalzo, mojado o tocando una canilla.",
          "Poné protectores en los enchufes si hay chicos.",
          "Que la instalación la haga una persona idónea."
        ]
      },
      {
        "type": "guide",
        "id": "calor",
        "title": "Golpe de calor",
        "lead": "Pasa cuando el cuerpo no logra bajar su temperatura. Corren más riesgo bebés y chicos, personas mayores, embarazadas, quienes tienen enfermedades crónicas y quienes trabajan al calor.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Más de 39 °C de temperatura.",
            "Náuseas, vómitos, mareos o desmayo.",
            "Mucha sed y boca seca.",
            "Mucha transpiración, o piel muy seca.",
            "Dolor de cabeza o de panza."
          ]
        },
        "sets": [
          {
            "steps": [
              "Pedí atención médica: llamá a emergencias o llevala al centro de salud más cercano.",
              "Llevala a la sombra o a un lugar fresco, acostala y levantale los pies unos 30 cm.",
              "Refrescala: mojale la piel con agua fresca o paños húmedos y abanicala. Poné paños fríos en el cuello, las axilas y la ingle.",
              "Si está despierta y no vomita, dale sorbos de agua fresca."
            ]
          }
        ],
        "dont": [
          "No le des remedios para la fiebre, como paracetamol o aspirina.",
          "No le pongas alcohol en la piel.",
          "No le des bebidas con alcohol o cafeína.",
          "No le des nada de tomar si vomita o está desmayada."
        ],
        "help": {
          "title": "Llamá a emergencias si",
          "items": [
            "Se desmaya, está confundida o convulsiona.",
            "Respira o tiene el pulso muy rápido.",
            "No mejora o empeora."
          ]
        },
        "prevent": [
          "Tomá agua seguido, sin esperar a tener sed. A los bebés, dales el pecho más seguido.",
          "Evitá el sol entre las 10 y las 16, y la actividad física intensa.",
          "A los chicos: ropa liviana y clara, gorro, protector solar y mojarles el cuerpo seguido.",
          "Las personas mayores no deberían salir solas durante una ola de calor."
        ]
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Recomendaciones del Ministerio de Salud ante la ola de calor · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/noticias/recomendaciones-del-ministerio-de-salud-ante-la-ola-de-calor"
      },
      {
        "label": "Emergencias por calor · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU.",
        "url": "https://medlineplus.gov/spanish/ency/article/000056.htm"
      }
    ]
  },
  "golpes": {
    "key": [
      {
        "title": "Cabeza, cuello o espalda",
        "value": "Golpes y caídas",
        "label": "no la muevas",
        "to": "caidas"
      },
      {
        "title": "Algo se ve deformado",
        "value": "Fracturas",
        "label": "inmovilizar",
        "to": "fracturas"
      },
      {
        "title": "En la calle",
        "value": "Tránsito",
        "label": "no te expongas",
        "to": "transito"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "caidas",
        "title": "Golpes y caídas",
        "call": true,
        "lead": "Después de un golpe o una caída puede haber lesiones que no se ven, sobre todo en la cabeza, el cuello y la espalda. Moverla puede empeorarlas.",
        "signs": {
          "title": "Es grave si",
          "items": [
            "El golpe fue en la cabeza, el cuello o la espalda.",
            "Un brazo, una pierna o el tronco se ve deformado.",
            "No puede levantarse o caminar sin ayuda."
          ]
        },
        "sets": [
          {
            "steps": [
              "Fijate que no haya peligro para vos ni para la persona.",
              "Dejala quieta: no la muevas ni dejes que se levante.",
              "Hablale en voz alta y fijate si responde. Mirá si el pecho se mueve y escuchá si respira.",
              "Llamá a emergencias si no puede caminar sola o si el golpe fue en la cabeza, el cuello o la espalda.",
              "Si sangra, presioná con una tela lo más limpia posible.",
              "Si no responde y no respira o respira mal, empezá con la RCP.",
              "Quedate con ella y hablale con calma hasta que llegue la ayuda."
            ]
          }
        ],
        "dont": [
          "No la muevas ni la levantes: puede empeorar una lesión de la columna. Ante la duda, esperá a que el personal de salud te diga que lo hagas, aunque sea por teléfono.",
          "No la dejes sola ni hables en voz alta de su estado.",
          "Ojo con los chicos: como es fácil alzarlos, se puede empeorar una lesión."
        ],
        "prevent": [
          "Barandas o rejas en terrazas, ventanas y escaleras; pasamanos firmes.",
          "Pisos secos y sin cosas tiradas; alfombra antideslizante en la bañera.",
          "Buena luz en toda la casa, con la llave fácil de encontrar.",
          "Casco y rodilleras para bici, patines y patineta.",
          "Tapá zanjas, pozos y aljibes."
        ]
      },
      {
        "type": "guide",
        "id": "fracturas",
        "title": "Posibles fracturas",
        "lead": "Si después de un golpe un brazo o una pierna se ve deformado, puede ser una fractura. Lo importante es no empeorarla.",
        "sets": [
          {
            "steps": [
              "Si es en un brazo o una mano, sacale reloj, anillos y pulseras: después la hinchazón no deja sacarlos.",
              "Poné a lo largo algo rígido y limpio (una madera, un palo, un cartón grueso) que tome también la articulación de arriba y la de abajo. Si es el antebrazo: el codo y la muñeca.",
              "Sujetalo con una venda o una tela a lo largo de todo el brazo o la pierna.",
              "Si es un brazo, podés hacer un cabestrillo con un pañuelo o una bufanda colgada del cuello.",
              "Si puede caminar sola y no se ve el hueso, llevala a un centro de salud. Si no, llamá a emergencias."
            ]
          }
        ],
        "dont": [
          "No muevas a la persona ni la parte lastimada si no hace falta.",
          "No la muevas si el golpe fue grave: puede haber lesión de la columna.",
          "Si se ve el hueso, no intentes meterlo: cubrilo con gasas o telas limpias e inmovilizá."
        ],
        "help": {
          "title": "Consultá también",
          "items": [
            "Si después de una caída o una torcedura te quedan dudas, aunque no veas nada deformado."
          ]
        }
      },
      {
        "type": "guide",
        "id": "transito",
        "title": "Accidentes de tránsito",
        "call": true,
        "lead": "En un choque o un atropello es probable que haya lesiones graves. Tu tarea es ser el nexo entre la víctima y emergencias.",
        "sets": [
          {
            "steps": [
              "No te expongas: si hay peligro, no te arriesgues.",
              "Llamá a emergencias o pedí que lo hagan. Es lo más importante.",
              "No muevas a las víctimas: pueden tener una lesión en la columna.",
              "Si alguien sangra mucho, presioná firme sobre la herida (podés usar su ropa). Si tenés guantes, usalos.",
              "Si hay varias víctimas, primero quien no respira bien, está desmayado, sangra mucho o tiene quemaduras o fracturas graves.",
              "Quedate con la víctima y tranquilizala hasta que llegue ayuda capacitada.",
              "Si no hay policía ni seguridad, ayudá a mantener alejados a los curiosos."
            ]
          }
        ],
        "dont": [
          "No muevas a la víctima si no sabés qué hacer.",
          "No la dejes sola."
        ]
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Qué hacer ante emergencias en la vía pública · DINESA, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/dinesa/recomendaciones/emergencias-via-publica"
      }
    ]
  },
  "intoxicaciones": {
    "key": [
      {
        "title": "Tragó, respiró o tocó algo",
        "value": "Intoxicaciones",
        "label": "según cómo fue",
        "to": "intoxicacion"
      },
      {
        "title": "Ronchas o le falta el aire",
        "value": "Alergias",
        "label": "leve o grave",
        "to": "alergias"
      },
      {
        "title": "Perro, alacrán o víbora",
        "value": "Picaduras",
        "label": "y mordeduras",
        "to": "picaduras"
      },
      {
        "title": "Centro de Intoxicaciones",
        "value": "0800-333-0160",
        "label": "gratis, todo el país",
        "to": "intoxicacion"
      }
    ],
    "blocks": [
      {
        "type": "guide",
        "id": "intoxicacion",
        "title": "Intoxicaciones",
        "lead": "Pueden pasar al tragar, respirar o tocar remedios, productos de limpieza, plaguicidas, nafta, monóxido de carbono, alcohol u otras sustancias. Los chicos chicos corren mucho riesgo por curiosidad.",
        "signs": {
          "title": "Cómo darte cuenta",
          "items": [
            "Malestar, dolor de cabeza, mareos, náuseas o vómitos.",
            "Ardor de garganta, tos de golpe, babeo, o le cuesta tragar o respirar.",
            "Debilidad, sueño de golpe, confusión, convulsiones o desmayo.",
            "Envases de remedios o venenos cerca, o restos y quemaduras alrededor de la boca, los ojos o la piel."
          ]
        },
        "sets": [
          {
            "label": "Primero",
            "steps": [
              "No pierdas la calma y pedí ayuda.",
              "Asegurate de no correr peligro y alejá a la persona de la sustancia.",
              "Si tenés dudas, llamá al Centro Nacional de Intoxicaciones: 0800-333-0160, gratis.",
              "Después, llevala al hospital o centro de salud más cercano sin perder tiempo."
            ]
          },
          {
            "label": "La tragó",
            "steps": [
              "Antes de darle cualquier cosa por la boca, llamá al 0800-333-0160 o consultá a un médico.",
              "No la hagas vomitar ni le des de tomar si está desmayada, confundida, adormecida o le cuesta tragar."
            ]
          },
          {
            "label": "La respiró",
            "steps": [
              "Llevala a un lugar abierto y bien ventilado.",
              "Si fue monóxido de carbono: sacala, apagá estufas, calefones u hornos y ventilá.",
              "Aunque se sienta bien, que la vea un médico: el daño del monóxido puede aparecer más tarde."
            ]
          },
          {
            "label": "En la piel",
            "steps": [
              "Sacale rápido la ropa.",
              "Lavale la piel con mucha agua, de 15 a 20 minutos.",
              "No le pongas cremas, grasa ni aceite."
            ]
          },
          {
            "label": "En el ojo",
            "steps": [
              "Pasale suavemente un paño o papel por la cara para sacar restos.",
              "Lavale el ojo abierto con agua a temperatura ambiente, de 15 a 20 minutos.",
              "Fijate que no queden restos en pestañas, cejas o alrededor."
            ]
          }
        ],
        "button": {
          "tel": "08003330160",
          "label": "Llamar al 0800-333-0160"
        },
        "prevent": [
          "Guardá remedios y productos de limpieza lejos de los chicos y en su envase original.",
          "Nunca pongas productos químicos en botellas de bebida.",
          "Con estufas o calefones prendidos, dejá una ventana entreabierta y fijate que la llama sea azul.",
          "Hacé revisar los artefactos a gas por un gasista matriculado.",
          "No prendas el auto en un garaje cerrado.",
          "Evitá automedicarte."
        ]
      },
      {
        "type": "guide",
        "id": "alergias",
        "title": "Reacciones alérgicas",
        "call": true,
        "lead": "Es la respuesta del cuerpo a algo que a la mayoría no le hace daño: alimentos, remedios, picaduras, polen. Muchas son leves, pero una reacción grave (anafilaxia) puede poner en riesgo la vida.",
        "signs": {
          "title": "Es grave (anafilaxia) si",
          "items": [
            "Le cuesta respirar, tose o silba al respirar, o tiene la voz ronca.",
            "Le cuesta tragar.",
            "Se le hincha la cara, los ojos o la lengua.",
            "Siente opresión en el pecho, palpitaciones o mareo, o se desmaya.",
            "Tiene ronchas en todo el cuerpo, o dolor de panza, vómitos o diarrea.",
            "Le afecta varias partes del cuerpo a la vez."
          ]
        },
        "signs2": {
          "title": "Es leve si",
          "items": [
            "Tiene algunas ronchas, sobre todo en el cuello y la cara.",
            "Picazón, nariz tapada u ojos rojos y llorosos."
          ]
        },
        "sets": [
          {
            "label": "Si es grave",
            "steps": [
              "Llamá a emergencias o pedí que lo hagan.",
              "Fijate si respira. Si hace falta, empezá con la RCP.",
              "Si tiene su medicamento de emergencia (por ejemplo, epinefrina), ayudala a usarlo enseguida. No esperes a ver si empeora.",
              "Si fue una picadura de abeja, raspá el aguijón con algo firme, como una uña o una tarjeta.",
              "Acostala boca arriba, levantale los pies unos 30 cm y abrigala. No lo hagas si se golpeó la cabeza, el cuello, la espalda o las piernas, si le molesta o si vomita."
            ]
          },
          {
            "label": "Si es leve",
            "steps": [
              "Tranquilizala: la ansiedad empeora los síntomas.",
              "Tratá de saber qué la provocó y que no vuelva a tocarlo o comerlo.",
              "Mirá cómo sigue. Si empeora, seguí los pasos de una reacción grave.",
              "Consultá a un equipo de salud: ahí te dicen si hace falta un medicamento."
            ]
          }
        ],
        "dont": [
          "No le des nada por la boca si le cuesta respirar.",
          "No le pongas almohada si le cuesta respirar.",
          "No saques el aguijón con pinzas: libera más veneno.",
          "No des por hecho que una vacuna para la alergia la protege del todo."
        ]
      },
      {
        "type": "guide",
        "id": "picaduras",
        "title": "Picaduras y mordeduras",
        "lead": "Una mordedura de perro o gato puede transmitir rabia y tétanos. En Argentina, además, hay alacranes y víboras venenosas (yarará, cascabel y coral).",
        "sets": [
          {
            "label": "Perro o gato",
            "steps": [
              "Lavá la herida con mucha agua y jabón.",
              "Andá rápido al centro de salud: van a ver si necesitás un antibiótico o las vacunas antitetánica o antirrábica.",
              "Si ves un murciélago, no lo toques: avisá al centro de zoonosis más cercano."
            ]
          },
          {
            "label": "Alacrán",
            "steps": [
              "Lavá la picadura con agua y jabón.",
              "Ponele hielo mientras la llevás.",
              "Andá con urgencia al centro de salud más cercano, sobre todo si es un chico.",
              "Si podés, llevá el alacrán en un frasco cerrado para que lo identifiquen."
            ]
          },
          {
            "label": "Víbora",
            "steps": [
              "Pedí ayuda médica ya: llamá a emergencias o andá al centro de salud más cercano.",
              "Sacale anillos, pulseras, tobilleras y zapatos antes de que se hinche.",
              "Que se mueva lo menos posible."
            ]
          }
        ],
        "dont": [
          "No pongas alcohol ni desinfectante en una mordedura de perro o gato.",
          "No toques ni aprietes la herida de una víbora y no hagas torniquetes.",
          "No pongas remedios caseros ni des alcohol o medicamentos sin indicación médica."
        ],
        "prevent": [
          "Sacudí la ropa, el calzado y la cama antes de usarlos, sobre todo antes de acostar a un bebé.",
          "No andes descalzo y revisá cajones y estantes con cuidado.",
          "Poné rejillas en los desagües y mosquiteros o burletes en puertas y ventanas.",
          "En el campo, usá botas y pantalón largo y no metas las manos en huecos ni levantes piedras o troncos.",
          "No toques una víbora, aunque parezca muerta."
        ]
      }
    ],
    "sources": [
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      },
      {
        "label": "Reacciones alérgicas · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU.",
        "url": "https://medlineplus.gov/spanish/ency/article/000005.htm"
      },
      {
        "label": "Anafilaxia · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU.",
        "url": "https://medlineplus.gov/spanish/ency/article/000844.htm"
      },
      {
        "label": "Alergias alimentarias: síntomas · ANMAT, argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/anmat/regulados/alimentos/alergenos-alimentarios/alergenos-alimentarios/sintomas"
      },
      {
        "label": "Rabia (qué hacer ante una mordedura) · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/node/29491"
      },
      {
        "label": "Envenenamiento por alacrán · Glosario, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/glosario/envenenamientoalacran"
      },
      {
        "label": "Envenenamiento por serpiente · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/node/31381"
      },
      {
        "label": "Doble bacteriana · Calendario Nacional de Vacunación, Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/vacunas/doblebacteriana"
      }
    ]
  },
  "botiquin": {
    "key": [
      {
        "title": "Lo básico",
        "value": "8 cosas",
        "label": "para curar heridas",
        "to": "armar"
      },
      {
        "title": "Para completarlo",
        "value": "5 más",
        "label": "vendas, férulas y más",
        "to": "armar"
      },
      {
        "title": "Cada tanto",
        "value": "Revisalo",
        "label": "estado y vencimientos",
        "to": "cuidar"
      }
    ],
    "blocks": [
      {
        "type": "kit",
        "id": "armar",
        "title": "Armá tu botiquín",
        "lead": "Tocá lo que ya tenés: queda marcado en este dispositivo.",
        "groups": [
          {
            "title": "Lo básico",
            "items": [
              {
                "id": "alcohol",
                "name": "Alcohol en gel o líquido",
                "use": "para lavarte las manos"
              },
              {
                "id": "guantes",
                "name": "Guantes descartables",
                "use": "para cuidarte y no contaminar las heridas"
              },
              {
                "id": "jabon",
                "name": "Jabón blanco",
                "use": "para lavar las heridas"
              },
              {
                "id": "antiseptico",
                "name": "Antiséptico",
                "use": "iodopovidona o agua oxigenada de 10 volúmenes"
              },
              {
                "id": "gasas",
                "name": "Gasas y vendas limpias",
                "use": "para limpiar heridas y frenar sangrados"
              },
              {
                "id": "apositos",
                "name": "Apósitos estériles",
                "use": "para cubrir heridas"
              },
              {
                "id": "cinta",
                "name": "Cinta adhesiva",
                "use": "para fijar gasas y vendas"
              },
              {
                "id": "tijera",
                "name": "Tijera",
                "use": "para cortar gasas, vendas o ropa"
              }
            ]
          },
          {
            "title": "Para completarlo",
            "items": [
              {
                "id": "vendas",
                "name": "Vendas de 7 y 10 cm"
              },
              {
                "id": "curitas",
                "name": "Curitas",
                "use": "apósitos autoadhesivos"
              },
              {
                "id": "ferulas",
                "name": "Férulas",
                "use": "de cartón, madera o inflables, para inmovilizar"
              },
              {
                "id": "alfileres",
                "name": "Alfileres de gancho"
              },
              {
                "id": "colirio",
                "name": "Colirio sin antibiótico",
                "use": "para los ojos"
              }
            ]
          }
        ]
      },
      {
        "type": "guide",
        "id": "cuidar",
        "title": "Dónde y cómo tenerlo",
        "sets": [
          {
            "steps": [
              "Guardalo en un lugar fresco, seco y limpio, fácil de alcanzar.",
              "Que quede fuera del alcance de los chicos, igual que los remedios.",
              "Revisá cada tanto que todo esté en buen estado y que nada esté vencido, y reponé lo que uses."
            ]
          }
        ],
        "dont": [
          "No guardes remedios en el botiquín: así se evita la automedicación."
        ],
        "tip": {
          "icon": "info",
          "text": "Los guantes no reemplazan lavarse las manos: antes, lavalas con agua y jabón o con alcohol en gel."
        }
      }
    ],
    "sources": [
      {
        "label": "Botiquín de primeros auxilios · Primeros auxilios, argentina.gob.ar/salud",
        "url": "https://www.argentina.gob.ar/salud/primerosauxilios/botiquin"
      },
      {
        "label": "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
        "url": "https://iah.msal.gov.ar/doc/Documento152.pdf"
      }
    ]
  }
}

/** The ids of the sections in the model → in the app, for the buttons and summary cells that open another section */
export const FIRST_AID_SECTION_IDS: Record<string, string> = {
  "rcp": "section-1",
  "ahogos": "section-2",
  "malestares": "section-3",
  "heridas": "section-4",
  "quemaduras": "section-5",
  "golpes": "section-6",
  "intoxicaciones": "section-7",
  "botiquin": "section-8"
}
