import type { BlockPlace, SectionView } from "@/types/blocks"

/** The content of every section, from the chosen model (diseñoCategorias/animales-1-renglones-con-resumen.html): blocks, summary and sources */
export const ANIMALS_VIEWS: Record<string, SectionView> = {
  "cuidados": {
    "key": [
      {
        "icon": "paw-print",
        "title": "En el paseo",
        "value": "Pechera",
        "label": "y la correa enganchada a ella, no al collar",
        "to": "paseo"
      },
      {
        "icon": "glass-water",
        "title": "Todos los días",
        "value": "Agua fresca",
        "label": "y comida balanceada",
        "to": "diario"
      },
      {
        "icon": "stethoscope",
        "title": "Al veterinario",
        "value": "2 veces al año",
        "label": "aunque lo veas sano",
        "to": "controles"
      },
      {
        "icon": "id-card",
        "title": "Por si se pierde",
        "value": "Chapita",
        "label": "con tus datos, o microchip",
        "to": "controles"
      }
    ],
    "blocks": [
      {
        "type": "dodont",
        "id": "paseo",
        "title": "El paseo: qué usar y qué no",
        "noIcon": true,
        "lead": "El paseo es para que tu perro haga ejercicio, socialice y disfrute. Para que no lo lastime:",
        "yes": [
          "<b>Pechera</b> (también llamada pretal o arnés), con la correa enganchada en la pechera.",
          "<b>Collar con chapita</b> con tu teléfono, solo para identificarlo: la correa no va ahí.",
          "<b>Correa</b> siempre, de un largo que le deje caminar tranquilo. Es importante que tenga distancia para oler los árboles y explorar sin que haga falta tironear: no hace falta que camine siempre a tu lado.",
          "<b>Bolsitas</b> para juntar su materia fecal y tirarla en un contenedor.",
          "<b>Agua fresca</b>, también durante el paseo."
        ],
        "no": [
          "<b>Enganchar la correa al collar</b>: cada tirón aprieta y lastima el cuello. Su cuello es tan sensible como el nuestro: ahí tiene la tráquea, por donde respira, y la columna.",
          "<b>Collares de ahorque, de púas o «de autocontrol»</b>: están hechos para apretar el cuello, y le duelen y lo lastiman.",
          "<b>Dar tirones de la correa, gritarle o pegarle</b> para corregirlo: le causa estrés y miedo, y empeora la situación.",
          "<b>Pasearlo suelto</b> en la calle."
        ]
      },
      {
        "type": "callout",
        "tone": "alert",
        "title": "¿Por qué la correa va en la pechera y no en el collar?",
        "paras": [
          "<b>En el cuello están la tráquea, por donde respira, la columna, y nervios y vasos sanguíneos importantes. Cuando el perro tira, o cuando la correa da un tirón, toda esa fuerza se concentra en una franja angosta del cuello. La pechera la reparte sobre el pecho y los hombros.</b>",
          "Es todavía más importante en cachorros, en perros chiquitos, en los que tiran mucho y en los de hocico chato, como el pug o el bulldog, que ya respiran con más dificultad.",
          "Un estudio de la Universidad de Nottingham Trent (Reino Unido), publicado en <i>Veterinary Record</i> en 2020, midió la presión de siete collares sobre un modelo de cuello: ninguno la bajó lo suficiente como para evitar el riesgo de lesión cuando el perro tira."
        ],
        "icon": "circle-alert"
      },
      {
        "type": "trainers",
        "id": "adiestrador",
        "title": "Entendete mejor con tu mascota",
        "noIcon": true,
        "lead": "<b>Aprender a entender a tu mascota fortalece el vínculo y contribuye a su bienestar.</b> Un adiestrador que trabaje <b>desde lo positivo, sin castigos ni métodos que lo lastimen</b>, puede ayudarlos a comunicarse mejor y disfrutar de una convivencia más sana y feliz.",
        "items": [
          {
            "logo": "anto",
            "name": "Anto Adiestramiento",
            "where": "antoadiestramiento.ar",
            "url": "https://antoadiestramiento.ar"
          },
          {
            "logo": "filo",
            "name": "Filosofía Animal",
            "where": "filosofiaanimal.com",
            "url": "https://filosofiaanimal.com"
          },
          {
            "logo": "patita",
            "name": "Patita Adiestramiento",
            "where": "@patita_adiestramiento",
            "url": "https://www.instagram.com/patita_adiestramiento"
          },
          {
            "logo": "dogway",
            "name": "Dog Way Club",
            "where": "@dogway.club",
            "url": "https://www.instagram.com/dogway.club"
          },
          {
            "logo": "mestiza",
            "name": "Mestiza Educación Canina",
            "where": "@mestiza.educacioncanina",
            "url": "https://www.instagram.com/mestiza.educacioncanina"
          }
        ],
        "after": "Si no podés contratar uno, en sus páginas y redes comparten mucho contenido gratis que te puede ayudar.",
        "listTitle": "Adiestradores recomendados"
      },
      {
        "type": "list",
        "id": "diario",
        "title": "Todos los días",
        "noIcon": true,
        "items": [
          "<b>Agua fresca y limpia</b>, siempre. Cambiale el agua del bebedero y lavalo todos los días: además evita que se críe el mosquito del dengue.",
          "<b>Comida balanceada</b>, acorde a su peso y a su edad. No le des las sobras de la comida de la casa.",
          "<b>Paseos, juego y tiempo con vos.</b> Los perros necesitan salir para hacer ejercicio y socializar.",
          "<b>Un lugar limpio para descansar</b>, protegido del frío y de la lluvia.",
          "<b>Si tenés gato</b>, limpiá su bandeja sanitaria todos los días y lavate bien las manos después.",
          "<b>Mirá cómo está.</b> Si no quiere comer, vomita, tiene diarrea o lo ves «raro», llevalo al veterinario."
        ]
      },
      {
        "type": "list",
        "id": "controles",
        "title": "Controles y cuidados de salud",
        "noIcon": true,
        "items": [
          "<b>Veterinario al menos dos veces al año</b>, aunque lo veas sano: lo revisa, le aplica las vacunas que necesita y te dice cómo desparasitarlo y cómo prevenir pulgas y garrapatas.",
          "<b>Vacuna antirrábica cada año</b>, desde los 3 meses de edad y durante toda su vida.",
          "<b>Desparasitarlo</b> como te indique el veterinario: también te protege a vos de algunas zoonosis.",
          "<b>Castrarlo</b>: evita camadas no buscadas, los celos y el sangrado, y ayuda a que haya menos animales perdidos, accidentes y peleas.",
          "<b>Identificarlo</b>: la mayoría de los perros y gatos que se pierden no vuelven porque no tienen collar con chapita. También se le puede poner un microchip con tus datos, por si pierde el collar."
        ],
        "button": {
          "go": "atencion",
          "label": "Dónde castrar y vacunar gratis"
        }
      },
      {
        "type": "steps",
        "id": "bienestar",
        "title": "Las cinco libertades",
        "noIcon": true,
        "lead": "Para la Organización Mundial de Sanidad Animal, el bienestar animal es «el estado físico y mental de un animal en relación con las condiciones en las que vive y muere». Las «cinco libertades» describen lo que es responsabilidad de las personas. Todo animal tiene que vivir:",
        "items": [
          "Libre de hambre, de sed y de desnutrición.",
          "Libre de temor y de angustia.",
          "Libre de molestias físicas y térmicas.",
          "Libre de dolor, de lesión y de enfermedad.",
          "Libre de manifestar un comportamiento natural."
        ],
        "note": "Los malos tratos y los actos de crueldad a los animales están penados por la Ley 14.346: cómo denunciarlos está en «Más recursos»."
      }
    ],
    "sources": [
      {
        "label": "Tenencia responsable de mascotas (revista educativa) · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/sites/default/files/revista_educativa_primaria.pdf"
      },
      {
        "label": "Problemáticas asociadas a salud y zoonosis · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/problemas-ambientales-urbanos/problematicas-asociadas-salud-y-zoonosis"
      },
      {
        "label": "Rabia · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/node/29491"
      },
      {
        "label": "Estudio: Canine collars: an investigation of collar type and the forces applied to a simulated neck model · Veterinary Record, 2020 (Nottingham Trent University)",
        "url": "https://irep.ntu.ac.uk/id/eprint/39713"
      }
    ]
  },
  "vacunas": {
    "key": [
      {
        "icon": "syringe",
        "title": "Antirrábica",
        "value": "Obligatoria",
        "label": "desde los 3 meses y cada año",
        "to": "calendario"
      },
      {
        "icon": "dog",
        "title": "Perros",
        "value": "Desde las 6 semanas",
        "label": "séxtuple en 3 dosis y refuerzo anual",
        "to": "calendario"
      },
      {
        "icon": "cat",
        "title": "Gatos",
        "value": "Desde los 2 meses",
        "label": "triple felina y refuerzo anual",
        "to": "calendario"
      },
      {
        "icon": "map-pin",
        "title": "La antirrábica",
        "value": "Gratis",
        "label": "en campañas y centros municipales",
        "section": "castracion"
      }
    ],
    "blocks": [
      {
        "type": "petvax",
        "id": "calendario",
        "title": "Vacunas de perros y gatos",
        "noIcon": true,
        "species": [
          {
            "label": "Perros",
            "icon": "dog",
            "rows": [
              {
                "group": "Cachorro"
              },
              [
                "6 semanas (45 días)",
                "Séxtuple",
                "Primera dosis. Protege contra el parvovirus, el moquillo, la hepatitis infecciosa, el adenovirus tipo 2, la parainfluenza y la leptospirosis."
              ],
              [
                "9 semanas",
                "Séxtuple",
                "Segunda dosis (refuerzo)."
              ],
              [
                "12 semanas",
                "Séxtuple",
                "Tercera dosis."
              ],
              [
                "3 meses",
                "Antirrábica",
                "<b>Obligatoria.</b> Primera dosis, después de completar las tres dosis de la séxtuple."
              ],
              [
                "3 meses",
                "Tos de las perreras",
                "Recomendada si va a guarderías, a paseos en grupo o se queda en pensionados."
              ],
              {
                "group": "Adulto: refuerzos anuales"
              },
              [
                "Cada año",
                "Séxtuple",
                "Refuerzo anual, para que no baje la protección."
              ],
              [
                "Cada año",
                "Antirrábica",
                "<b>Obligatoria.</b> Refuerzo anual durante toda su vida."
              ],
              [
                "Cada año",
                "Tos de las perreras",
                "Refuerzo anual, si tu veterinario la indicó."
              ]
            ],
            "notes": [
              "La quíntuple es la misma vacuna sin la leptospirosis: tu veterinario te dice cuál le corresponde. La Municipalidad de Rosario indica la primera dosis a los 45 días y un refuerzo a los 21 días.",
              "Solo la antirrábica es obligatoria. Las demás se recomiendan porque protegen de enfermedades frecuentes y graves."
            ]
          },
          {
            "label": "Gatos",
            "icon": "cat",
            "rows": [
              {
                "group": "Gatito"
              },
              [
                "2 meses (60 días)",
                "Triple felina",
                "Primera dosis. Protege contra la rinotraqueitis, la panleucopenia y el calicivirus felinos."
              ],
              [
                "21 días después",
                "Triple felina",
                "Segunda dosis."
              ],
              [
                "2 meses (8 a 9 semanas)",
                "Leucemia felina (FeLV)",
                "Primera dosis. Antes, el veterinario hace un test rápido de sangre: si el gato ya tiene el virus, la vacuna no sirve."
              ],
              [
                "3 a 4 semanas después",
                "Leucemia felina (FeLV)",
                "Refuerzo."
              ],
              [
                "3 meses",
                "Antirrábica",
                "<b>Obligatoria</b>, aunque no salga de casa. Primera dosis."
              ],
              {
                "group": "Adulto: refuerzos anuales"
              },
              [
                "Cada año",
                "Triple felina",
                "Refuerzo anual, para mantener la protección."
              ],
              [
                "Cada año",
                "Antirrábica",
                "<b>Obligatoria.</b> Refuerzo anual durante toda su vida."
              ],
              [
                "Cada año",
                "Leucemia felina (FeLV)",
                "El veterinario evalúa el refuerzo cada año, sobre todo si sale de casa, convive con otros gatos o va a guarderías."
              ]
            ],
            "notes": [
              "Un gato adulto que nunca se vacunó contra la leucemia felina necesita dos dosis, con 3 a 4 semanas entre una y otra.",
              "Solo la antirrábica es obligatoria. Las demás se recomiendan porque protegen de enfermedades frecuentes y graves."
            ]
          }
        ]
      },
      {
        "type": "list",
        "id": "recorda",
        "title": "Recordá",
        "noIcon": true,
        "items": [
          "Vacunalo cuando esté sano.",
          "Llevá su libreta sanitaria, para que anoten cada vacuna.",
          "Si es un gato, llevalo en una transportadora: viaja más tranquilo y no se escapa.",
          "Después de la vacuna puede estar más tranquilo o cansado: es normal.",
          "La vacuna antirrábica es obligatoria: en la Ciudad de Buenos Aires hay que aplicarla todos los años, durante toda la vida del animal.",
          "Vacunarlo también te protege a vos y a tu familia."
        ],
        "button": {
          "go": "atencion",
          "label": "Dónde vacunar contra la rabia gratis"
        }
      }
    ],
    "sources": [
      {
        "label": "Salud animal: esquema de vacunas para perros y gatos · Municipalidad de Rosario",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      },
      {
        "label": "Vacunas para perros y gatos: cuáles son obligatorias y cada cuánto aplicarlas · Omint (artículo)",
        "url": "https://www.omint.com.ar/PlanDeSalud/vacunas-perros-gatos"
      },
      {
        "label": "Problemáticas asociadas a salud y zoonosis · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/problemas-ambientales-urbanos/problematicas-asociadas-salud-y-zoonosis"
      },
      {
        "label": "Tenencia responsable de mascotas (revista educativa) · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/sites/default/files/revista_educativa_primaria.pdf"
      }
    ]
  },
  "atencion": {
    "key": [
      {
        "icon": "map",
        "title": "Dónde ir",
        "value": "En el mapa",
        "label": "Ciudad, Rosario, Córdoba, Salta y Neuquén",
        "to": "mapa"
      },
      {
        "icon": "calendar",
        "title": "Cómo pedir el turno",
        "value": "Por ciudad",
        "label": "los pasos, en pocas líneas",
        "to": "turnos"
      },
      {
        "icon": "siren",
        "title": "Urgencias",
        "value": "Llamá antes",
        "label": "no hay guardia gratuita confirmada",
        "to": "urgencias"
      },
      {
        "icon": "landmark",
        "title": "En tu ciudad",
        "value": "Municipalidad",
        "label": "o centro de zoonosis de tu zona",
        "to": "turnos"
      }
    ],
    "blocks": [
      {
        "type": "map",
        "id": "mapa",
        "title": "Castración, vacunas y consultas",
        "noIcon": true,
        "lead": "Elegí tu provincia y mirá los lugares en el mapa o en la lista. Tocá un punto para ver la dirección, el horario y cómo pedir el turno.",
        "filters": [
          [
            "all",
            "Todos"
          ],
          [
            "castracion",
            "Castración"
          ],
          [
            "vacunacion",
            "Vacuna antirrábica"
          ],
          [
            "consulta",
            "Consultas"
          ]
        ],
        "empty": {
          "title": "Todavía no tenemos lugares cargados en {prov}.",
          "text": "Consultá en tu municipalidad o en el centro de zoonosis de tu zona. También hay operativos gratuitos de castración en todo el país: mirá «Otra ciudad», más abajo."
        },
        "note": "<b>Una campaña gratuita no es atención veterinaria gratuita.</b> Que una vacunación o una castración sea gratuita no significa que la consulta, los estudios o los tratamientos también lo sean. Tampoco quiere decir que atiendan urgencias. Cada servicio dice qué incluye: leelo en su página."
      },
      {
        "type": "citytabs",
        "id": "turnos",
        "title": "Cómo pedir el turno",
        "noIcon": true,
        "cities": [
          {
            "label": "Ciudad de Buenos Aires",
            "steps": [
              "<b>Castración:</b> pedí el turno online con tu cuenta miBA (castración de perra, perro, gata o gato, «por fecha»). Las agendas de la semana siguiente se abren los viernes a las 10 h.",
              "Te llega un correo con las indicaciones. Ayuno: 12 horas sin comida y 8 horas sin líquidos.",
              "<b>Vacuna antirrábica:</b> sin turno, en los operativos de las unidades móviles o en el Instituto Pasteur (Av. Díaz Vélez 4821).",
              "<b>Consulta:</b> el Instituto Pasteur tiene un consultorio gratuito solo para zoonosis. Para otras consultas, el hospital escuela de la UBA, con arancel."
            ],
            "button": {
              "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas",
              "label": "Pedir el turno de castración y ver el cronograma actualizado"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Castración de perros y gatos · Animales BA",
                    "paras": [
                      "Gratis. La página la describe como «totalmente gratuita».",
                      "Perros y gatos, acompañados por una persona mayor de 18 años que pueda quedarse toda la mañana hasta que termine la cirugía. Antes de operar, un veterinario hace un examen clínico y solo opera si el animal está apto."
                    ],
                    "more": [
                      "<b>Dónde:</b> Centro Fijo Indoamericano: Parque Indoamericano, Villa Soldati (Av. Escalada y Paseo Islas Malvinas).",
                      "Centro Fijo Costanera Sur: Av. Dr. T. Achával Rodríguez 1550, a 100 metros frente a la fuente de Lola Mora.",
                      "Ocho unidades móviles que recorren las comunas de lunes a viernes.",
                      "<b>Cuándo:</b> Cada centro atiende ciertos días: las fechas están en el cronograma de abajo. La página no publica horarios de los centros fijos.",
                      "<b>Cómo:</b> Pedí el turno online con tu cuenta miBA: elegí castración de perra, perro, gata o gato, y después «por fecha».",
                      "Las agendas de la semana siguiente se abren los viernes a las 10 h.",
                      "Cuando se confirma, te llega un correo con las indicaciones. Sin turno previo no atienden.",
                      "Ayuno: 12 horas sin comida y 8 horas sin líquidos.",
                      "Perro con collar y correa; gato en transportadora o bolso ventilado. Llevá una manta para abrigarlo después.",
                      "Avisá al veterinario si toma medicación o tiene alguna enfermedad; podés llevar estudios previos.",
                      "<b>Contacto:</b> La página no publica teléfono: el turno se pide online.",
                      "<b>Para tener en cuenta:</b> La página no dice si piden domicilio en la Ciudad."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "button": {
                      "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas",
                      "label": "Pedir el turno de castración y ver el cronograma actualizado"
                    }
                  },
                  {
                    "title": "Vacunación antirrábica de perros y gatos · Animales BA",
                    "paras": [
                      "Gratis. La página la describe como «totalmente gratuita».",
                      "Perros y gatos. La página no pide documentación ni domicilio."
                    ],
                    "more": [
                      "<b>Dónde:</b> En los operativos de las unidades móviles: el lugar de cada uno está en el cronograma de abajo. Los centros fijos no figuran para vacunación.",
                      "<b>Cuándo:</b> Según el cronograma: en los operativos publicados es de 9 a 12.30 h (uno, de 14 a 17.30 h).",
                      "<b>Cómo:</b> Acercate al operativo sin turno previo.",
                      "Perro con collar o pretal, chapita identificatoria, correa y bozal; gato en transportadora.",
                      "<b>Contacto:</b> La página no publica teléfono."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Vacunación antirrábica de perros y gatos · Instituto Pasteur",
                    "paras": [
                      "Gratis. La página de servicios incluye el vacunatorio entre los servicios que el Instituto brinda «a la comunidad, en forma gratuita».",
                      "Perros y gatos desde los 3 meses de edad; la vacuna es anual y obligatoria."
                    ],
                    "more": [
                      "<b>Dónde:</b> Av. Díaz Vélez 4821, Ciudad de Buenos Aires.",
                      "<b>Cuándo:</b> La página de servicios dice: de 9 a 12 y de 14 a 17 h, los 365 días del año.",
                      "La página de vacunación dice: todos los días, incluidos sábados, domingos y feriados, de 8 a 18 h.",
                      "Las dos páginas oficiales no coinciden en el horario: no elegimos una. Confirmalo por teléfono antes de ir.",
                      "<b>Cómo:</b> Acercate al Instituto sin turno, por orden de llegada.",
                      "Perro con collar, correa y bozal; gato en bolso o transportadora.",
                      "<b>Contacto:</b> Conmutador 4958-9900, de lunes a viernes de 10 a 17 h.",
                      "<b>Para tener en cuenta:</b> El horario del vacunatorio es contradictorio entre dos páginas oficiales (ver «Cuándo»)."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              },
              {
                "type": "table",
                "title": "Próximos operativos",
                "head": [
                  "Día",
                  "Dónde",
                  "Qué"
                ],
                "rows": [
                  [
                    "martes, 13 de octubre",
                    "Centro Fijo Costanera Sur",
                    "Castración (con turno) · centro fijo"
                  ],
                  [
                    "martes, 13 de octubre",
                    "Barrio Castex (Flores)",
                    "Castración (con turno) · unidad móvil"
                  ],
                  [
                    "martes, 13 de octubre",
                    "Parque Onega (Villa Devoto)",
                    "Castración (con turno) · unidad móvil"
                  ],
                  [
                    "jueves, 15 de octubre",
                    "Centro Fijo Indoamericano",
                    "Castración (con turno) · centro fijo"
                  ],
                  [
                    "jueves, 15 de octubre",
                    "Centro Fijo Costanera Sur",
                    "Castración (con turno) · centro fijo"
                  ],
                  [
                    "sábado, 17 de octubre",
                    "Centro Fijo Indoamericano",
                    "Castración (con turno) · centro fijo"
                  ]
                ]
              },
              {
                "type": "cards",
                "title": "Consultas",
                "noIcon": true,
                "items": [
                  {
                    "title": "Consultorio clínico orientado a zoonosis · Instituto Pasteur",
                    "paras": [
                      "Gratis. La página de servicios lo incluye entre los servicios que el Instituto brinda «a la comunidad, en forma gratuita».",
                      "Animales con casos sospechosos de zoonosis: el consultorio es para diagnosticar, evaluar y tratar zoonosis. No es una clínica veterinaria general."
                    ],
                    "more": [
                      "<b>Dónde:</b> Av. Díaz Vélez 4821, Ciudad de Buenos Aires.",
                      "<b>Cuándo:</b> De lunes a viernes: acercate a las 8 o a las 13 h para pedir el turno del día.",
                      "<b>Cómo:</b> El turno es presencial.",
                      "<b>Contacto:</b> Conmutador 4958-9900, de lunes a viernes de 10 a 17 h.",
                      "<b>Para tener en cuenta:</b> La página no detalla qué enfermedades ni qué estudios cubre el consultorio."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "note": "No tiene guardia ni atiende urgencias."
                  },
                  {
                    "title": "Hospital de pequeños animales · UBA",
                    "paras": [
                      "Con arancel. La página dice: «Todos los servicios son arancelados».",
                      "Perros y gatos. Hay que traerlos con bozal y correa (los gatos en jaula o bolso) y con el certificado de vacunación antirrábica al día; sin esas condiciones no los atienden."
                    ],
                    "more": [
                      "<b>Cuándo:</b> Lunes a viernes de 9 a 19 h. Solo con turno, y un paciente por turno.",
                      "<b>Cómo:</b> El turno se pide online en la página de la Facultad (turnos.net01.fvet.uba.ar).",
                      "<b>Contacto:</b> Informes y consultas: admision@fvet.uba.ar",
                      "<b>Para tener en cuenta:</b> La página no da la dirección del hospital."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Urgencias · UBA",
                    "paras": [
                      "Con arancel. La atención es arancelada.",
                      "La página dice que el Hospital Escuela «no atiende urgencias sin previa coordinación»."
                    ],
                    "more": [
                      "<b>Cómo:</b> Hay que coordinar antes por el contacto de admisión."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              },
              {
                "type": "text",
                "noIcon": true,
                "paras": [
                  "La página de Animales BA (Gobierno de la Ciudad) habla de castración y vacunación antirrábica: no informa consulta clínica, guardia ni urgencias."
                ]
              }
            ]
          },
          {
            "label": "Rosario",
            "steps": [
              "<b>Castración:</b> sacá el turno en persona en uno de los cuatro puestos fijos, o por WhatsApp al 341 383-5121.",
              "El día del turno andá con tu DNI y el animal: sin comida sólida 12 horas antes y sin líquidos 6 o 7 horas antes.",
              "A los 15 días hay que llevarlo a la sede central del IMuSA, sin turno, para sacarle los puntos.",
              "<b>Vacuna antirrábica:</b> gratis y sin turno, en los puestos y en los operativos de castración barrial.",
              "<b>Consulta:</b> en el Hospital Municipal de Salud Animal (Av. Francia 1940), todos los días de 8 a 20 h, sin turno. En los puestos, atención primaria sin costo."
            ],
            "button": {
              "url": "https://whatsapp.com/channel/0029Vb0R4BcH5JLz1iwMZb2p",
              "label": "Fechas y lugares del móvil barrial: canal de la Red de Salud Animal"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Esterilización de perros y gatos · Rosario",
                    "paras": [
                      "Gratis. La página la describe como «servicio gratuito de esterilización del Imusa».",
                      "Perros y gatos, machos o hembras. Hay que presentarse con el DNI y el animal; lo lleva una persona mayor."
                    ],
                    "more": [
                      "<b>Dónde:</b> Vecinal Parque Sur: Bolonia 5350. Lunes a viernes de 7.30 a 12.30 h.",
                      "Centro de Salud Pasteur: Ayolas 270 (otra página dice «Ayolas y Ayacucho»). Lunes a viernes de 7.30 a 17 h.",
                      "Vecinal 7 de Septiembre: Ayala Gauna 7951. Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
                      "CMD Oeste: Pte. Perón 4602. Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
                      "<b>Cuándo:</b> Los turnos se gestionan en los puestos de lunes a viernes, de 10 a 12 y de 14 a 16 h (según el puesto).",
                      "<b>Cómo:</b> Sacá el turno en persona en un puesto fijo, o por WhatsApp.",
                      "El día del turno presentate con el DNI y el animal.",
                      "Perro con collar y correa, o en jaula de transporte. Bañarlo el día anterior.",
                      "Sin alimentos sólidos 12 horas antes y sin líquidos 6 o 7 horas antes.",
                      "Para retirarlo, llevá una manta. A los 15 días hay que llevarlo a la sede central del IMuSA, sin turno, para sacarle los puntos.",
                      "<b>Contacto:</b> WhatsApp 341 383-5121 (turnos y consultas).",
                      "<b>Para tener en cuenta:</b> La página no da la dirección de la sede central del IMuSA."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "button": {
                      "url": "https://whatsapp.com/channel/0029Vb0R4BcH5JLz1iwMZb2p",
                      "label": "Fechas y lugares del móvil barrial: canal de la Red de Salud Animal"
                    }
                  },
                  {
                    "title": "Vacunación antirrábica de perros y gatos · Rosario",
                    "paras": [
                      "Gratis. La página dice: «colocamos de forma gratuita la vacuna contra la rabia».",
                      "Perros y gatos desde los 3 meses de edad, con refuerzo anual."
                    ],
                    "more": [
                      "<b>Dónde:</b> En los cuatro puestos fijos (direcciones en «Esterilización») y en los operativos de castración barrial.",
                      "<b>Cuándo:</b> En los puestos, en sus horarios de atención; la vacunación del hospital municipal se cuenta en «Consultas y urgencias».",
                      "<b>Cómo:</b> Acercate sin turno previo.",
                      "<b>Contacto:</b> WhatsApp 341 383-5121.",
                      "<b>Para tener en cuenta:</b> La página del hospital municipal condiciona su atención a estar adscripto al sistema de salud pública municipal: ahí no está dicho que la vacuna sea sin costo para todas las personas."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              },
              {
                "type": "cards",
                "title": "Consultas",
                "noIcon": true,
                "items": [
                  {
                    "title": "Atención veterinaria en el Hospital Municipal de Salud Animal · Rosario",
                    "paras": [
                      "Gratis con condiciones. Sin costo para personas adscritas al sistema de salud pública municipal. Quienes no lo están pagan un bono de 10 gavets (1 gavet = $1.720 desde el 1/7/2026). Se paga con código QR, tarjeta de crédito o débito.",
                      "Perros y gatos. Atención veterinaria completa: curaciones, vacunación antirrábica, desparasitación, cirugías y medicación."
                    ],
                    "more": [
                      "<b>Dónde:</b> Francia 1940, Rosario.",
                      "<b>Cuándo:</b> Todos los días de 8 a 20 h; feriados de 8 a 14 h.",
                      "Vacunación antirrábica y desparasitación: de lunes a viernes de 8 a 17 h, excepto feriados.",
                      "<b>Cómo:</b> Sin turno previo, por orden de llegada, priorizando urgencias y casos graves.",
                      "<b>Contacto:</b> WhatsApp 341 383-5121.",
                      "<b>Para tener en cuenta:</b> La página no dice que sea una guardia las 24 horas: es la atención del horario publicado."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Atención primaria en los puestos barriales · Rosario",
                    "paras": [
                      "Gratis. La página rotula la atención de los puestos como «Sin costo».",
                      "Perros y gatos. Atención veterinaria primaria, vacunación antirrábica y desparasitación."
                    ],
                    "more": [
                      "<b>Dónde:</b> Los mismos cuatro puestos: Vecinal Parque Sur, Centro de Salud Pasteur, Vecinal 7 de Septiembre y CMD Oeste.",
                      "<b>Cuándo:</b> Lunes a viernes, en el horario de cada puesto (arriba).",
                      "<b>Cómo:</b> Sin turno previo.",
                      "<b>Contacto:</b> WhatsApp 341 383-5121."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              }
            ]
          },
          {
            "label": "Córdoba",
            "steps": [
              "Pedí el turno por WhatsApp al 351 860-6269: el turnero abre todos los jueves hábiles desde las 8.",
              "Después te contactan para confirmar el turno y validar tus datos.",
              "Si tu mascota está preñada, tiene prioridad y la atienden sin turno."
            ],
            "button": {
              "url": "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/",
              "label": "Ver la página de la Municipalidad"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Castración de perros y gatos · Córdoba",
                    "paras": [
                      "Gratis. La página dice que las castraciones son «gratuitas para los vecinos de la ciudad de Córdoba».",
                      "Vecinos de la ciudad de Córdoba. Perros y gatos, domésticos o en situación de calle. La Municipalidad también ofrece turnos especiales para perros «potencialmente peligrosos»."
                    ],
                    "more": [
                      "<b>Dónde:</b> Centro de Alberdi: Francisco Muñiz 60.",
                      "Centro de La France: Concepción del Bermejo 3129.",
                      "Centro de Villa Allende Parque: Maloca 8321.",
                      "La página dice que pronto se inaugurará un cuarto centro.",
                      "<b>Cómo:</b> Pedí el turno por mensaje de WhatsApp. El turnero abre todos los jueves hábiles desde las 8.",
                      "Después te contactan para confirmar el turno y validar tus datos.",
                      "Las mascotas preñadas tienen prioridad y se atienden sin turno, en los horarios designados de cada centro.",
                      "<b>Contacto:</b> WhatsApp 351 860-6269 (turnos).",
                      "<b>Para tener en cuenta:</b> La propia página reconoce quejas por la obtención de turnos: hay mucha demanda y pocos turnos.",
                      "<b>Para tener en cuenta:</b> No publica los horarios de los centros ni los requisitos para castrar.",
                      "<b>Para tener en cuenta:</b> Otras notas del municipio de 2025 publican otro canal de turno: confirmá cuál es el vigente.",
                      "<b>Para tener en cuenta:</b> La página no habla de vacunación ni de consulta clínica."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              }
            ]
          },
          {
            "label": "Salta",
            "steps": [
              "<b>Móvil Quirúrgico:</b> castra gratis en los barrios. El cronograma y el WhatsApp para el turno se publican cada semana en las redes del municipio.",
              "Ayuno de 12 horas, sin comida ni agua. Bañalo dos días antes y llevá una manta.",
              "En el hospital municipal y en los CIC también castran y vacunan, pero la página no dice si tiene costo: preguntalo.",
              "<b>Consulta:</b> gratis en el hospital municipal y en el Centro de Adopciones «Nicolás Mancilla», para mayores de 18 con domicilio en la ciudad."
            ],
            "button": {
              "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/",
              "label": "Cronograma semanal del móvil y ubicación de cada centro: página oficial"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Castración en el Móvil Quirúrgico · Salta",
                    "paras": [
                      "Gratis. La página dice que el Móvil Quirúrgico «recorre la ciudad realizando castraciones gratuitas».",
                      "Perros y gatos desde los 6 meses, clínicamente sanos. Las hembras no deben estar en celo ni en lactancia."
                    ],
                    "more": [
                      "<b>Dónde:</b> Barrios de la ciudad, en los Centros Integradores Comunitarios (CIC): el cronograma se publica cada semana en las redes del municipio.",
                      "<b>Cómo:</b> En cada publicación del cronograma figura el WhatsApp para pedir el turno.",
                      "Ayuno de 12 horas, sin comida ni agua. Bañar al animal dos días antes. Llevar una manta.",
                      "Perros con collar o pechera; gatos en jaula, canil o mochila transportadora.",
                      "Las razas braquicéfalas (pug, bulldog, bóxer, pekinés, shih tzu, Boston terrier, pomerania, entre otras) se operan de forma programada, con turno previo.",
                      "<b>Para tener en cuenta:</b> El cronograma está en las redes sociales del municipio, no en la página: AuxiliAR no lo tiene."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "button": {
                      "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/",
                      "label": "Cronograma semanal del móvil y ubicación de cada centro: página oficial"
                    }
                  },
                  {
                    "title": "Castración en el Hospital Municipal de Salud Animal y en el Centro de Adopciones · Salta",
                    "paras": [
                      "Costo no confirmado. La página titula «Atención veterinaria gratuita» a la atención clínica del hospital y del Centro de Adopciones, pero no dice expresamente si la castración lo es.",
                      "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Dónde:</b> Hospital Municipal de Salud Animal. La página no da su dirección.",
                      "Centro de Adopciones «Nicolás Mancilla»: cirugías los lunes, jueves y viernes a las 8 h, con turno solo presencial.",
                      "<b>Cuándo:</b> Hospital: las cirugías se hacen de lunes a viernes, por la mañana y por la tarde.",
                      "<b>Cómo:</b> En el hospital, los turnos se entregan los viernes o el último día hábil, en persona o por WhatsApp.",
                      "<b>Contacto:</b> Hospital: 387 566-8872 (teléfono y WhatsApp).",
                      "<b>Para tener en cuenta:</b> En un lugar la página dice que las razas braquicéfalas NO se operan en el hospital y en otro que se operan de forma programada con turno previo: consultá antes.",
                      "<b>Para tener en cuenta:</b> La página no da la dirección del hospital: tiene un enlace de ubicación."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Castración en los cinco CIC · Salta",
                    "paras": [
                      "Costo no confirmado. La página no dice si la castración en los CIC es gratuita.",
                      "Mayores de 18 años con DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Dónde:</b> CIC Constitución, CIC Solidaridad, CIC Unión, CIC Asunción y CIC Limache. La página no da sus direcciones: tiene un enlace de ubicación para cada uno.",
                      "<b>Cuándo:</b> CIC Constitución: de lunes a viernes de 11 a 12 h. Turnos presenciales los viernes desde las 8.",
                      "CIC Solidaridad: lunes a miércoles de 8 a 11.30 h; jueves y viernes, 13 h. Turnos presenciales los viernes desde las 8.30.",
                      "CIC Unión: de lunes a viernes de 7 a 13 h. Turnos presenciales los viernes desde las 7.",
                      "CIC Asunción: turnos presenciales los viernes de 14 a 20 h.",
                      "CIC Limache: de lunes a viernes de 7 a 11 h. Turnos presenciales los viernes desde las 8.",
                      "<b>Cómo:</b> Sacá el turno en persona, los viernes, en el CIC.",
                      "<b>Contacto:</b> CIC Constitución 387 226-6146 · CIC Solidaridad 387 226-6210 · CIC Unión 387 226-6246 · CIC Asunción 387 226-6133 · CIC Limache 387 226-6199."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Vacunación antirrábica de perros y gatos · Salta",
                    "paras": [
                      "Costo no confirmado. La página dice que los CIC ofrecen «atención veterinaria y vacunación antirrábica», pero no dice si tienen costo.",
                      "Mayores de 18 años con DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Dónde:</b> Los cinco CIC (direcciones en «Castración en los cinco CIC»). El Móvil también lleva vacunación antirrábica y desparasitación a distintos barrios.",
                      "<b>Cuándo:</b> CIC Constitución: lunes a viernes de 10 a 12.15 h.",
                      "CIC Solidaridad: lunes a miércoles de 11 a 13 h, por orden de llegada; jueves y viernes, turnos a las 13 h y atención a las 14 h.",
                      "CIC Unión: lunes a viernes de 8 a 12 h.",
                      "CIC Asunción: lunes a viernes de 13 a 19 h; martes, miércoles y viernes también de 7 a 13 h.",
                      "CIC Limache: lunes a viernes de 11 a 12 h.",
                      "<b>Cómo:</b> Acercate al CIC en el horario indicado.",
                      "<b>Contacto:</b> Los teléfonos de cada CIC están en «Castración en los cinco CIC».",
                      "<b>Para tener en cuenta:</b> En CIC Unión la página pide además un «certificado de carente de recursos»: no explica para qué prestación."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              },
              {
                "type": "cards",
                "title": "Consultas",
                "noIcon": true,
                "items": [
                  {
                    "title": "Atención veterinaria en el Hospital Municipal de Salud Animal · Salta",
                    "paras": [
                      "Gratis. La página titula la atención del hospital como «Atención veterinaria gratuita». Para los controles posteriores pide un «certificado de carente de recursos».",
                      "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Dónde:</b> Hospital Municipal de Salud Animal. La página no da su dirección: tiene un enlace de ubicación.",
                      "<b>Cuándo:</b> Lunes a viernes de 7 a 18 h. Sábados y feriados de 8 a 12 h.",
                      "<b>Cómo:</b> La página no explica cómo pedir la consulta: confirmalo por teléfono.",
                      "<b>Contacto:</b> 387 566-8872 (teléfono y WhatsApp).",
                      "<b>Para tener en cuenta:</b> La página no dice si hace falta turno para la consulta."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Atención veterinaria en el Centro de Adopciones «Nicolás Mancilla» · Salta",
                    "paras": [
                      "Gratis. La página lo titula «Atención veterinaria gratuita».",
                      "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta. Controles posteriores: certificado de carente de recursos."
                    ],
                    "more": [
                      "<b>Dónde:</b> Centro de Adopciones «Nicolás Mancilla»: la página no da su dirección.",
                      "<b>Cuándo:</b> De lunes a viernes de 8 a 18 h.",
                      "<b>Cómo:</b> La página no explica cómo pedir la consulta: confirmalo antes de ir."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "Atención veterinaria en los cinco CIC · Salta",
                    "paras": [
                      "Costo no confirmado. La página dice que los CIC ofrecen «atención veterinaria y vacunación antirrábica», pero no dice si tienen costo.",
                      "Mayores de 18 años con DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Dónde:</b> CIC Constitución, Solidaridad, Unión, Asunción y Limache. La página no da sus direcciones.",
                      "<b>Cuándo:</b> Los horarios de cada CIC son los de «Vacunación antirrábica» (en «Vacunación y castración»).",
                      "<b>Cómo:</b> Acercate al CIC en el horario indicado.",
                      "<b>Contacto:</b> CIC Constitución 387 226-6146 · CIC Solidaridad 387 226-6210 · CIC Unión 387 226-6246 · CIC Asunción 387 226-6133 · CIC Limache 387 226-6199.",
                      "<b>Para tener en cuenta:</b> En CIC Unión la página pide además un «certificado de carente de recursos»: no explica para qué prestación."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  },
                  {
                    "title": "«Guardia y urgencias» del Hospital Municipal · Salta",
                    "paras": [
                      "Costo no confirmado. La página no dice si este apartado tiene un costo distinto de la atención del hospital.",
                      "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta."
                    ],
                    "more": [
                      "<b>Cómo:</b> La página dice que «se prioriza controles y urgencias» y que no se realizan internaciones ni métodos complementarios. Si tu mascota tiene una urgencia, informalo al llegar.",
                      "<b>Para tener en cuenta:</b> El apartado no tiene horario propio: no es una guardia confirmada. Llamá al hospital (387 566-8872) antes de ir."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              }
            ]
          },
          {
            "label": "Neuquén",
            "steps": [
              "Entrá a Muni Express con tu usuario y elegí «Pre-turno Bienestar Animal» → «Castración». Los preturnos se abren los viernes a las 9 h.",
              "Después te llaman para darte el día y el horario.",
              "<b>Perros de 3 a 5 kg (gratis):</b> pedí el turno los miércoles de 9 a 13 h, al 299 592-8056 o al 299 576-4402."
            ],
            "button": {
              "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/",
              "label": "Pedir el preturno de castración (Muni Express)"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Esterilización de perros y gatos · Neuquén",
                    "paras": [
                      "Gratis con condiciones. La página dice «Castración gratuita para perros/as de 3 a 5 kg». Para los demás casos el apartado «Costo del trámite» está vacío: AuxiliAR no sabe si tienen costo.",
                      "Mayores de 18 años con residencia en la ciudad. Perros y gatos, machos y hembras; los perros, desde los seis meses. No hace falta que hayan tenido crías."
                    ],
                    "more": [
                      "<b>Dónde:</b> Quirófano fijo Parque Industrial: Domingo Savio 3215 (299 592-8056).",
                      "Quirófano fijo: Novella y Godoy (299 596-2039).",
                      "Quirófano fijo: Dr. Ramón y Catriel (299 406-3969).",
                      "Quirófano fijo: Ricchieri 667 (299 576-4402).",
                      "Quirófanos móviles, en los barrios que correspondan.",
                      "<b>Cuándo:</b> Preturnos online: los viernes a las 9 h.",
                      "Móviles: los turnos se dan los lunes a las 9 h, en persona, en los barrios.",
                      "Perros de 3 a 5 kg (gratuito): se pide turno los miércoles, llamando de 9 a 13 h al 299 592-8056 o al 299 576-4402, solo para el quirófano de Parque Industrial.",
                      "<b>Cómo:</b> Entrá a Muni Express (neuquencapital.gov.ar) con usuario y contraseña; si no tenés, registrate.",
                      "Elegí «Pre-turno Bienestar Animal», después «Castración» y el lugar de castración.",
                      "Completá los datos del animal y confirmá. Después, personal de Bienestar Animal te llama para asignarte día y horario: un preturno no es una cirugía confirmada.",
                      "Completar la planilla de autorización de cirugía. Ir con correa, collar y una manta.",
                      "<b>Contacto:</b> Municipalidad: 299 449-1200, de lunes a viernes de 8 a 15 h.",
                      "<b>Para tener en cuenta:</b> La página no dice si el servicio es gratuito para animales de más de 5 kg ni para gatos."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "button": {
                      "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/",
                      "label": "Pedir el preturno de castración (Muni Express)"
                    }
                  }
                ]
              }
            ]
          },
          {
            "label": "Otra ciudad",
            "steps": [
              "Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial: consultá en tu municipalidad o en el centro de zoonosis de tu zona. Preguntá qué incluye, quién puede usarlo y cómo se pide.",
              "La forma de acceder puede variar según el lugar. Algunos servicios requieren turno, registro o domicilio en el municipio.",
              "<b>Operativos de todo el país:</b> el Ministerio de Salud de la Nación hace castraciones gratuitas con los municipios. Comunicate con el referente de tu municipio para saber dónde y cuándo.",
              "Pedí que te indiquen la página oficial donde figura, y leela antes de ir."
            ],
            "button": {
              "url": "https://www.argentina.gob.ar/salud/protenencia/castraciones",
              "label": "Ver la página de Protenencia"
            },
            "more": [
              {
                "type": "cards",
                "items": [
                  {
                    "title": "Castraciones gratuitas en operativos · todo el país",
                    "paras": [
                      "Gratis. La página se titula «Castraciones gratuitas».",
                      "Personas mayores de edad con DNI, con animales de compañía desde los 6 meses. Máximo dos animales por persona (para castrar más hay que ir con otra persona que ayude). La atención es prioritaria para los gatos."
                    ],
                    "more": [
                      "<b>Dónde:</b> En el lugar de cada operativo. La página no informa localidades.",
                      "<b>Cuándo:</b> Hay que presentarse en el horario indicado y esperar hasta que te entreguen al animal después de la cirugía.",
                      "<b>Cómo:</b> Comunicate con el referente de tu municipio para confirmar el lugar de la actividad.",
                      "Los turnos se dan por orden de llegada al operativo, uno por animal. Si llamás o te acercás a un punto de encuentro solo te dan un compromiso de asistencia: no te guardan el turno.",
                      "Vas a firmar un consentimiento para la cirugía; por eso necesitás ser mayor de edad y llevar el DNI.",
                      "Un veterinario hace un examen clínico básico para decidir si el animal puede operarse. Llevá una manta. Durante el operativo no se hace atención clínica veterinaria.",
                      "<b>Para tener en cuenta:</b> La página no informa fechas ni localidades, ni si hay operativos en este momento."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo",
                    "button": {
                      "url": "https://www.argentina.gob.ar/salud/protenencia/castraciones",
                      "label": "Ver la página de Protenencia"
                    }
                  }
                ]
              },
              {
                "type": "cards",
                "title": "Consultas",
                "noIcon": true,
                "items": [
                  {
                    "title": "Atención clínica primaria de perros y gatos · UNLP (La Plata)",
                    "paras": [
                      "Con arancel. La página dice: «Los servicios son arancelados».",
                      "Perros y gatos que concurren a la consulta primaria o que derivan veterinarios de la actividad privada, con la ficha de derivación completa."
                    ],
                    "more": [
                      "<b>Cómo:</b> Pedí el turno a la Secretaría del Hospital Escuela.",
                      "<b>Contacto:</b> Secretaría del Hospital Escuela: 221 599-0158.",
                      "<b>Para tener en cuenta:</b> La página no da dirección ni horarios, y su fecha es de 2024."
                    ],
                    "moreLabel": "Dónde, cuándo y cómo pedirlo"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "callout",
        "id": "urgencias",
        "tone": "soft",
        "title": "Si es una urgencia",
        "paras": [
          "<b>No confirmamos ninguna guardia ni atención de urgencia gratuita para animales. Llamá antes de ir.</b>",
          "En Rosario, el Hospital Municipal de Salud Animal prioriza las urgencias en su horario, de 8 a 20 h. En Salta, el hospital municipal «prioriza controles y urgencias», sin horario de guardia propio. El hospital escuela de la UBA atiende urgencias solo con coordinación previa, y con arancel.",
          "El Instituto Pasteur no tiene guardia: «No existe guardia de atención médica ni urgencias». Sí recibe las denuncias por mordeduras para la observación antirrábica."
        ]
      },
      {
        "type": "list",
        "id": "limites",
        "title": "Lo que todavía no podemos decirte",
        "noIcon": true,
        "items": [
          "No prometemos guardias, turnos ni cupos: dependen de cada servicio.",
          "No listamos clínicas veterinarias pagas."
        ],
        "note": "Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular."
      }
    ],
    "sources": [
      {
        "label": "Gobierno de la Ciudad · Animales BA · Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas"
      },
      {
        "label": "Servicios · Instituto de Zoonosis Luis Pasteur",
        "url": "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios"
      },
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA) · Rosario (Santa Fe)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      },
      {
        "label": "Municipalidad de Córdoba · Control de reproducción de animales de compañía · Ciudad de Córdoba",
        "url": "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/"
      },
      {
        "label": "Municipalidad de Salta · Bienestar animal · Ciudad de Salta",
        "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/"
      },
      {
        "label": "Municipalidad de Neuquén · Bienestar animal · Ciudad de Neuquén",
        "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/"
      },
      {
        "label": "Ministerio de Salud de la Nación · Protenencia · Operativos de municipios de todo el país",
        "url": "https://www.argentina.gob.ar/salud/protenencia/castraciones"
      },
      {
        "label": "Zoonosis · Senasa, argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/senasa/programas-sanitarios/zoonosis"
      },
      {
        "label": "Hospital Escuela · Facultad de Ciencias Veterinarias, UBA · Ciudad de Buenos Aires",
        "url": "https://www.fvet.uba.ar/hospital/"
      },
      {
        "label": "Atención clínica primaria de pequeños animales · Facultad de Ciencias Veterinarias, UNLP · La Plata (Buenos Aires)",
        "url": "https://www.fcv.unlp.edu.ar/index.php/hospital/servicio-de-atencion-clinica-primaria-de-pequenos-animales/"
      }
    ]
  },
  "mordeduras": {
    "key": [
      {
        "icon": "siren",
        "title": "Si te mordió o arañó",
        "value": "Agua y jabón",
        "label": "y al centro de salud más cercano",
        "to": "mordida"
      },
      {
        "icon": "calendar",
        "title": "El animal que mordió",
        "value": "10 días",
        "label": "de observación veterinaria",
        "to": "observacion"
      },
      {
        "icon": "info",
        "title": "Un murciélago en casa",
        "value": "No lo toques",
        "label": "y avisá al Instituto Pasteur",
        "to": "murcielago"
      },
      {
        "icon": "check",
        "title": "Zoonosis",
        "value": "Lavarte las manos",
        "label": "después de tocar un animal",
        "to": "zoonosis"
      }
    ],
    "blocks": [
      {
        "type": "callout",
        "id": "mordida",
        "tone": "alert",
        "title": "Si un animal te mordió o te arañó",
        "list": [
          "Lavá la herida con abundante agua y jabón.",
          "No pongas alcohol ni otro desinfectante.",
          "Andá rápido al centro de salud más cercano: un profesional evalúa si hace falta una profilaxis antibiótica, antitetánica o antirrábica, según cómo fue el accidente.",
          "Llevá tu carnet de vacunas: es lo que permite saber si te falta alguna dosis."
        ],
        "button": {
          "emergency": true,
          "label": "Ver números de emergencia"
        }
      },
      {
        "type": "list",
        "id": "observacion",
        "title": "Después: avisá para la observación antirrábica",
        "noIcon": true,
        "lead": "En la Ciudad de Buenos Aires, según el Instituto Pasteur:",
        "items": [
          "Notificá la mordedura en el Instituto de Zoonosis Luis Pasteur, para que el animal que mordió cumpla con la observación antirrábica. Si lastimó a una persona, la denuncia es obligatoria.",
          "Todo animal que mordió tiene que ser observado durante 10 días por un veterinario, aunque tenga la vacuna antirrábica al día.",
          "Pedí los datos de quien está a cargo del animal (nombre y apellido, teléfono y domicilio): hacen falta para la observación.",
          "A la persona lastimada la derivan al Servicio de Profilaxis Antirrábica del Hospital Durand, para evaluar si necesita tratamiento.",
          "Instituto Pasteur: Av. Díaz Vélez 4821. Conmutador 4958-9900, de lunes a viernes de 10 a 17 h."
        ],
        "note": "Si vivís en otro lugar, consultá en el centro de zoonosis de tu localidad."
      },
      {
        "type": "text",
        "id": "tetanos",
        "title": "Vacuna antitetánica",
        "noIcon": true,
        "paras": [
          "Qué vacuna corresponde en cada caso lo define el profesional que te atienda.",
          "La vacuna doble bacteriana protege contra el tétanos y la difteria: esquema de 3 dosis y refuerzo cada 10 años, según el Calendario Nacional."
        ],
        "button": {
          "url": "/primeros-auxilios/vacuna-antitetanica",
          "label": "Ver la guía de la vacuna antitetánica"
        }
      },
      {
        "type": "steps",
        "id": "murcielago",
        "title": "Si encontrás un murciélago en tu casa",
        "noIcon": true,
        "lead": "En la Ciudad la rabia está controlada pero no erradicada: el virus se mantiene en los murciélagos. Son nocturnos y evitan a las personas, pero cuando están enfermos pueden aparecer de día.",
        "items": [
          "No lo toques, y evitá que tus animales tengan contacto con él.",
          "Tapalo con un recipiente rígido y deslizá un cartón por debajo, como tapa, protegiéndote las manos.",
          "Comunicate con el Instituto de Zoonosis Luis Pasteur o llevaselo: es importante para hacer el diagnóstico de rabia.",
          "Si tu perro o gato tuvo contacto con el murciélago, llevalo en ayunas al Instituto Pasteur lo antes posible, de lunes a viernes por la mañana, con sus certificados de vacunación."
        ]
      },
      {
        "type": "list",
        "id": "prevenir",
        "title": "Para prevenir mordeduras",
        "noIcon": true,
        "lead": "Una mordedura puede transmitir infecciones como la rabia, la pasteurelosis o el tétanos. El Gobierno de la Ciudad recomienda:",
        "items": [
          "No dejar a los chicos pequeños solos con un animal, sin un adulto que mire.",
          "No dejar a los animales sueltos.",
          "Evitar los entrenamientos para guarda y defensa.",
          "Vacunar a perros y gatos contra la rabia.",
          "En la Ciudad de Buenos Aires, la Ley 5471 obliga a usar correa o pretal y bozal en la vía pública.",
          "Evitar el contacto con animales silvestres."
        ]
      },
      {
        "type": "picture",
        "bare": true,
        "title": "Cuidarlos también es cuidarte",
        "text": "Vacunar a tus animales, desparasitarlos y llevarlos a control ayuda a prevenir enfermedades que pueden pasar a las personas."
      },
      {
        "type": "text",
        "id": "que-son",
        "title": "¿Qué es una zoonosis?",
        "noIcon": true,
        "paras": [
          "Es una enfermedad de los animales que puede pasar a las personas: por contacto directo con el animal enfermo, por fluidos como la orina o la saliva, por mosquitos u otros insectos, o al comer alimentos de origen animal sin control sanitario o frutas y verduras crudas mal lavadas.",
          "Las pueden causar parásitos, virus o bacterias.",
          "En la Ciudad de Buenos Aires, entre las zoonosis urbanas más importantes están la rabia, la leptospirosis, la brucelosis y la psitacosis. Además de los controles veterinarios, ayuda mantener limpio el ambiente y, para la psitacosis, los lugares bien ventilados."
        ]
      },
      {
        "type": "cards",
        "id": "zoonosis",
        "title": "Tres zoonosis y cómo prevenirlas",
        "noIcon": true,
        "items": [
          {
            "title": "Leptospirosis",
            "paras": [
              "La causa una bacteria que puede estar en la orina de roedores, perros, vacas, cerdos, caballos y animales silvestres. Se contagia por contacto con esa orina o con agua y lugares contaminados: el riesgo sube con las inundaciones y al nadar, pescar o acampar en ríos y lagunas.",
              "Empieza como un cuadro gripal. Si hiciste algo de riesgo y tenés fiebre, dolor de cabeza o dolores musculares, consultá a un médico enseguida.",
              "<b>Para prevenirla:</b>"
            ],
            "list": [
              "No meterte en aguas estancadas, y que los chicos no jueguen en charcos o barro.",
              "Combatir los roedores en la casa y alrededor.",
              "Usar guantes y botas de goma para limpiar baldíos o desmalezar.",
              "Mantener patios y terrenos sin basura ni escombros.",
              "En zonas donde es frecuente, vacunar a los perros."
            ],
            "button": {
              "url": "https://www.argentina.gob.ar/salud/glosario/leptospirosis",
              "label": "Ver en el Ministerio de Salud"
            }
          },
          {
            "title": "Hidatidosis",
            "paras": [
              "La causa un parásito que el perro elimina en su materia fecal. Las personas, sobre todo los chicos, se contagian cuando los huevos llegan a la boca: al dejarse lamer por el perro o comer verduras o tomar agua contaminadas.",
              "<b>Para prevenirla:</b>"
            ],
            "list": [
              "No darles achuras crudas a los perros.",
              "Desparasitarlos cada 45 días.",
              "Lavar frutas y verduras con agua potable, a chorro fuerte.",
              "Evitar que el perro lama a los chicos en la boca.",
              "Lavarte las manos después de tocar un perro y antes de comer.",
              "Cercar las huertas para que no entren los perros."
            ],
            "button": {
              "url": "https://www.argentina.gob.ar/salud/glosario/hidatidosis",
              "label": "Ver en el Ministerio de Salud"
            }
          },
          {
            "title": "Toxoplasmosis",
            "paras": [
              "La causa un parásito que los gatos eliminan en su materia fecal. Se contagia al comer carne mal cocida, o agua o verduras contaminadas con heces de gato y mal lavadas. <b>No se transmite por tocar a un gato.</b>",
              "Es muy importante prevenirla en el embarazo y en personas inmunocomprometidas.",
              "<b>Para prevenirla:</b>"
            ],
            "list": [
              "Juntar las heces del gato todos los días (recién transmiten el parásito 48 a 72 horas después) y lavarte bien las manos.",
              "Limpiar la bandeja sanitaria todos los días.",
              "Cocinar bien la carne y lavar bien las verduras.",
              "Extremar estos cuidados en el embarazo."
            ],
            "button": {
              "url": "https://www.argentina.gob.ar/salud/glosario/toxoplasmosis",
              "label": "Ver en el Ministerio de Salud"
            }
          }
        ]
      },
      {
        "type": "list",
        "id": "calle",
        "title": "La materia fecal en la calle",
        "noIcon": true,
        "lead": "Según el Gobierno de la Ciudad, la materia fecal de los animales puede tener huevos de parásitos. Aunque no se vean, quedan en el ambiente:",
        "items": [
          "Se dispersan con el pisoteo, la lluvia, el viento, los insectos y los roedores.",
          "Te podés contagiar con alimentos contaminados, con las manos sin lavar o al tocar calzado, juguetes u objetos que estuvieron en contacto con los excrementos.",
          "Los chicos son los más expuestos, porque están más en contacto con la tierra.",
          "Algunas larvas entran por la piel y pueden dar picazón o ardor en ese lugar."
        ]
      },
      {
        "type": "text",
        "id": "quien",
        "title": "¿Quién se ocupa?",
        "noIcon": true,
        "paras": [
          "Senasa trabaja en las zoonosis de los animales de producción, como la rabia paresiante, el carbunclo o la triquinosis.",
          "Las de los animales de compañía, como perros y gatos, se manejan a nivel municipal o provincial: consultá en el centro de zoonosis de tu localidad o en el Ministerio de Salud de la Nación. En la Ciudad de Buenos Aires es el Instituto de Zoonosis Luis Pasteur."
        ],
        "note": "Información general de organismos oficiales. No reemplaza la consulta con un veterinario."
      }
    ],
    "sources": [
      {
        "label": "Rabia · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/node/29491"
      },
      {
        "label": "Información útil · Instituto de Zoonosis Luis Pasteur",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/instituto-de-zoonosis-luis-pasteur/informacion-util"
      },
      {
        "label": "Servicios · Instituto de Zoonosis Luis Pasteur",
        "url": "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios"
      },
      {
        "label": "Problemáticas asociadas a salud y zoonosis · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/problemas-ambientales-urbanos/problematicas-asociadas-salud-y-zoonosis"
      },
      {
        "label": "Enfermedades zoonóticas · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/glosario/enfermedadeszoonoticas"
      },
      {
        "label": "Leptospirosis · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/glosario/leptospirosis"
      },
      {
        "label": "Hidatidosis · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/glosario/hidatidosis"
      },
      {
        "label": "Toxoplasmosis · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/glosario/toxoplasmosis"
      },
      {
        "label": "Zoonosis · Senasa, argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/senasa/programas-sanitarios/zoonosis"
      }
    ]
  },
  "recursos": {
    "key": [
      {
        "icon": "heart",
        "title": "Si murió tu perro o gato",
        "value": "Cremación sin costo",
        "label": "en el Instituto Pasteur (Ciudad)",
        "to": "cremacion"
      },
      {
        "icon": "phone",
        "title": "Maltrato animal",
        "value": "0800-333-47225",
        "label": "Ministerio Público Fiscal de la Ciudad",
        "to": "maltrato"
      },
      {
        "icon": "scale",
        "title": "Ley 14.346",
        "value": "Está penado",
        "label": "el maltrato y la crueldad",
        "to": "maltrato"
      }
    ],
    "blocks": [
      {
        "type": "group",
        "id": "cremacion",
        "title": "Si muere tu perro o tu gato",
        "noIcon": true,
        "lead": "Perder a un perro o a un gato es difícil. Acá te contamos qué dice el Gobierno de la Ciudad sobre qué hacer, y qué servicio existe en la Ciudad de Buenos Aires.",
        "blocks": [
          {
            "type": "list",
            "title": "Primero: ¿mordió a alguien?",
            "items": [
              "Desde el punto de vista sanitario, solo existe riesgo si el animal mordió a una persona dentro de los 10 días previos a su fallecimiento. Es el período en el que el virus de la rabia, si estuviera presente, puede encontrarse en la saliva.",
              "Si mordió dentro de ese lapso, el animal debe ser derivado al Instituto de Zoonosis Luis Pasteur para hacer el estudio y descartar rabia.",
              "Si no mordió, o si la mordedura ocurrió más de 10 días antes del fallecimiento, no existe riesgo sanitario."
            ]
          },
          {
            "type": "list",
            "title": "Un servicio en la Ciudad de Buenos Aires",
            "lead": "El Instituto de Zoonosis Luis Pasteur recibe perros y gatos fallecidos todos los días, las 24 horas, <b>sin costo</b>, para su disposición final o cremación, y evalúa cada caso según criterios sanitarios. Su página de servicios lo incluye entre los servicios que brinda a la comunidad en forma gratuita.",
            "items": [
              "<b>Quién:</b> quien lo solicita tiene que ser mayor de edad e ir con DNI.",
              "<b>Dónde:</b> Av. Díaz Vélez 4821, Ciudad de Buenos Aires.",
              "<b>Antes de ir:</b> el conmutador del Instituto es 4958-9900, de lunes a viernes de 10 a 17 h."
            ]
          },
          {
            "type": "list",
            "title": "Lo que la página oficial no dice",
            "items": [
              "Habla de «disposición final o cremación». <b>No informa</b> si la cremación es individual ni si se entregan las cenizas: no lo damos por hecho. Si es importante para vos, preguntalo al llamar al Instituto.",
              "Es un servicio de la Ciudad de Buenos Aires. Si vivís en otro lugar, consultá en tu municipalidad o en el centro de zoonosis de tu zona qué servicio existe y cuánto cuesta.",
              "El Instituto no tiene guardia de atención médica ni urgencias. No hacemos recomendaciones de servicios privados."
            ]
          }
        ]
      },
      {
        "type": "text",
        "id": "maltrato",
        "title": "Maltrato animal",
        "noIcon": true,
        "paras": [
          "Los malos tratos y los actos de crueldad a los animales están penados por la <b>Ley 14.346</b>.",
          "En la Ciudad de Buenos Aires se pueden denunciar ante el Ministerio Público Fiscal: por teléfono al <b>0800-333-47225</b> o en <a href=\"http://www.fiscalias.gob.ar/maltrato-animal/\" target=\"_blank\" rel=\"noopener noreferrer\">fiscalias.gob.ar/maltrato-animal</a>."
        ],
        "button": {
          "tel": "080033347225",
          "label": "Llamar al 0800-333-47225"
        }
      }
    ],
    "sources": [
      {
        "label": "Información útil · Instituto de Zoonosis Luis Pasteur",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/instituto-de-zoonosis-luis-pasteur/informacion-util"
      },
      {
        "label": "Servicios · Instituto de Zoonosis Luis Pasteur",
        "url": "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios"
      },
      {
        "label": "Problemáticas asociadas a salud y zoonosis · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/problemas-ambientales-urbanos/problematicas-asociadas-salud-y-zoonosis"
      }
    ]
  }
}

/** The ids of the sections in the model → in the app, for the buttons and summary cells that open another section */
export const ANIMALS_SECTION_IDS: Record<string, string> = {
  "cuidados": "section-1",
  "vacunas": "section-2",
  "atencion": "section-3",
  "mordeduras": "section-4",
  "recursos": "section-5"
}

/** The places of the map, as the model lists them */
export const ANIMALS_PLACES: BlockPlace[] = [
  {
    "id": "caba-indoamericano",
    "name": "Centro Fijo Indoamericano",
    "kind": "Castración · Animales BA",
    "province": "caba",
    "zone": "Villa Soldati",
    "address": "Parque Indoamericano: Av. Escalada y Paseo Islas Malvinas",
    "lat": -34.6632531,
    "lng": -58.465365,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración de perros y gatos, con turno online (cuenta miBA).",
      "Las agendas de la semana siguiente se abren los viernes a las 10 h.",
      "Ayuno: 12 horas sin comida y 8 horas sin líquidos."
    ],
    "phones": [],
    "source": [
      {
        "label": "Gobierno de la Ciudad · Animales BA",
        "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas"
      }
    ],
    "note": "La página no publica teléfono: el turno se pide online.",
    "consulta": false
  },
  {
    "id": "caba-costanera",
    "name": "Centro Fijo Costanera Sur",
    "kind": "Castración · Animales BA",
    "province": "caba",
    "zone": "Puerto Madero",
    "address": "Av. Dr. T. Achával Rodríguez 1550, frente a la fuente de Lola Mora",
    "lat": -34.6169319,
    "lng": -58.3567506,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración de perros y gatos, con turno online (cuenta miBA).",
      "Las agendas de la semana siguiente se abren los viernes a las 10 h.",
      "Ayuno: 12 horas sin comida y 8 horas sin líquidos."
    ],
    "phones": [],
    "source": [
      {
        "label": "Gobierno de la Ciudad · Animales BA",
        "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas"
      }
    ],
    "note": "La página no publica teléfono: el turno se pide online.",
    "consulta": false
  },
  {
    "id": "caba-pasteur",
    "name": "Instituto de Zoonosis Luis Pasteur",
    "kind": "Vacuna antirrábica y consultorio de zoonosis",
    "province": "caba",
    "zone": "Caballito",
    "address": "Av. Díaz Vélez 4821",
    "lat": -34.6080855,
    "lng": -58.4350642,
    "free": true,
    "castracion": false,
    "vacunacion": true,
    "facts": [
      "Vacuna antirrábica gratis, sin turno, por orden de llegada.",
      "Perros y gatos desde los 3 meses.",
      "Las páginas oficiales dan dos horarios distintos: confirmalo por teléfono.",
      "Consultorio gratuito solo para zoonosis (no es una clínica general): turno del día, de lunes a viernes a las 8 o a las 13 h.",
      "No tiene guardia ni atiende urgencias."
    ],
    "phones": [
      [
        "Conmutador",
        "4958-9900"
      ]
    ],
    "source": [
      {
        "label": "Instituto de Zoonosis Luis Pasteur · Gobierno de la Ciudad",
        "url": "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios"
      }
    ],
    "consulta": true
  },
  {
    "id": "ros-parque-sur",
    "name": "Vecinal Parque Sur",
    "kind": "Castración, vacuna antirrábica y atención primaria",
    "province": "santa-fe",
    "zone": "Rosario",
    "address": "Bolonia 5350",
    "lat": -33.0000091,
    "lng": -60.6687917,
    "free": true,
    "castracion": true,
    "vacunacion": true,
    "facts": [
      "Castración gratis: sacá el turno en el puesto o por WhatsApp.",
      "Vacuna antirrábica gratis, sin turno.",
      "Lunes a viernes de 7.30 a 12.30 h.",
      "Atención veterinaria primaria sin costo, sin turno."
    ],
    "phones": [
      [
        "WhatsApp",
        "341 383-5121"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      }
    ],
    "consulta": true
  },
  {
    "id": "ros-pasteur",
    "name": "Centro de Salud Pasteur",
    "kind": "Castración, vacuna antirrábica y atención primaria",
    "province": "santa-fe",
    "zone": "Rosario",
    "address": "Ayolas 270",
    "lat": -32.9786459,
    "lng": -60.6341124,
    "free": true,
    "castracion": true,
    "vacunacion": true,
    "facts": [
      "Castración gratis: sacá el turno en el puesto o por WhatsApp.",
      "Vacuna antirrábica gratis, sin turno.",
      "Lunes a viernes de 7.30 a 17 h.",
      "Atención veterinaria primaria sin costo, sin turno."
    ],
    "phones": [
      [
        "WhatsApp",
        "341 383-5121"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      }
    ],
    "consulta": true
  },
  {
    "id": "ros-7-sept",
    "name": "Vecinal 7 de Septiembre",
    "kind": "Castración, vacuna antirrábica y atención primaria",
    "province": "santa-fe",
    "zone": "Rosario",
    "address": "Ayala Gauna 7951",
    "lat": -32.9125798,
    "lng": -60.736465,
    "free": true,
    "castracion": true,
    "vacunacion": true,
    "facts": [
      "Castración gratis: sacá el turno en el puesto o por WhatsApp.",
      "Vacuna antirrábica gratis, sin turno.",
      "Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
      "Atención veterinaria primaria sin costo, sin turno."
    ],
    "phones": [
      [
        "WhatsApp",
        "341 383-5121"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      }
    ],
    "consulta": true
  },
  {
    "id": "ros-cmd-oeste",
    "name": "CMD Oeste",
    "kind": "Castración, vacuna antirrábica y atención primaria",
    "province": "santa-fe",
    "zone": "Rosario",
    "address": "Pte. Perón 4602",
    "lat": -32.9577472,
    "lng": -60.6911298,
    "free": true,
    "castracion": true,
    "vacunacion": true,
    "facts": [
      "Castración gratis: sacá el turno en el puesto o por WhatsApp.",
      "Vacuna antirrábica gratis, sin turno.",
      "Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
      "Atención veterinaria primaria sin costo, sin turno."
    ],
    "phones": [
      [
        "WhatsApp",
        "341 383-5121"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      }
    ],
    "consulta": true
  },
  {
    "id": "cba-alberdi",
    "name": "Centro de castración de Alberdi",
    "kind": "Castración",
    "province": "cordoba",
    "zone": "Córdoba (capital)",
    "address": "Francisco Muñiz 60, Alberdi",
    "lat": -31.4073992,
    "lng": -64.2097763,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración gratis para vecinos de la ciudad de Córdoba.",
      "Turno por WhatsApp: el turnero abre los jueves hábiles desde las 8.",
      "Si está preñada, tiene prioridad y la atienden sin turno."
    ],
    "phones": [
      [
        "WhatsApp turnos",
        "351 860-6269"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba · Control de reproducción de animales de compañía",
        "url": "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/"
      }
    ],
    "consulta": false
  },
  {
    "id": "cba-la-france",
    "name": "Centro de castración de La France",
    "kind": "Castración",
    "province": "cordoba",
    "zone": "Córdoba (capital)",
    "address": "Concepción del Bermejo 3129, La France",
    "lat": -31.3747871,
    "lng": -64.2113917,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración gratis para vecinos de la ciudad de Córdoba.",
      "Turno por WhatsApp: el turnero abre los jueves hábiles desde las 8.",
      "Si está preñada, tiene prioridad y la atienden sin turno."
    ],
    "phones": [
      [
        "WhatsApp turnos",
        "351 860-6269"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba · Control de reproducción de animales de compañía",
        "url": "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/"
      }
    ],
    "consulta": false
  },
  {
    "id": "cba-villa-allende",
    "name": "Centro de castración de Villa Allende Parque",
    "kind": "Castración",
    "province": "cordoba",
    "zone": "Córdoba (capital)",
    "address": "Maloca 8321, Villa Allende Parque",
    "lat": -31.311086,
    "lng": -64.2798255,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración gratis para vecinos de la ciudad de Córdoba.",
      "Turno por WhatsApp: el turnero abre los jueves hábiles desde las 8.",
      "Si está preñada, tiene prioridad y la atienden sin turno."
    ],
    "phones": [
      [
        "WhatsApp turnos",
        "351 860-6269"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba · Control de reproducción de animales de compañía",
        "url": "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/"
      }
    ],
    "consulta": false
  },
  {
    "id": "nqn-parque-industrial",
    "name": "Quirófano fijo Parque Industrial",
    "kind": "Castración",
    "province": "neuquen",
    "zone": "Neuquén (capital)",
    "address": "Domingo Savio 3215",
    "lat": -38.9013777,
    "lng": -68.0802401,
    "free": false,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Gratis para perros de 3 a 5 kg; para los demás casos, consultá el costo.",
      "Preturno online los viernes a las 9 h, en Muni Express.",
      "Perros de 3 a 5 kg (gratis): turno los miércoles de 9 a 13 h, llamando a este quirófano."
    ],
    "phones": [
      [
        "Quirófano",
        "299 592-8056"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Neuquén · Bienestar animal",
        "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/"
      }
    ],
    "consulta": false
  },
  {
    "id": "nqn-novella",
    "name": "Quirófano fijo Novella y Godoy",
    "kind": "Castración",
    "province": "neuquen",
    "zone": "Neuquén (capital)",
    "address": "Novella y Godoy",
    "lat": null,
    "lng": null,
    "free": false,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Gratis para perros de 3 a 5 kg; para los demás casos, consultá el costo.",
      "Preturno online los viernes a las 9 h, en Muni Express."
    ],
    "phones": [
      [
        "Quirófano",
        "299 596-2039"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Neuquén · Bienestar animal",
        "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/"
      }
    ],
    "consulta": false
  },
  {
    "id": "nqn-ramon",
    "name": "Quirófano fijo Dr. Ramón y Catriel",
    "kind": "Castración",
    "province": "neuquen",
    "zone": "Neuquén (capital)",
    "address": "Dr. Ramón y Catriel",
    "lat": null,
    "lng": null,
    "free": false,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Gratis para perros de 3 a 5 kg; para los demás casos, consultá el costo.",
      "Preturno online los viernes a las 9 h, en Muni Express."
    ],
    "phones": [
      [
        "Quirófano",
        "299 406-3969"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Neuquén · Bienestar animal",
        "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/"
      }
    ],
    "consulta": false
  },
  {
    "id": "nqn-ricchieri",
    "name": "Quirófano fijo Ricchieri",
    "kind": "Castración",
    "province": "neuquen",
    "zone": "Neuquén (capital)",
    "address": "Ricchieri 667",
    "lat": null,
    "lng": null,
    "free": false,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Gratis para perros de 3 a 5 kg; para los demás casos, consultá el costo.",
      "Preturno online los viernes a las 9 h, en Muni Express.",
      "Perros de 3 a 5 kg (gratis): turno los miércoles de 9 a 13 h, llamando a este quirófano."
    ],
    "phones": [
      [
        "Quirófano",
        "299 576-4402"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Neuquén · Bienestar animal",
        "url": "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/"
      }
    ],
    "consulta": false
  },
  {
    "id": "salta-movil",
    "name": "Móvil Quirúrgico",
    "kind": "Castración · Municipalidad de Salta",
    "province": "salta",
    "zone": "Salta (capital)",
    "address": "Recorre los CIC de la ciudad: el cronograma se publica cada semana en las redes del municipio",
    "lat": null,
    "lng": null,
    "free": true,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Castración gratis de perros y gatos desde los 6 meses, sanos.",
      "En cada cronograma figura el WhatsApp para pedir el turno.",
      "Ayuno de 12 horas, sin comida ni agua. Bañalo dos días antes."
    ],
    "phones": [],
    "source": [
      {
        "label": "Municipalidad de Salta · Bienestar animal",
        "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/"
      }
    ],
    "consulta": false
  },
  {
    "id": "salta-cic",
    "name": "Los cinco CIC (Constitución, Solidaridad, Unión, Asunción y Limache)",
    "kind": "Castración, vacuna antirrábica y consultas",
    "province": "salta",
    "zone": "Salta (capital)",
    "address": "La página no da sus direcciones: tiene un enlace de ubicación para cada uno",
    "lat": null,
    "lng": null,
    "free": false,
    "castracion": true,
    "vacunacion": true,
    "facts": [
      "Castración con turno presencial los viernes en cada CIC.",
      "Vacuna antirrábica en el horario de cada CIC.",
      "La página no dice si tienen costo.",
      "También dan atención veterinaria. En CIC Unión piden un certificado de carente de recursos."
    ],
    "phones": [
      [
        "CIC Constitución",
        "387 226-6146"
      ],
      [
        "CIC Solidaridad",
        "387 226-6210"
      ],
      [
        "CIC Unión",
        "387 226-6246"
      ],
      [
        "CIC Asunción",
        "387 226-6133"
      ],
      [
        "CIC Limache",
        "387 226-6199"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Salta · Bienestar animal",
        "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/"
      }
    ],
    "consulta": true
  },
  {
    "id": "salta-hospital",
    "name": "Hospital Municipal de Salud Animal",
    "kind": "Castración y consultas",
    "province": "salta",
    "zone": "Salta (capital)",
    "address": "La página no da su dirección: tiene un enlace de ubicación",
    "lat": null,
    "lng": null,
    "free": false,
    "castracion": true,
    "vacunacion": false,
    "facts": [
      "Cirugías de lunes a viernes, por la mañana y por la tarde.",
      "Turnos los viernes o el último día hábil, en persona o por WhatsApp.",
      "La página no dice si la castración es gratuita.",
      "Consulta gratis (la página la titula «Atención veterinaria gratuita»): lunes a viernes de 7 a 18 h; sábados y feriados de 8 a 12 h.",
      "Para mayores de 18 años con DNI con domicilio en la ciudad de Salta. Controles posteriores: certificado de carente de recursos.",
      "«Guardia y urgencias»: prioriza controles y urgencias, pero no tiene horario propio. Llamá antes de ir."
    ],
    "phones": [
      [
        "Teléfono y WhatsApp",
        "387 566-8872"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Salta · Bienestar animal",
        "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/"
      }
    ],
    "consulta": true
  },
  {
    "id": "ros-hospital",
    "name": "Hospital Municipal de Salud Animal (IMuSA)",
    "kind": "Consultas y vacuna antirrábica",
    "province": "santa-fe",
    "zone": "Rosario",
    "address": "Av. Francia 1940",
    "lat": -32.9550171,
    "lng": -60.669563,
    "free": false,
    "freeCond": true,
    "castracion": false,
    "vacunacion": true,
    "consulta": true,
    "facts": [
      "Perros y gatos: curaciones, vacuna antirrábica, desparasitación, cirugías y medicación.",
      "Todos los días de 8 a 20 h; feriados de 8 a 14 h. Sin turno, por orden de llegada, priorizando urgencias.",
      "Sin costo si estás adscripto al sistema de salud municipal. Si no, bono de 10 gavets (1 gavet = $1.720 desde el 1/7/2026)."
    ],
    "phones": [
      [
        "WhatsApp",
        "341 383-5121"
      ]
    ],
    "source": [
      {
        "label": "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
        "url": "https://www.rosario.gob.ar/inicio/salud-animal"
      }
    ],
    "note": "La página no dice que sea una guardia las 24 horas."
  },
  {
    "id": "salta-adopciones",
    "name": "Centro de Adopciones «Nicolás Mancilla»",
    "kind": "Consultas",
    "province": "salta",
    "zone": "Salta (capital)",
    "address": "La página no da su dirección",
    "lat": null,
    "lng": null,
    "free": true,
    "castracion": false,
    "vacunacion": false,
    "consulta": true,
    "facts": [
      "Atención veterinaria gratuita, de lunes a viernes de 8 a 18 h.",
      "Para mayores de 18 años con DNI con domicilio en la ciudad de Salta. Controles posteriores: certificado de carente de recursos.",
      "La página no explica cómo pedir la consulta: confirmalo antes de ir."
    ],
    "phones": [],
    "source": [
      {
        "label": "Municipalidad de Salta · Bienestar animal",
        "url": "https://municipalidadsalta.gob.ar/bienestar-animal-7/"
      }
    ]
  },
  {
    "id": "caba-uba",
    "name": "Hospital Escuela de Pequeños Animales · UBA",
    "kind": "Consultas · Hospital escuela",
    "province": "caba",
    "zone": null,
    "address": "La página no da la dirección del hospital",
    "lat": null,
    "lng": null,
    "free": false,
    "paid": true,
    "castracion": false,
    "vacunacion": false,
    "consulta": true,
    "facts": [
      "«Todos los servicios son arancelados».",
      "Lunes a viernes de 9 a 19 h, solo con turno online (turnos.net01.fvet.uba.ar). Consultas: admision@fvet.uba.ar",
      "Llevalo con bozal y correa (los gatos, en jaula o bolso) y con la antirrábica al día: sin eso no lo atienden.",
      "Urgencias: solo con coordinación previa."
    ],
    "phones": [],
    "source": [
      {
        "label": "Hospital Escuela · Facultad de Ciencias Veterinarias, UBA",
        "url": "https://www.fvet.uba.ar/hospital/"
      }
    ]
  },
  {
    "id": "unlp",
    "name": "Hospital Escuela de Veterinaria · UNLP",
    "kind": "Consultas · Hospital escuela",
    "province": "buenos-aires",
    "zone": "La Plata",
    "address": "La página no da la dirección",
    "lat": null,
    "lng": null,
    "free": false,
    "paid": true,
    "castracion": false,
    "vacunacion": false,
    "consulta": true,
    "facts": [
      "«Los servicios son arancelados».",
      "Atención clínica primaria de perros y gatos, o derivados por un veterinario privado con la ficha de derivación.",
      "El turno se pide a la Secretaría del Hospital Escuela."
    ],
    "phones": [
      [
        "Secretaría",
        "221 599-0158"
      ]
    ],
    "source": [
      {
        "label": "Atención clínica primaria · Facultad de Ciencias Veterinarias, UNLP",
        "url": "https://www.fcv.unlp.edu.ar/index.php/hospital/servicio-de-atencion-clinica-primaria-de-pequenos-animales/"
      }
    ],
    "note": "La página no da horarios y es de 2024."
  }
]

/** Every province, in the order of the map's selector */
export const ANIMALS_PROVINCES: [string, string][] = [["caba", "Ciudad de Buenos Aires"], ["buenos-aires", "Buenos Aires"], ["catamarca", "Catamarca"], ["chaco", "Chaco"], ["chubut", "Chubut"], ["cordoba", "Córdoba"], ["corrientes", "Corrientes"], ["entre-rios", "Entre Ríos"], ["formosa", "Formosa"], ["jujuy", "Jujuy"], ["la-pampa", "La Pampa"], ["la-rioja", "La Rioja"], ["mendoza", "Mendoza"], ["misiones", "Misiones"], ["neuquen", "Neuquén"], ["rio-negro", "Río Negro"], ["salta", "Salta"], ["san-juan", "San Juan"], ["san-luis", "San Luis"], ["santa-cruz", "Santa Cruz"], ["santa-fe", "Santa Fe"], ["santiago-del-estero", "Santiago del Estero"], ["tierra-del-fuego", "Tierra del Fuego"], ["tucuman", "Tucumán"]]
