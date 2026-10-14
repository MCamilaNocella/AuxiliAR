import type { QuizItem } from "@/components/sectionBlocks/BlockQuiz"
import type { VaccineStage } from "@/components/sectionBlocks/VaccineCalendar"
import type { Source } from "@/components/health/SourceList"

// The content of every section, from the chosen model (diseñoCategorias/salud-general-6-renglones-con-resumen.html). Icons are lucide names (utils/blockIcons)

/** Dónde atenderme: the three places and when to call emergencies */
export const PH_WHERE = {
  "intro": "Cada lugar está pensado para algo distinto. Elegir bien te ahorra tiempo y te asegura la atención que necesitás.",
  "places": [
    {
      "id": "cesac",
      "icon": "stethoscope",
      "name": "Centro de salud",
      "short": "CeSAC",
      "when": "Controles, consultas habituales y prevención",
      "text": "Es la puerta de entrada al sistema de salud: un equipo que puede conocerte y acompañarte en el tiempo.",
      "examples": [
        "Un control aunque te sientas bien",
        "Vacunas",
        "Una consulta que no es urgente"
      ]
    },
    {
      "id": "hospital",
      "icon": "hospital",
      "name": "Hospital",
      "short": "Especialidades",
      "when": "Especialidades, estudios y atención de mayor complejidad",
      "text": "Para lo que necesita especialistas, estudios o una atención más compleja.",
      "examples": [
        "Estudios",
        "Especialistas",
        "Tratamientos más complejos"
      ]
    },
    {
      "id": "guardia",
      "icon": "building-2",
      "name": "Guardia",
      "short": "Urgencias",
      "when": "Problemas que necesitan atención en el momento",
      "text": "Para lo que no puede esperar a un turno. Hay guardias odontológicas y oftalmológicas para urgencias de la boca y los ojos.",
      "examples": [
        "Un dolor de muela muy fuerte",
        "Un golpe en el ojo",
        "Algo que no puede esperar a un turno"
      ]
    }
  ],
  "emergency": "Si hay riesgo para la vida (una persona no responde, no puede respirar), no vayas por tu cuenta: llamá al número de emergencias. Están siempre arriba, en la barra roja.",
  "mapLabel": "Buscar un centro cerca"
} as const

/** Controles de salud: each check, how often, what to watch for */
export const PH_CONTROLS: { items: { id: string, icon: string, title: string, tone: 1 | 2 | 3 | 4 | 5, headline: { value: string, label: string }, rows: { who: string, what: string }[], watch?: { title: string, points: string[], urgent?: boolean }, note?: string }[], general: string } = {
  "items": [
    {
      "id": "bucal",
      "icon": "smile",
      "title": "Salud bucal",
      "tone": 1,
      "headline": {
        "value": "Cada 6 meses",
        "label": "consulta odontológica"
      },
      "rows": [
        {
          "who": "Adultos y +65",
          "what": "Al menos 2 veces por año"
        },
        {
          "who": "Niños desde los 3 años",
          "what": "Al menos 1 vez por año"
        },
        {
          "who": "Embarazo",
          "what": "Apenas se confirma y luego cada 3 meses"
        }
      ],
      "watch": {
        "title": "Consultá antes si notás",
        "points": [
          "Dolor al tomar o comer algo frío o caliente",
          "Sangrado de encías",
          "Aftas o úlceras que no cicatrizan en 2 semanas",
          "Dientes que se mueven o cambian de lugar"
        ]
      },
      "note": "Ante un dolor, no te automediques."
    },
    {
      "id": "visual",
      "icon": "eye",
      "title": "Salud visual",
      "tone": 2,
      "headline": {
        "value": "1 vez por año",
        "label": "después de los 40"
      },
      "rows": [
        {
          "who": "Infancia y adolescencia",
          "what": "Al nacer, a los 3 años, antes de empezar la primaria y a los 13 años"
        },
        {
          "who": "Diabetes",
          "what": "Controles más seguidos con oftalmología: tu equipo te dice cada cuánto"
        },
        {
          "who": "Bebés prematuros",
          "what": "Seguimiento oftalmológico"
        }
      ],
      "watch": {
        "title": "No esperes al control si hay",
        "points": [
          "Un golpe en el ojo",
          "Pérdida repentina de la vista",
          "Un dolor muy fuerte"
        ],
        "urgent": true
      },
      "note": "Si la visión se vuelve borrosa, consultá con oftalmología."
    },
    {
      "id": "corazon",
      "icon": "heart-pulse",
      "title": "Presión y azúcar en sangre",
      "tone": 3,
      "headline": {
        "value": "En cada consulta",
        "label": "conviene tomar la presión"
      },
      "rows": [
        {
          "who": "Presión · 18 a 40 años, sin factores de riesgo y hasta 130/80",
          "what": "Al menos cada 3 a 5 años"
        },
        {
          "who": "Presión · desde los 40, con factores de riesgo o entre 130–139 / 80–89",
          "what": "Al menos 1 vez por año"
        },
        {
          "who": "Glucemia en ayunas · desde los 45 (antes, con un factor de riesgo)",
          "what": "Si da normal, cada 3 años"
        }
      ],
      "watch": {
        "title": "Factores de riesgo",
        "points": [
          "Edad",
          "Sobrepeso u obesidad",
          "Sedentarismo",
          "Mucha sal",
          "Familiares directos con hipertensión",
          "Diabetes o enfermedad renal crónica"
        ]
      },
      "note": "La hipertensión casi nunca da síntomas: solo se detecta midiéndola. El colesterol y el electrocardiograma los indica tu equipo según tu riesgo."
    },
    {
      "id": "vacunas",
      "icon": "syringe",
      "title": "Vacunas",
      "tone": 4,
      "headline": {
        "value": "Cada 10 años",
        "label": "refuerzo de doble bacteriana"
      },
      "rows": [
        {
          "who": "Antigripal",
          "what": "Todos los años, en la campaña, si estás en los grupos indicados"
        },
        {
          "who": "Calendario Nacional",
          "what": "Cada etapa de la vida tiene sus vacunas (ver Calendario de vacunación)"
        }
      ],
      "note": "Las vacunas del Calendario no necesitan orden médica. Llevá tu carnet para que lo revisen."
    },
    {
      "id": "cancer",
      "icon": "scan-search",
      "title": "Detección temprana de cáncer",
      "tone": 5,
      "headline": {
        "value": "Desde los 25",
        "label": "según edad y estudio"
      },
      "rows": [
        {
          "who": "Cuello de útero · desde los 25",
          "what": "Papanicolaou. Después de 2 resultados normales seguidos (uno por año), cada 3 años"
        },
        {
          "who": "Cuello de útero · desde los 30, donde hay test de VPH",
          "what": "Test de VPH. Si da negativo, cada 5 años"
        },
        {
          "who": "Mama · mujeres de 50 a 69",
          "what": "Mamografía cada 1 o 2 años, con examen de las mamas"
        },
        {
          "who": "Colorrectal · de 50 a 75",
          "what": "Test de sangre oculta en materia fecal. Si da negativo, se repite: tu equipo te dice cuándo"
        }
      ],
      "note": "Es para personas sin síntomas ni antecedentes. Con síntomas o antecedentes familiares, consultá a tu equipo de salud."
    }
  ],
  "general": "No existe un «chequeo» igual para todas las personas: cada control depende de tu edad y tus factores de riesgo. Si tomás medicación, no la cambies ni la dejes sin hablarlo."
}

/** Calendario de vacunación: the stages of life and what to remember */
export const PH_VACCINES: { stages: VaccineStage[], remember: string[], pdf: string } = {
  "stages": [
    {
      "id": "recien-nacidos",
      "title": "Recién nacidos",
      "short": "Al nacer",
      "intro": "La aplicación de vacunas desde edades tempranas protege a quienes son más susceptibles a contraer enfermedades infecciosas potencialmente graves.",
      "groups": [
        {
          "heading": null,
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Tuberculosis (BCG)",
              "dose": "Única dosis, antes de salir de la maternidad. Previene las formas graves de tuberculosis.",
              "details": []
            },
            {
              "vaccine": "Hepatitis B",
              "dose": "Una dosis neonatal, dentro de las primeras 12 horas de vida.",
              "details": [
                "Si por cualquier motivo no la recibió en ese lapso, debe recibirla tan pronto como sea posible."
              ]
            }
          ]
        }
      ],
      "notes": [],
      "confirm": []
    },
    {
      "id": "hasta-un-ano",
      "title": "Hasta un año",
      "short": "Hasta 1 año",
      "intro": "La mayoría de las vacunas se aplican durante el primer año de vida. En esta etapa se inician varios esquemas de vacunación.",
      "groups": [
        {
          "heading": "A los 2 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Neumococo conjugada",
              "dose": "Primera dosis.",
              "details": []
            },
            {
              "vaccine": "Poliomielitis (IPV o Salk)",
              "dose": "Primera dosis.",
              "details": []
            },
            {
              "vaccine": "Quíntuple (o pentavalente)",
              "dose": "Primera dosis. También protege contra la hepatitis B.",
              "details": []
            },
            {
              "vaccine": "Rotavirus",
              "dose": "Primera dosis.",
              "details": [
                "Límite de edad para esta dosis: 14 semanas y 6 días de vida."
              ]
            }
          ]
        },
        {
          "heading": "A los 3 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Meningococo (vacuna tetravalente ACYW)",
              "dose": "Primera dosis.",
              "details": []
            }
          ]
        },
        {
          "heading": "A los 4 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Neumococo conjugada",
              "dose": "Segunda dosis.",
              "details": []
            },
            {
              "vaccine": "Poliomielitis (IPV o Salk)",
              "dose": "Segunda dosis.",
              "details": []
            },
            {
              "vaccine": "Quíntuple (o pentavalente)",
              "dose": "Segunda dosis.",
              "details": []
            },
            {
              "vaccine": "Rotavirus",
              "dose": "Segunda dosis.",
              "details": [
                "Límite de edad para la última dosis: 24 semanas de vida."
              ]
            }
          ]
        },
        {
          "heading": "A los 5 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Meningococo (vacuna tetravalente ACYW)",
              "dose": "Segunda dosis.",
              "details": []
            }
          ]
        },
        {
          "heading": "A los 6 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Poliomielitis (IPV o Salk)",
              "dose": "Tercera dosis.",
              "details": []
            },
            {
              "vaccine": "Quíntuple (o pentavalente)",
              "dose": "Tercera dosis.",
              "details": []
            }
          ]
        },
        {
          "heading": "Entre los 6 y los 24 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "Se aplica en cada campaña estacional.",
              "details": [
                "Si todavía no recibió dos dosis de antigripal en campañas anteriores: dos dosis, con un mes de intervalo entre una y otra (como mínimo, 4 semanas).",
                "Si ya recibió al menos dos dosis en campañas anteriores: una sola dosis."
              ]
            }
          ]
        },
        {
          "heading": "A los 12 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Neumococo conjugada",
              "dose": "Refuerzo.",
              "details": []
            },
            {
              "vaccine": "Hepatitis A",
              "dose": "Única dosis.",
              "details": []
            },
            {
              "vaccine": "Triple viral",
              "dose": "Primera dosis.",
              "details": []
            }
          ]
        }
      ],
      "notes": [
        "Control de salud: al menos una vez por año, aunque no esté enfermo o enferma. Incluye una visita a oftalmología y a odontología."
      ],
      "confirm": [
        {
          "topic": "Neumococo",
          "what": "Confirmá en el vacunatorio qué vacuna corresponde según el momento: la de 20 serotipos (VCN20) está reemplazando a la de 13 (VCN13)."
        }
      ]
    },
    {
      "id": "hasta-2-anios",
      "title": "Hasta 2 años",
      "short": "Hasta 2 años",
      "intro": "Vacunas que se aplican a partir del año de edad y hasta los dos años.",
      "groups": [
        {
          "heading": "A los 15 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Meningococo (vacuna tetravalente ACYW)",
              "dose": "Refuerzo.",
              "details": []
            },
            {
              "vaccine": "Varicela",
              "dose": "Primera dosis.",
              "details": []
            }
          ]
        },
        {
          "heading": "Entre los 15 y los 18 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Triple viral",
              "dose": "Segunda dosis.",
              "details": []
            },
            {
              "vaccine": "Quíntuple (o pentavalente)",
              "dose": "Refuerzo.",
              "details": []
            }
          ]
        },
        {
          "heading": "A los 18 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Fiebre amarilla",
              "dose": "Primera dosis, solo para quienes viven en zonas de riesgo.",
              "details": [
                "Zonas de riesgo según la página oficial de fiebre amarilla: Formosa, Misiones y Corrientes; Jujuy (departamentos de Ledesma, Santa Bárbara, San Pedro y Valle Grande); Salta (departamentos de General José de San Martín, Orán, Rivadavia y Anta); y Chaco (departamento de Bermejo).",
                "La vacuna tiene contraindicaciones y precauciones (por ejemplo, alergia a componentes de la vacuna, edad menor de 6 meses o problemas del sistema inmune). Consultá antes con tu equipo de salud."
              ]
            }
          ]
        },
        {
          "heading": "Entre los 6 y 24 meses",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "Sigue la indicación de la etapa anterior: se aplica en cada campaña estacional, con dos dosis si no recibió antes dos, o una si ya las recibió.",
              "details": []
            }
          ]
        },
        {
          "heading": "Triple viral: cómo funciona en 2026",
          "paragraphs": [
            "Desde el 1.° de enero de 2026, la segunda dosis de triple viral se aplica entre los 15 y los 18 meses a quienes nacieron desde el 1.° de julio de 2024.",
            "Quienes nacieron antes completan la segunda dosis a los 5 años (ver la etapa «5 años»). Si el esquema está incompleto, se completa.",
            "Las dosis «cero» o adicionales que se aplicaron por un brote, un bloqueo o la campaña de seguimiento 2022 no cuentan como parte del esquema regular."
          ],
          "items": []
        }
      ],
      "notes": [
        "Las vacunas de virus vivos atenuados (varicela, triple viral y fiebre amarilla) pueden aplicarse el mismo día. Si no se aplican el mismo día, debe haber al menos 28 días entre una y otra."
      ],
      "confirm": [
        {
          "topic": "Fiebre amarilla: edad de la primera dosis",
          "what": "La edad exacta de la primera dosis (entre los 12 y los 18 meses) la confirma el vacunatorio."
        },
        {
          "topic": "Fiebre amarilla: zonas de riesgo",
          "what": "Las zonas pueden cambiar: la lista vigente está en la página oficial de fiebre amarilla."
        }
      ]
    },
    {
      "id": "5-anios",
      "title": "5 años",
      "short": "5 años",
      "intro": "En 2026, las vacunas del Calendario se aplican de forma gratuita en centros de salud y hospitales públicos a quienes nacieron en 2021, aunque aún no hayan cumplido los 5 años.",
      "groups": [
        {
          "heading": null,
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Poliomielitis (IPV)",
              "dose": "Refuerzo.",
              "details": []
            },
            {
              "vaccine": "Triple bacteriana celular (DTP)",
              "dose": "Una dosis de refuerzo.",
              "details": []
            },
            {
              "vaccine": "Varicela",
              "dose": "Segunda dosis.",
              "details": []
            },
            {
              "vaccine": "Triple viral",
              "dose": "Segunda dosis, según la fecha de nacimiento:",
              "details": [
                "Nacidos entre el 1.° de enero de 2021 y el 30 de junio de 2024: segunda dosis en el año en que cumplen 5 años. En 2026 les corresponde a los nacidos en 2021; los nacidos en 2022, 2023 y hasta el 30 de junio de 2024 la recibirán en el año en que cumplan 5 años.",
                "Nacidos desde el 1.° de julio de 2024: segunda dosis entre los 15 y los 18 meses (ver «Hasta 2 años»).",
                "Si el esquema está incompleto, se completa."
              ]
            }
          ]
        }
      ],
      "notes": [
        "Control de salud: al menos una vez por año, aunque no esté enfermo o enferma. Incluye una visita a oftalmología y a odontología."
      ],
      "confirm": []
    },
    {
      "id": "11-anios",
      "title": "11 años",
      "short": "11 años",
      "intro": "En 2026, las vacunas del Calendario se aplican de forma gratuita en centros de salud y hospitales públicos a quienes nacieron en 2015, aunque aún no hayan cumplido los 11 años.",
      "groups": [
        {
          "heading": null,
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Meningococo (vacuna tetravalente ACYW)",
              "dose": "Una única dosis.",
              "details": []
            },
            {
              "vaccine": "Triple bacteriana acelular (dTpa)",
              "dose": "Una única dosis.",
              "details": []
            },
            {
              "vaccine": "VPH (Virus del Papiloma Humano)",
              "dose": "Una única dosis, para varones y mujeres.",
              "details": []
            },
            {
              "vaccine": "Fiebre amarilla (refuerzo)",
              "dose": "Para quienes viven en zonas de riesgo y recibieron la primera dosis antes de los 2 años.",
              "details": []
            },
            {
              "vaccine": "Hepatitis B",
              "dose": "Si no tiene el esquema, se inicia a partir de los 11 años con 3 dosis.",
              "details": [
                "La segunda dosis se aplica un mes después de la primera y la tercera, a los 6 meses de la primera."
              ]
            }
          ]
        }
      ],
      "notes": [
        "Control de salud: al menos una vez por año, aunque no esté enfermo o enferma."
      ],
      "confirm": [
        {
          "topic": "VPH si no lo recibiste a los 11 años",
          "what": "Puede estar disponible hasta ciertas edades y con otros esquemas. Consultá la página oficial de VPH o el vacunatorio."
        }
      ]
    },
    {
      "id": "15-a-64",
      "title": "15 a 64 años",
      "short": "15 a 64",
      "intro": "La vacunación en esta etapa sirve para recibir refuerzos de vacunas ya aplicadas, protegerse contra otras enfermedades y completar esquemas.",
      "groups": [
        {
          "heading": "Vacunas para todas las personas de esta edad",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Doble bacteriana (difteria y tétanos)",
              "dose": "Iniciar o completar el esquema de 3 dosis; después, un refuerzo cada 10 años.",
              "details": []
            },
            {
              "vaccine": "Doble o triple viral (sarampión y rubéola)",
              "dose": "Toda persona a partir de los 5 años debe acreditar 2 dosis de vacuna con componente contra sarampión y rubéola aplicadas después del año de vida, o contar con serología IgG positiva para ambos virus.",
              "details": [
                "Las personas nacidas antes de 1965 no necesitan vacunarse.",
                "No se aplica en el embarazo ni en personas con inmunocompromiso, entre otras contraindicaciones."
              ]
            },
            {
              "vaccine": "Hepatitis B",
              "dose": "Es obligatoria y no requiere orden médica a cualquier edad. Quien no tiene el esquema lo inicia o completa con 3 dosis.",
              "details": [
                "La segunda dosis se aplica un mes después de la primera y la tercera, a los 6 meses de la primera."
              ]
            }
          ]
        },
        {
          "heading": "Según tu situación",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "Se aplica en cada campaña estacional. Los lineamientos técnicos 2026 indican una dosis para las personas de 9 a 64 años.",
              "details": [
                "Grupos incluidos en esta etapa: personal de salud; embarazadas, en cada embarazo; puérperas; personas con factores de riesgo; y personal estratégico (Fuerzas Armadas y Fuerzas de Seguridad).",
                "Factores de riesgo, en resumen: enfermedades respiratorias crónicas y asma moderada o grave; enfermedades cardíacas; inmunodeficiencias; enfermedad oncohematológica y trasplante; diabetes; insuficiencia renal crónica en diálisis; síndromes genéticos y enfermedades neuromusculares con compromiso respiratorio; convivientes de personas con enfermedad oncohematológica o de recién nacidos prematuros, entre otros.",
                "Las personas con factores de riesgo pueden presentar orden médica o documentación que acredite la condición."
              ]
            },
            {
              "vaccine": "Fiebre hemorrágica argentina",
              "dose": "A partir de los 15 años, dosis única, para quienes viven o trabajan en la zona endémica (ciertas jurisdicciones de Buenos Aires, Córdoba, Santa Fe y La Pampa).",
              "details": []
            },
            {
              "vaccine": "Fiebre amarilla",
              "dose": "De 2 a 59 años, para quienes viven en zonas de riesgo y no recibieron dosis anteriores: dosis única.",
              "details": [
                "Consultá antes las contraindicaciones con tu equipo de salud. Las zonas de riesgo están en la etapa «Hasta 2 años»."
              ]
            }
          ]
        },
        {
          "heading": "Si trabajás en el sistema de salud",
          "paragraphs": [
            "Este apartado es para todas las personas que trabajan en el sistema de salud: mesa de entradas, limpieza, seguridad, laboratorio, planta médica y de enfermería, entre otras."
          ],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "El personal de salud es uno de los grupos de la campaña. Se aplica en cada campaña estacional; los lineamientos técnicos 2026 indican una dosis.",
              "details": []
            },
            {
              "vaccine": "Triple bacteriana acelular (dTpa)",
              "dose": "Una dosis única, en reemplazo de uno de los refuerzos de doble bacteriana.",
              "details": [
                "Quienes cuidan a menores de 12 meses reciben un refuerzo cada 5 años."
              ]
            },
            {
              "vaccine": "Doble o triple viral",
              "dose": "Hay que acreditar dos dosis aplicadas después del año de vida, o tener serología IgG positiva para sarampión y rubéola.",
              "details": []
            },
            {
              "vaccine": "Fiebre amarilla",
              "dose": "Es fundamental estar protegido si trabajás en zonas de riesgo.",
              "details": []
            }
          ]
        }
      ],
      "notes": [],
      "confirm": [
        {
          "topic": "Antigripal con factores de riesgo",
          "what": "La lista completa de factores de riesgo, y si hace falta orden médica, está en los lineamientos oficiales de antigripal 2026 o en el vacunatorio."
        },
        {
          "topic": "Fiebre hemorrágica argentina",
          "what": "Hay condiciones extra (por ejemplo, riesgo por el trabajo o no haberla recibido antes): confirmalas en el vacunatorio."
        },
        {
          "topic": "Personal de salud",
          "what": "Hay otras indicaciones y obligaciones (por ejemplo, hepatitis B, varicela y normas de la Ley 27.491). Consultalas en la fuente oficial o en el vacunatorio."
        },
        {
          "topic": "Neumococo y VPH",
          "what": "Hay indicaciones para personas de 5 a 64 años con ciertas condiciones (neumococo) y hasta los 26 años (VPH). Consultalas en la página oficial o en el vacunatorio."
        }
      ]
    },
    {
      "id": "embarazo",
      "title": "Embarazo",
      "short": "Embarazo",
      "intro": "Las vacunas durante el embarazo protegen a la persona embarazada y también al bebé, gracias al paso de anticuerpos por la placenta.",
      "groups": [
        {
          "heading": "Vacunas de cada embarazo",
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "Una dosis, en cualquier trimestre del embarazo.",
              "details": []
            },
            {
              "vaccine": "Triple bacteriana acelular (dTpa)",
              "dose": "Una dosis, a partir de la semana 20 de embarazo, sin importar las dosis recibidas antes.",
              "details": []
            },
            {
              "vaccine": "Virus Sincicial Respiratorio (VSR)",
              "dose": "Una dosis, entre la semana 32 y la semana 36,6 del embarazo.",
              "details": [
                "Es una estrategia estacional: se aplica durante la temporada de circulación del virus.",
                "El Ministerio de Salud informa cada año cuándo empieza y cuándo termina la temporada de vacunación. Consultá en tu centro de salud o vacunatorio si ya comenzó."
              ]
            }
          ]
        },
        {
          "heading": "Vacunas que no se aplican durante el embarazo",
          "paragraphs": [
            "La triple viral y la varicela son vacunas de virus vivos atenuados y están contraindicadas durante el embarazo."
          ],
          "items": []
        },
        {
          "heading": "Después del parto",
          "paragraphs": [
            "Si no recibiste la vacuna antigripal durante el embarazo, el Ministerio indica que puede aplicarse después del parto, con un máximo de 10 días."
          ],
          "items": []
        }
      ],
      "notes": [],
      "confirm": [
        {
          "topic": "Antigripal después del parto",
          "what": "Preguntá en la maternidad o en el vacunatorio si conviene aplicarla antes del alta."
        },
        {
          "topic": "Otras vacunas durante el embarazo o después del parto",
          "what": "Puede que te correspondan otras (por ejemplo, hepatitis B o triple viral): preguntá en el vacunatorio."
        }
      ]
    },
    {
      "id": "65-o-mas",
      "title": "65 años o más",
      "short": "65 o más",
      "intro": "Las personas adultas de 65 años o más deben continuar con los refuerzos de vacunas ya aplicadas, completar esquemas y protegerse contra la gripe y el neumococo, principales causas de complicaciones en esta etapa de la vida.",
      "groups": [
        {
          "heading": null,
          "paragraphs": [],
          "items": [
            {
              "vaccine": "Antigripal",
              "dose": "Se aplica en cada campaña estacional. Los lineamientos técnicos 2026 indican una dosis. No hace falta orden médica.",
              "details": []
            },
            {
              "vaccine": "Neumococo",
              "dose": "El esquema es de una dosis de VCN20. No hace falta orden médica.",
              "details": []
            },
            {
              "vaccine": "Doble bacteriana (difteria y tétanos)",
              "dose": "Iniciar o completar el esquema de 3 dosis; después, un refuerzo cada 10 años.",
              "details": []
            },
            {
              "vaccine": "Doble o triple viral",
              "dose": "Las personas nacidas antes de 1965 no necesitan vacunarse.",
              "details": []
            }
          ]
        },
        {
          "heading": "Hepatitis B",
          "paragraphs": [
            "La hepatitis B es obligatoria y no requiere orden médica a cualquier edad. Si no sabés si tenés el esquema, consultá en el vacunatorio."
          ],
          "items": []
        }
      ],
      "notes": [],
      "confirm": [
        {
          "topic": "Neumococo si ya te vacunaste",
          "what": "Si ya recibiste alguna vacuna contra el neumococo, el equipo de salud evalúa si corresponde continuar el esquema. Consultalo en el vacunatorio."
        },
        {
          "topic": "Fiebre amarilla",
          "what": "Si vivís en una zona de riesgo o vas a viajar a una zona con transmisión, consultá antes con tu equipo de salud."
        }
      ]
    }
  ],
  "remember": [
    "Llevá tu carnet de vacunas cuando vayas al vacunatorio.",
    "Si no sabés qué te falta o perdiste el carnet, consultá igual: te orientan.",
    "Los esquemas particulares (enfermedades previas, embarazo, trabajo en salud) se confirman con tu equipo de salud."
  ],
  "pdf": "https://www.argentina.gob.ar/sites/default/files/2026-03-10_calendario_nacional_vacunacion_70x50_web.pdf"
}

/** Alimentación y nutrición: the 10 messages, the black seals and where to ask */
export const PH_FOOD: { guides: { title: string, lead: string, items: { icon: string, short: string, text: string }[] }, labels: { title: string, text: string }, blocks: { id: string, icon: string, title: string, lead: string, points: string[], note: string, urgentNote?: boolean }[] } = {
  "guides": {
    "title": "Los 10 mensajes de las Guías Alimentarias",
    "lead": "Recomendaciones del Ministerio de Salud de la Nación para toda la población.",
    "items": [
      {
        "icon": "salad",
        "short": "De todo un poco",
        "text": "Incorporá a diario alimentos de todos los grupos y realizá al menos 30 minutos de actividad física."
      },
      {
        "icon": "glass-water",
        "short": "8 vasos de agua",
        "text": "Tomá a diario 8 vasos de agua segura."
      },
      {
        "icon": "apple",
        "short": "5 porciones",
        "text": "Consumí a diario 5 porciones de frutas y verduras en variedad de tipos y colores."
      },
      {
        "icon": "triangle",
        "short": "Menos sal",
        "text": "Reducí el uso de sal y el consumo de alimentos con alto contenido de sodio."
      },
      {
        "icon": "cup-soda",
        "short": "Menos azúcar",
        "text": "Limitá el consumo de bebidas azucaradas y de alimentos con elevado contenido de grasas, azúcar y sal."
      },
      {
        "icon": "milk",
        "short": "Lácteos",
        "text": "Consumí diariamente leche, yogur o queso, preferentemente descremados."
      },
      {
        "icon": "fish",
        "short": "Carnes y huevo",
        "text": "Al consumir carnes quitale la grasa visible, aumentá el consumo de pescado e incluí huevo."
      },
      {
        "icon": "wheat",
        "short": "Legumbres y cereales",
        "text": "Consumí legumbres, cereales preferentemente integrales, papa, batata, choclo o mandioca."
      },
      {
        "icon": "nut",
        "short": "Aceite y semillas",
        "text": "Consumí aceite crudo como condimento, frutas secas o semillas."
      },
      {
        "icon": "wine",
        "short": "Alcohol, con responsabilidad",
        "text": "Si vas a consumir bebidas alcohólicas, hacelo de forma responsable. Niños, adolescentes y embarazadas no deben consumirlas, y nunca al manejar."
      }
    ]
  },
  "labels": {
    "title": "Los sellos negros",
    "text": "Por la Ley 27.642 de Alimentación Saludable, los octógonos negros avisan que un producto tiene exceso de azúcares, sodio, grasas o calorías. Sirven para comparar productos antes de comprarlos."
  },
  "blocks": [
    {
      "id": "professional",
      "icon": "stethoscope",
      "title": "Cuándo pedir orientación profesional",
      "lead": "Si tu alimentación necesita algo más que información general, hablalo con el equipo de salud:",
      "points": [
        "Tenés una enfermedad o tomás medicación",
        "Estás embarazada o dando de mamar",
        "Querés cambiar tu peso",
        "Tenés alergias o intolerancias",
        "Tenés dudas sobre la alimentación de un bebé o un niño"
      ],
      "note": "En tu centro de salud podés preguntar si hay atención por nutrición y cómo se pide el turno."
    },
    {
      "id": "assistance",
      "icon": "hand-heart",
      "title": "Si te cuesta conseguir alimentos",
      "lead": "Hay programas del Estado para eso. No son atención de salud: se piden en las áreas de desarrollo o atención social.",
      "points": [
        "Pueden ser comedores, entrega de alimentos o ayudas para comprar comida",
        "Los requisitos y cómo se pide cambian en cada municipio o provincia",
        "Preguntá en el área de desarrollo social de tu municipio o provincia"
      ],
      "note": "Si un bebé o un niño deja de comer o está muy decaído, consultá en un centro de salud o en una guardia.",
      "urgentNote": true
    }
  ]
}

/** Actividad física y bienestar: how much to move, free options, before starting */
export const PH_ACTIVITY = {
  "groups": [
    {
      "id": "adultos",
      "icon": "user",
      "who": "Personas adultas",
      "value": "150 a 300",
      "unit": "min por semana",
      "detail": "de actividad moderada (o 75 a 150 de actividad intensa)",
      "extra": "Y ejercicios de fuerza 2 o más días por semana."
    },
    {
      "id": "chicos",
      "icon": "user-round",
      "who": "Niños, niñas y adolescentes",
      "value": "60",
      "unit": "min por día",
      "detail": "en promedio, de actividad moderada a intensa",
      "extra": ""
    },
    {
      "id": "mayores",
      "icon": "person-standing",
      "who": "Personas mayores",
      "value": "+ equilibrio",
      "unit": "",
      "detail": "lo mismo que los adultos, sumando ejercicios de equilibrio y coordinación",
      "extra": "Ayudan a prevenir caídas."
    },
    {
      "id": "embarazo",
      "icon": "heart",
      "who": "Embarazo y posparto",
      "value": "Regular",
      "unit": "",
      "detail": "mantener la actividad física durante el embarazo y después del parto",
      "extra": "Consultalo con tu equipo de salud."
    }
  ],
  "sitLess": "Pasá menos tiempo sentado o sentada: cada pausa para moverte cuenta.",
  "free": {
    "title": "Opciones que no cuestan nada",
    "items": [
      {
        "icon": "footprints",
        "text": "Caminar o subir escaleras"
      },
      {
        "icon": "sparkles",
        "text": "Bailar en casa"
      },
      {
        "icon": "dumbbell",
        "text": "Ejercicios con el peso del cuerpo"
      },
      {
        "icon": "bike",
        "text": "Plazas y parques de acceso libre"
      }
    ],
    "note": "Algunos municipios ofrecen actividades gratuitas al aire libre: preguntá en el área de deportes o de salud de tu municipio."
  },
  "before": {
    "title": "Antes de empezar",
    "points": [
      "Si tenés una condición de salud, estás embarazada o hace mucho que no te movés, consultá antes con tu equipo de salud.",
      "Empezá despacio, tomá agua y pará si algo te duele."
    ]
  },
  "alarm": "Dolor de pecho, falta de aire intensa, mareo fuerte o desmayo son una emergencia: llamá al número de emergencias."
} as const

/** Quiz: 8 everyday situations */
export const PH_QUIZ: QuizItem[] = [
  {
    "topic": "Atención primaria",
    "prompt": "Hace tiempo que no te hacés un control. Te sentís bien, pero querés revisar cómo estás. ¿A dónde te conviene ir?",
    "options": [
      {
        "text": "A una guardia",
        "correct": false,
        "feedback": "La guardia es para problemas que necesitan atención en el momento. Para un control, el centro de salud es mejor puerta de entrada."
      },
      {
        "text": "A un centro de salud (CeSAC)",
        "correct": true,
        "feedback": "Los centros de salud son el lugar para controles, consultas habituales y prevención."
      },
      {
        "text": "Llamo al número de emergencias",
        "correct": false,
        "feedback": "El número de emergencias es para cuando hay riesgo inmediato. Un control se hace en un centro de salud."
      }
    ],
    "learning": "Controles y consultas de rutina: centro de salud. No hace falta esperar a tener un problema.",
    "id": "q1"
  },
  {
    "topic": "Vacunación",
    "prompt": "Verdadero o falso: para saber si tenés vacunas pendientes, conviene revisar tu carnet de vacunación.",
    "options": [
      {
        "text": "Verdadero",
        "correct": true,
        "feedback": "El carnet muestra qué vacunas ya te dieron. Con él, el vacunatorio puede ver qué falta."
      },
      {
        "text": "Falso",
        "correct": false,
        "feedback": "Es al revés: el carnet es la mejor guía. Si no lo encontrás, igual podés consultar en un vacunatorio."
      }
    ],
    "learning": "Llevá tu carnet al vacunatorio. Si no lo tenés, consultá igual.",
    "id": "q2"
  },
  {
    "topic": "Emergencias",
    "prompt": "Una persona se desmaya delante tuyo y no responde cuando la llamás. ¿Qué hacés primero?",
    "options": [
      {
        "text": "La llevo yo a una guardia",
        "correct": false,
        "feedback": "Es normal querer actuar rápido, pero ante un riesgo inmediato conviene llamar al número de emergencias antes que improvisar un traslado."
      },
      {
        "text": "Espero un rato a ver si se le pasa",
        "correct": false,
        "feedback": "Esperar puede hacer perder un tiempo valioso. Si una persona no responde, es una emergencia."
      },
      {
        "text": "Llamo al número de emergencias",
        "correct": true,
        "feedback": "Ante un riesgo inmediato, pedir ayuda al número de emergencias es lo primero: pueden orientarte y enviar ayuda."
      }
    ],
    "learning": "Riesgo inmediato: llamá primero al número de emergencias. Están siempre arriba, en la barra roja.",
    "id": "q3"
  },
  {
    "topic": "Salud bucal",
    "prompt": "Tenés un dolor de muela muy fuerte que no te deja dormir y es de noche. ¿Qué es lo más adecuado?",
    "options": [
      {
        "text": "Esperar y pedir turno",
        "correct": false,
        "feedback": "Los turnos sirven para controles y tratamientos. Un dolor muy fuerte puede necesitar atención el mismo día."
      },
      {
        "text": "Buscar una guardia odontológica",
        "correct": true,
        "feedback": "Las guardias odontológicas atienden urgencias. En la Ciudad de Buenos Aires, las de los hospitales Carrillo y Dueñas atienden las 24 horas."
      },
      {
        "text": "Llamar al número de emergencias",
        "correct": false,
        "feedback": "Ese número es para riesgo inmediato para la vida. Para la muela, la guardia odontológica es el lugar indicado."
      }
    ],
    "learning": "Urgencia de la boca: guardia odontológica. Controles y tratamientos: turno.",
    "id": "q4"
  },
  {
    "topic": "Prevención",
    "prompt": "Verdadero o falso: si me siento bien, no necesito ningún control.",
    "options": [
      {
        "text": "Verdadero",
        "correct": false,
        "feedback": "Es una idea muy común, pero hay cosas que se pueden detectar antes de que den molestias."
      },
      {
        "text": "Falso",
        "correct": true,
        "feedback": "Muchos controles sirven justamente para prevenir o detectar a tiempo, aunque no tengas molestias."
      }
    ],
    "learning": "Sentirte bien no reemplaza los controles. Consultá cuáles te corresponden.",
    "id": "q5"
  },
  {
    "topic": "Salud bucal",
    "prompt": "¿Cuándo conviene ir al odontólogo o a la odontóloga?",
    "options": [
      {
        "text": "Solo cuando me duele",
        "correct": false,
        "feedback": "Cuando duele, muchas veces el problema ya avanzó."
      },
      {
        "text": "Nunca, si me cepillo bien",
        "correct": false,
        "feedback": "Cepillarte es fundamental, pero no reemplaza la revisión de un profesional."
      },
      {
        "text": "También para controles, aunque no me duela",
        "correct": true,
        "feedback": "Los controles ayudan a prevenir problemas y a atenderlos a tiempo."
      }
    ],
    "learning": "La salud bucal también se controla: no hace falta esperar a que duela.",
    "id": "q6"
  },
  {
    "topic": "Salud visual",
    "prompt": "Te golpeaste un ojo y te duele mucho. ¿Qué hacés?",
    "options": [
      {
        "text": "Voy a una guardia oftalmológica",
        "correct": true,
        "feedback": "Un golpe con dolor fuerte puede necesitar atención urgente. En la Ciudad de Buenos Aires, la guardia del Hospital Santa Lucía atiende las 24 horas."
      },
      {
        "text": "Espero unos días",
        "correct": false,
        "feedback": "Con un golpe y dolor fuerte conviene no esperar."
      },
      {
        "text": "Pido turno para el mes que viene",
        "correct": false,
        "feedback": "Los turnos son para controles. Un golpe con dolor intenso es mejor que lo vea una guardia."
      }
    ],
    "learning": "Urgencia en los ojos: guardia oftalmológica. Control de la vista: turno.",
    "id": "q7"
  },
  {
    "topic": "Usar AuxiliAR",
    "prompt": "En la ficha de un centro de AuxiliAR leés «Información verificada». ¿Qué significa?",
    "options": [
      {
        "text": "Que seguro hay turnos",
        "correct": false,
        "feedback": "La verificación habla de los datos, no de que haya turnos libres."
      },
      {
        "text": "Que sus datos se revisaron en fuentes oficiales",
        "correct": true,
        "feedback": "AuxiliAR muestra la fecha de revisión y la fuente oficial, y los vuelve a revisar cada tanto."
      },
      {
        "text": "Que esos datos nunca cambian",
        "correct": false,
        "feedback": "Los datos pueden cambiar: por eso se revisan y la ficha dice cuándo fue la última vez."
      }
    ],
    "learning": "Cada ficha muestra cuándo se verificó y la fuente oficial.",
    "id": "q8"
  }
]

/** Official sources at the foot of each section (by the model's section id) */
export const PH_SOURCES: Record<string, Source[]> = {
  "donde": [],
  "controles": [
    {
      "label": "Boca sana · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/bucodental/boca-sana"
    },
    {
      "label": "Cuidados bucodentales por edad · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/bucodental/por-edades"
    },
    {
      "label": "Salud ocular · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/glosario/salud-ocular"
    },
    {
      "label": "Salud visual · Salud escolar, Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/educacion/familias/salud-escolar/salud-visual"
    },
    {
      "label": "Guía de Práctica Clínica de Hipertensión Arterial 2024 · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/sites/default/files/salud-guia-practica-clinica-nacional-hta-2024.pdf"
    },
    {
      "label": "Diabetes · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/glosario/diabetes"
    },
    {
      "label": "Prevención y detección temprana del cáncer · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/cancer/prevencion"
    }
  ],
  "vacunas": [
    {
      "label": "Calendario Nacional de Vacunación · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/salud/vacunas"
    },
    {
      "label": "Calendario Nacional de Vacunación 2026 (PDF) · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/sites/default/files/2026-03-10_calendario_nacional_vacunacion_70x50_web.pdf"
    },
    {
      "label": "Lineamientos técnicos antigripal 2026 · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/sites/default/files/2018/02/lineamientos_vacuna_antigripal_-_2026.pdf"
    }
  ],
  "alimentacion": [
    {
      "label": "Guías Alimentarias para la Población Argentina · Ministerio de Salud de la Nación",
      "url": "https://www.argentina.gob.ar/node/92458"
    },
    {
      "label": "Ley 27.642 de Promoción de la Alimentación Saludable · Boletín Oficial",
      "url": "https://www.argentina.gob.ar/normativa/nacional/ley-27642-356607"
    }
  ],
  "actividad": [
    {
      "label": "Directrices de la OMS sobre actividad física y hábitos sedentarios (2020) · OPS/OMS",
      "url": "https://www.paho.org/es/noticias/26-11-2020-cada-movimiento-cuenta-para-mejorar-salud-dice-oms"
    }
  ],
  "quiz": []
}
