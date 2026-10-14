import type { BlockPlace, SectionView } from "@/types/blocks"

/** The content of every section, from the chosen model (diseñoCategorias/esi-1-renglones-con-resumen.html): blocks, summary and sources */
export const SEX_EDUCATION_VIEWS: Record<string, SectionView> = {
  "que-es": {
    "key": [
      {
        "icon": "scale",
        "title": "Es un derecho",
        "value": "Ley 26.150",
        "label": "de todas las personas que estudian",
        "to": "que-es"
      },
      {
        "icon": "layout-grid",
        "title": "Se organiza en",
        "value": "5 ejes",
        "label": "del Programa Nacional de ESI",
        "to": "ejes"
      },
      {
        "icon": "graduation-cap",
        "title": "Públicas y privadas",
        "value": "En todas las escuelas",
        "label": "del nivel inicial al superior",
        "to": "quien"
      },
      {
        "icon": "calendar",
        "title": "Obligatoria",
        "value": "Todo el año",
        "label": "con acciones en cada escuela",
        "to": "quien"
      }
    ],
    "blocks": [
      {
        "type": "banner",
        "bare": true,
        "icon": "heart-handshake",
        "title": "Es mucho más que biología",
        "text": "Habla de tu cuerpo, pero también de lo que sentís, de cómo te vinculás con otras personas y de tus derechos."
      },
      {
        "type": "aspects",
        "id": "que-es",
        "title": "¿Qué es?",
        "icon": "book-open",
        "tone": "t1",
        "lead": "Según la Ley 26.150, la educación sexual integral es la que <strong>«articula aspectos biológicos, psicológicos, sociales, afectivos y éticos»</strong>:",
        "items": [
          [
            "heart-pulse",
            "Biológicos"
          ],
          [
            "brain",
            "Psicológicos"
          ],
          [
            "users",
            "Sociales"
          ],
          [
            "heart",
            "Afectivos"
          ],
          [
            "scale",
            "Éticos"
          ]
        ]
      },
      {
        "type": "axes",
        "id": "ejes",
        "title": "Los 5 ejes de la ESI",
        "tone": "t5",
        "lead": "El Programa Nacional de ESI organiza lo que se trabaja en las escuelas en cinco ejes:",
        "items": [
          [
            "heart-pulse",
            "Cuidar el cuerpo y la salud"
          ],
          [
            "heart",
            "Valorar la afectividad"
          ],
          [
            "equal",
            "Garantizar la equidad de género"
          ],
          [
            "rainbow",
            "Respetar la diversidad"
          ],
          [
            "scale",
            "Ejercer nuestros derechos"
          ]
        ],
        "noIcon": true
      },
      {
        "type": "text",
        "id": "quien",
        "title": "¿Para quién es?",
        "icon": "graduation-cap",
        "tone": "t2",
        "paras": [
          "<strong>Todas las personas que estudian tienen derecho a recibirla</strong>, en escuelas públicas y privadas de todo el país: tanto en el nivel inicial (jardín) como en el nivel primario, el secundario y el nivel superior (formación docente y educación técnica no universitaria)."
        ],
        "note": "Las escuelas tienen que dar ESI de forma obligatoria, con acciones a lo largo de todo el ciclo lectivo (Ley 26.150, art. 5)."
      },
      {
        "type": "checks",
        "id": "objetivos",
        "title": "Qué busca, según la ley",
        "tone": "t4",
        "items": [
          "Incluirla en la formación de las personas, de forma armónica, equilibrada y permanente.",
          "Transmitir conocimientos pertinentes, precisos, confiables y actualizados.",
          "Promover actitudes responsables ante la sexualidad.",
          "Prevenir problemas de salud, en general y de salud sexual y reproductiva en particular.",
          "Procurar igualdad de trato y oportunidades para varones y mujeres."
        ],
        "noIcon": true
      }
    ],
    "sources": [
      {
        "label": "Ley 26.150, Programa Nacional de Educación Sexual Integral · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-26150-121222/texto"
      },
      {
        "label": "Nuevo material de la ESI para referentes escolares del Nivel Primario (los cinco ejes) · argentina.gob.ar, 18/8/2021",
        "url": "https://www.argentina.gob.ar/noticias/nuevo-material-de-la-esi-para-referentes-escolares-del-nivel-primario"
      }
    ]
  },
  "consultar": {
    "key": [
      {
        "icon": "phone",
        "title": "Línea nacional",
        "value": "0800-222-3444",
        "label": "llamada 0800, confidencial",
        "to": "linea"
      },
      {
        "icon": "map-pin",
        "title": "En la Ciudad",
        "value": "48 centros",
        "label": "con consejería o métodos, en el mapa",
        "to": "mapa"
      },
      {
        "icon": "map",
        "title": "Otras provincias",
        "value": "3 provincias",
        "label": "Buenos Aires, Santa Fe y Tucumán",
        "to": "provincias"
      },
      {
        "icon": "heart-handshake",
        "title": "Gratis, en la Ciudad",
        "value": "Fundación Huésped",
        "label": "testeo y consejería",
        "to": "huesped"
      }
    ],
    "blocks": [
      {
        "type": "phone",
        "id": "linea",
        "title": "Línea nacional de salud sexual",
        "icon": "phone",
        "tone": "t1",
        "lead": "Un equipo del Ministerio de Salud de la Nación responde dudas sobre salud sexual y reproductiva, para todo el país.",
        "number": "0800-222-3444",
        "dial": "08002223444",
        "name": "Línea 0800 de Salud Sexual",
        "text": "Contiene, orienta y asesora sobre salud sexual y reproductiva, también sobre la interrupción del embarazo. También por correo: saludsexual@msal.gov.ar.",
        "hours": "Lun a vie 9 a 20 h · sáb, dom y feriados 10 a 18 h",
        "where": "Todo el país",
        "cost": "Confidencial",
        "note": "No es una línea de emergencia: ante un riesgo inmediato, usá los números de la barra de emergencias."
      },
      {
        "type": "map",
        "id": "mapa",
        "title": "Centros de salud en la Ciudad",
        "icon": "map-pin",
        "tone": "t2",
        "lead": "Centros de salud y hospitales de la Ciudad con consejería en salud sexual, métodos anticonceptivos o preservativos. Algunos piden turno: consultá antes de ir.",
        "filters": [
          [
            "all",
            "Todos"
          ],
          [
            "consejeria",
            "Consejería"
          ],
          [
            "metodos",
            "Anticonceptivos"
          ],
          [
            "preservativos",
            "Preservativos"
          ]
        ],
        "empty": {
          "title": "Todavía no tenemos centros cargados en {prov}.",
          "text": "Podés consultar en el centro de salud u hospital público de tu zona o llamar a la línea nacional (0800-222-3444)."
        }
      },
      {
        "type": "rows",
        "id": "provincias",
        "title": "En otras provincias",
        "icon": "map",
        "tone": "t3",
        "lead": "Lo que ofrece cada provincia en sus servicios públicos.",
        "items": [
          {
            "title": "Provincia de Buenos Aires",
            "text": "Información sobre aborto y métodos anticonceptivos, gratuita y confidencial, en centros de salud y hospitales públicos. El Ministerio tiene un mapa para buscar el más cercano.",
            "meta": [
              [
                "phone",
                "Línea 148, opción 3 (lunes a viernes, 9 a 17 h)"
              ]
            ],
            "url": "https://www.ms.gba.gov.ar/sitios/aborto/"
          },
          {
            "title": "Santa Fe",
            "text": "Interrupción voluntaria y legal del embarazo (IVE e ILE) y métodos anticonceptivos gratuitos en efectores públicos, obras sociales y prepagas. Los efectores están en un mapa de la provincia.",
            "meta": [
              [
                "phone",
                "Línea nacional 0800-222-3444"
              ]
            ],
            "url": "https://www.santafe.gob.ar/index.php/web/content/view/full/139666/"
          },
          {
            "title": "Tucumán",
            "text": "Métodos anticonceptivos gratuitos (preservativos, pastillas, inyectables, implantes y DIU, el dispositivo intrauterino), test de embarazo y asesoramiento en los Centros de Atención Primaria (CAPS).",
            "meta": [
              [
                "phone",
                "381 361-6554 (mejor por WhatsApp)"
              ]
            ]
          }
        ]
      },
      {
        "type": "callout",
        "id": "huesped",
        "tone": "soft",
        "title": "Fundación Huésped (organización civil)",
        "icon": "heart-handshake",
        "paras": [
          "Testeo rápido de VIH (virus de inmunodeficiencia humana) y sífilis (resultado en unos 20 minutos), consejería en salud sexual, asesoramiento legal y apoyo psicológico. Todos sus servicios son gratuitos.",
          "Su buscador «Dónde» muestra, cerca tuyo, dónde conseguir preservativos, anticonceptivos, vacunatorios, testeo de VIH e ITS (infecciones de transmisión sexual) e interrupción del embarazo."
        ],
        "list": [
          "Av. Forest 345, Ciudad de Buenos Aires",
          "WhatsApp 11-6468-1673",
          "Línea gratuita 0-800-222-HUESPED (4837)",
          "Teléfono (5411) 2120-9999"
        ],
        "button": {
          "url": "https://donde.huesped.org.ar/",
          "label": "Abrir el buscador «Dónde»"
        }
      }
    ],
    "sources": [
      {
        "label": "Línea nacional de salud sexual · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/saludsexual/lineasaludsexual"
      },
      {
        "label": "Consejerías en salud sexual · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/consejerias-en-salud-sexual"
      },
      {
        "label": "Salud sexual y reproductiva, con mapa de establecimientos",
        "url": "https://www.ms.gba.gov.ar/sitios/aborto/"
      },
      {
        "label": "Interrupción Voluntaria del Embarazo (Ley 27.610), con mapa de efectores",
        "url": "https://www.santafe.gob.ar/index.php/web/content/view/full/139666/"
      },
      {
        "label": "Métodos anticonceptivos y asesoramiento en la provincia",
        "url": "https://msptucuman.gov.ar/el-sistema-de-salud-ofrece-metodos-anticonceptivos-y-asesoramiento-gratuito-en-toda-la-provincia/"
      },
      {
        "label": "Testeo de VIH y sífilis y consejería en Fundación Huésped (CABA)",
        "url": "https://new.huesped.org.ar/servicios"
      },
      {
        "label": "Dónde: buscador de servicios de salud sexual y reproductiva y vacunatorios",
        "url": "https://donde.huesped.org.ar/"
      }
    ]
  },
  "metodos": {
    "key": [
      {
        "icon": "hand-heart",
        "title": "En el sistema público",
        "value": "Métodos gratis",
        "label": "y cubiertos por obras sociales y prepagas",
        "to": "gratis"
      },
      {
        "icon": "list",
        "title": "Métodos",
        "value": "8 métodos",
        "label": "qué es y cómo se usa cada uno",
        "to": "cada"
      },
      {
        "icon": "clock",
        "title": "Anticoncepción de emergencia",
        "value": "Pastilla del día después",
        "label": "hasta 5 días después, mejor en las primeras 12 horas, sin receta",
        "to": "ahe"
      },
      {
        "icon": "shield-check",
        "title": "Doble protección",
        "value": "+ preservativo",
        "label": "ningún otro método protege de ITS",
        "to": "cada"
      }
    ],
    "blocks": [
      {
        "type": "text",
        "id": "gratis",
        "title": "Son gratis",
        "icon": "hand-heart",
        "tone": "t1",
        "paras": [
          "En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que «la atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas».",
          "En todo el país, la Ley 25.673 los incluye en la cobertura médica obligatoria: se retiran en centros de salud y hospitales o se piden a la obra social o prepaga."
        ]
      },
      {
        "type": "steps",
        "title": "Cómo conseguirlos",
        "icon": "footprints",
        "tone": "t2",
        "items": [
          "Consultá en un centro de salud u hospital público. En la Ciudad de Buenos Aires hay consejerías en salud sexual (hay una lista oficial) donde podés pedir asesoramiento y el método que elijas.",
          "Si tenés obra social o prepaga, pedile el método a ella: tiene que cubrirlo (Ley 25.673).",
          "<strong>Si necesitás anticoncepción de emergencia (la «pastilla del día después»), buscala lo antes posible: en un hospital, un centro de salud, una guardia o una farmacia (sin receta).</strong>",
          "Si tenés dudas, llamá a la línea nacional de salud sexual (0800-222-3444).",
          "Antes de ir, preguntá por turnos: dependen de cada centro."
        ]
      },
      {
        "type": "faq",
        "id": "cada",
        "title": "Cómo funciona cada método",
        "icon": "list",
        "tone": "t3",
        "lead": "Ningún método de esta lista, salvo el preservativo, protege del VIH (virus de inmunodeficiencia humana) ni de otras infecciones de transmisión sexual: por eso se recomienda la doble protección con preservativo.",
        "items": [
          {
            "q": "Pastillas combinadas",
            "a": [
              "Contienen dos hormonas similares a las producidas por el cuerpo de las mujeres (estrógeno y progesterona). En general vienen en cajas de 21 pastillas: se toman 21 días seguidos, se descansa 7 días y luego se empieza otra caja. <strong>También hay cajas de 28 pastillas: se toman todos los días hasta terminar la caja y, sin pausa, se empieza una nueva.</strong>",
              "<strong>No se recomiendan en algunas situaciones de salud, que evalúa un profesional.</strong>"
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/pastillas-combinadas"
          },
          {
            "q": "Pastillas de una sola hormona («minipíldora»)",
            "a": [
              "Cambian el moco del cuello del útero y también impiden la ovulación. <strong>Se recomiendan a quienes estén amamantando o a quienes, por razones de salud, no puedan recibir estrógenos.</strong>",
              "<strong>Se toman todos los días hasta terminar la caja y se comienza con otra al día siguiente.</strong> En general no se presenta el sangrado todos los meses."
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/pastillas-una-hormona"
          },
          {
            "q": "Anticonceptivos inyectables",
            "a": [
              "Tienen hormonas que evitan la ovulación. <strong>Algunos se colocan una vez al mes y otros cada tres meses.</strong> El efecto es el mismo que con las pastillas, pero no hay que tomarlas todos los días.",
              "<strong>La inyección mensual debe aplicarse siempre en la misma fecha (por ejemplo, todos los días 4 de cada mes).</strong> La trimestral, cada 3 meses, siempre el mismo día. Es importante recordar la fecha de colocación."
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/anticonceptivos-inyectables"
          },
          {
            "q": "Implante subdérmico («chip»)",
            "a": [
              "<strong>Es lo que se conoce como «chip»: una o más varillas pequeñas, finas y flexibles que se colocan en el brazo, debajo de la piel, con anestesia local.</strong> Liberan una hormona (progestágeno) en forma continua que inhibe la ovulación.",
              "<strong>Brinda protección entre 3 y 5 años, según indique el prospecto del dispositivo, y puede retirarse cuando se desee.</strong> Conviene anotar la fecha de colocación y cuándo debe retirarse. La mayoría de las mujeres pueden usarlo, incluso quienes no pueden tomar estrógenos y quienes están amamantando."
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/metodos-anticonceptivos/implante-subdermico"
          },
          {
            "q": "Dispositivo intrauterino (DIU)",
            "a": [
              "<strong>DIU de cobre: es un pequeño objeto de plástico recubierto de un hilo de cobre que se coloca dentro del útero y que impide la fecundación.</strong> Es efectivo durante cinco o diez años, según el modelo, y puede retirarse en cualquier momento. Todos los modelos deben ser colocados por un profesional de la salud.",
              "<strong>DIU con levonorgestrel: protege de 3 a 5 años, según el modelo.</strong> Su principal mecanismo de acción es la alteración del moco cervical.",
              "<strong>Según el Ministerio, el papanicolaou y las ecografías no son requisito para colocarlo, y no se necesita el consentimiento de la pareja ni de nadie más.</strong> Es fundamental hacer controles periódicos y recordar la fecha de colocación y de retiro."
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/diu"
          },
          {
            "q": "Ligadura tubaria",
            "a": [
              "Es un método anticonceptivo permanente. Profesionales médicos lo realizan con una cirugía en las trompas uterinas, que evita que el espermatozoide se junte con el óvulo. <strong>Después se sigue ovulando y menstruando como siempre, y el placer sexual no cambia.</strong>",
              "Según la Ley 26.130, a partir de la mayoría de edad las personas pueden acceder: solo hay que dejar constancia por escrito de la decisión después de recibir información completa y comprensible. <strong>No hace falta el consentimiento de la pareja ni de nadie más, ni haber tenido hijos.</strong>",
              "La Ley 27.655 reconoce que las personas con discapacidad tienen derecho a dar su consentimiento informado por sí mismas, y que en ningún caso se requiere autorización judicial."
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/ligadura-tubaria"
          },
          {
            "q": "Vasectomía",
            "a": [
              "Es un método anticonceptivo irreversible: una cirugía sencilla en los conductos deferentes, que transportan los espermatozoides. <strong>Después se sigue eyaculando como siempre, no afecta las erecciones y el placer sexual no cambia.</strong> El semen se ve igual, pero no contiene espermatozoides.",
              "<strong>Es efectiva luego de los primeros tres meses o de las primeras 20 eyaculaciones: por eso se recomienda usar otro método durante ese período y hacer el control médico para comprobarlo.</strong>",
              "Según la Ley 26.130, a partir de la mayoría de edad las personas pueden acceder; solo hay que dejar constancia por escrito de la decisión. <strong>No hace falta el consentimiento de la pareja ni de nadie más, ni haber tenido hijos.</strong>"
            ],
            "url": "https://www.argentina.gob.ar/salud/sexual/vasectomia"
          }
        ]
      },
      {
        "type": "text",
        "id": "ahe",
        "title": "Anticoncepción hormonal de emergencia («pastilla del día después»)",
        "icon": "clock",
        "tone": "t4",
        "paras": [
          "<strong>Es la que se conoce como «pastilla del día después»: se usa después de una relación sexual sin protección, si no se usó otro método o si falló el que se estaba usando.</strong> Es más efectiva cuanto antes se tome, sobre todo dentro de las primeras 12 horas. Se puede tomar hasta cinco días después, pero cuanto más tiempo pasa, menos efectiva es.",
          "Tiene cobertura integral en hospitales, centros de salud, obras sociales y prepagas. También se consigue en farmacias sin necesidad de receta médica.",
          "La AHE (anticoncepción hormonal de emergencia) no protege del VIH ni de otras ITS (infecciones de transmisión sexual): se recomienda el uso de preservativo."
        ],
        "note": "En la Ciudad también se puede pedir en guardias generales y de ginecología y obstetricia."
      }
    ],
    "sources": [
      {
        "label": "Métodos anticonceptivos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Métodos anticonceptivos · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/metodos-anticonceptivos"
      },
      {
        "label": "Pastillas combinadas · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/pastillas-combinadas"
      },
      {
        "label": "Pastillas de una sola hormona · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/pastillas-una-hormona"
      },
      {
        "label": "Anticonceptivos inyectables · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/anticonceptivos-inyectables"
      },
      {
        "label": "Implantes subdérmicos · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/metodos-anticonceptivos/implante-subdermico"
      },
      {
        "label": "Dispositivos intrauterinos (DIU) · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/diu"
      },
      {
        "label": "Anticoncepción hormonal de emergencia · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/ahe"
      },
      {
        "label": "Ligadura tubaria · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/ligadura-tubaria"
      },
      {
        "label": "Vasectomía · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/vasectomia"
      },
      {
        "label": "Ley 25.673, Programa Nacional de Salud Sexual y Procreación Responsable · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-25673-79831/texto"
      }
    ]
  },
  "its": {
    "key": [
      {
        "icon": "shield-check",
        "title": "Para prevenir ITS",
        "value": "Preservativo",
        "label": "peneano y vaginal, gratis en centros de salud",
        "to": "preservativo"
      },
      {
        "icon": "droplet",
        "title": "Gratis y confidencial",
        "value": "Test de VIH y sífilis",
        "label": "sin ayuno ni orden",
        "to": "test"
      },
      {
        "icon": "clock",
        "title": "Si hubo un riesgo",
        "value": "72 horas",
        "label": "para la profilaxis post exposición (PEP)",
        "to": "riesgo"
      },
      {
        "icon": "map-pin",
        "title": "Centros de testeo",
        "value": "69 lugares",
        "label": "en la Ciudad",
        "to": "test"
      }
    ],
    "blocks": [
      {
        "type": "list",
        "id": "preservativo",
        "title": "Preservativo peneano",
        "icon": "shield-check",
        "tone": "t1",
        "lead": "Ayuda a reducir el riesgo de ITS, incluido el VIH, y de embarazo. No elimina el riesgo por completo. Se usa uno nuevo en cada práctica sexual (vaginal, anal u oral). El Ministerio recomienda:",
        "items": [
          "Verificar la fecha de vencimiento y el envoltorio; no llevarlo en la billetera ni dejarlo al sol.",
          "Usarlo desde la erección y durante toda la relación.",
          "Abrir el sobre con cuidado, sin tijera ni dientes, y no usar nunca dos juntos.",
          "Apretar la punta para sacar el aire y desenrollarlo hasta la base.",
          "Usar lubricante a base de agua: la vaselina, el aceite y la crema de manos lo dañan.",
          "Retirarlo con el pene todavía erecto, cuidando que no se derrame el semen, y tirarlo a la basura."
        ],
        "note": "Están en la cobertura obligatoria (Ley 25.673): se piden gratis en hospitales, centros de salud, obras sociales y prepagas."
      },
      {
        "type": "slide",
        "title": "Preservativo vaginal",
        "icon": "shield-check",
        "tone": "t2",
        "lead": "El preservativo vaginal es un método de barrera que se usa en prácticas sexuales de penetración, ya sea con pene, dildo u otros juguetes sexuales. Protege el interior de la vagina y parte de la vulva.",
        "label": "Cómo se usa y qué tener en cuenta",
        "count": "",
        "blocks": [
          {
            "type": "text",
            "paras": [
              "Mide aproximadamente 17 cm, como el preservativo peneano, y es de nitrilo, un material apto para personas alérgicas al látex. Viene lubricado con silicona. Tiene un anillo externo, más ancho en el extremo abierto, y un anillo interno flexible.",
              "Usado correctamente, ayuda a reducir el riesgo de transmisión del VIH y de otras ITS, como la sífilis, y reduce la posibilidad de embarazos no intencionales. No elimina el riesgo por completo. Permite mayor autonomía en las prácticas sexuales de las personas con vagina."
            ]
          },
          {
            "type": "steps",
            "title": "Cómo se usa",
            "items": [
              "Antes de abrirlo, revisá que el envase no esté roto o dañado y verificá la fecha de vencimiento. Sin abrirlo, frotá el paquete entre las manos limpias para esparcir el lubricante.",
              "Abrilo desde la flecha o la ranura del borde, sin tijeras ni dientes, y sacá el preservativo.",
              "Elegí una posición cómoda. Agarrá el anillo interno (extremo cerrado) entre el pulgar y el índice y apretalo por los lados hasta formar una punta.",
              "Separá los labios externos de la vulva y usá esa punta para empujar el preservativo hacia adentro. Deslizá los dedos dentro y empujá el anillo interior hasta donde sea posible.",
              "Tiene que ajustarse a la pared de la vagina sin retorcerse. Sostené el anillo exterior al inicio de la penetración: queda fuera del cuerpo y cubre en parte la vulva.",
              "Para retirarlo, agarrá el anillo exterior y giralo para extraerlo con suavidad. Podés envolverlo en un pañuelo de papel o en su envase y tirarlo a la basura."
            ]
          },
          {
            "type": "list",
            "title": "Tené en cuenta",
            "items": [
              "Se usa una sola vez, y siempre uno nuevo en cada práctica sexual, sea con la misma persona o con otras.",
              "Puede colocarse hasta 8 horas antes de la práctica sexual, pero es importante usarlo desde el inicio.",
              "No se usa junto con el preservativo peneano, porque pueden romperse con la fricción. Su uso no está recomendado para prácticas vulva-vulva ni para sexo oral o anal.",
              "Se puede combinar con pastillas, DIU (dispositivo intrauterino), inyectables e implantes. Se puede usar durante la menstruación (si usás copita o tampón, retiralos antes de colocarlo) y se puede orinar con él puesto, corriendo el anillo externo hacia un lado.",
              "Pueden usarlo todas las personas con vagina, también en el posparto, posaborto o poscesárea reciente. El Ministerio indica que no está recomendado para personas con neovagina o histerectomizadas, porque no puede ajustarse al cuello del útero.",
              "Si una persona con discapacidad motora elige este método y tiene dificultad para colocarlo, puede pedir asistencia a otra persona."
            ]
          },
          {
            "type": "text",
            "title": "Dónde conseguirlo",
            "paras": [
              "El Ministerio informa que los preservativos vaginales se entregan en espacios de salud como centros de salud, consejerías, hospitales y organizaciones de la sociedad civil, y que dónde conseguirlos se consulta con el referente de cada provincia."
            ]
          }
        ]
      },
      {
        "type": "group",
        "id": "test",
        "title": "Test de VIH y sífilis",
        "icon": "droplet",
        "tone": "t3",
        "lead": "En la Ciudad son análisis de sangre sencillos, confidenciales y gratuitos en el sistema público. No hace falta estar en ayunas ni ser mayor de edad. En los centros de testeo también te dan preservativos gratis.",
        "blocks": [
          {
            "type": "slide",
            "label": "Ver los centros de testeo de la Ciudad",
            "count": "69 lugares",
            "blocks": [
              {
                "type": "spots",
                "items": [
                  {
                    "title": "Almagro (CeSAC Nº 38)",
                    "meta": [
                      [
                        "map-pin",
                        "Medrano 350"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3638 / 4958-4783"
                  },
                  {
                    "title": "Balvanera (CeSAC Nº 11)",
                    "meta": [
                      [
                        "map-pin",
                        "Agüero 940"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3611"
                  },
                  {
                    "title": "Barracas 1 (CeSAC Nº 1)",
                    "meta": [
                      [
                        "map-pin",
                        "Vélez Sarsfield 1271"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3601 / 4302-0059"
                  },
                  {
                    "title": "Barracas 2 (CeSAC Nº 8)",
                    "meta": [
                      [
                        "map-pin",
                        "Osvaldo Cruz 3485"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3608 / 4302-3825"
                  },
                  {
                    "title": "Barracas 3 (CeSAC Nº 16)",
                    "meta": [
                      [
                        "map-pin",
                        "Osvaldo Cruz 2055"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3616 / 4301-6411"
                  },
                  {
                    "title": "Barracas 4 (CeSAC Nº 30)",
                    "meta": [
                      [
                        "map-pin",
                        "Amancio Alcorta 3100 (e Iguazú)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3630 / 4912-2620"
                  },
                  {
                    "title": "Barracas 6 (CeSAC Nº 35)",
                    "meta": [
                      [
                        "map-pin",
                        "Osvaldo Cruz y Zavaleta"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3635 / 4301-8720"
                  },
                  {
                    "title": "Barracas 7 (CeSAC Nº 49)",
                    "meta": [
                      [
                        "map-pin",
                        "Camino de Sirga y Agustín Magaldi"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3649"
                  },
                  {
                    "title": "Boedo (CeSAC Nº 42)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. La Plata 2241"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3642"
                  },
                  {
                    "title": "Flores 1 (CeSAC Nº 19)",
                    "meta": [
                      [
                        "map-pin",
                        "Curapaligüe 1905"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3619 / 4925-0992"
                  },
                  {
                    "title": "Flores 2 (CeSAC Nº 20)",
                    "meta": [
                      [
                        "map-pin",
                        "Ana María Janer y Charrúa 2330 (Barrio 1 11 14)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3620 / 4919-2144"
                  },
                  {
                    "title": "Flores 3 (CeSAC Nº 31)",
                    "meta": [
                      [
                        "map-pin",
                        "Ana Maria Janer y Agustín de Vedia"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3631 / 4919-3994"
                  },
                  {
                    "title": "Flores 4 (CeSAC Nº 40)",
                    "meta": [
                      [
                        "map-pin",
                        "Esteban Bonorino 1729"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3640 / 4631-4554"
                  },
                  {
                    "title": "Flores 5 (CeSAC Nº 48)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. F. de la Cruz 1753"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3648"
                  },
                  {
                    "title": "Floresta (CeSAC Nº 36)",
                    "meta": [
                      [
                        "map-pin",
                        "Mercedes 1371"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3636"
                  },
                  {
                    "title": "La Boca 1 (CeSAC Nº 9)",
                    "meta": [
                      [
                        "map-pin",
                        "Irala 1254"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3609 / 4302-9983"
                  },
                  {
                    "title": "La Boca 2 (CeSAC Nº 41)",
                    "meta": [
                      [
                        "map-pin",
                        "Ministro Brin 843"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3641 / 4361-8736"
                  },
                  {
                    "title": "La Boca 3 (CeSAC Nº 43)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Regimientos de Patricios 1941"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4302-5950"
                  },
                  {
                    "title": "La Paternal 1 (CeSAC Nº 34)",
                    "meta": [
                      [
                        "map-pin",
                        "Gral. José G. Artigas 2262"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3634"
                  },
                  {
                    "title": "La Paternal 2 (CeSAC Nº 22)",
                    "meta": [
                      [
                        "map-pin",
                        "Fragata Sarmiento 2152"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3622 / 5030-9899"
                  },
                  {
                    "title": "Mataderos 1 (CeSAC Nº 4)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Alberdi 6300 (y Pilar, Plaza Zalaberry)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3604 / 4686-6660"
                  },
                  {
                    "title": "Mataderos 2 (CeSAC Nº 37)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. De Los Corrales 6999 (esq. Carhué)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3637"
                  },
                  {
                    "title": "Nueva Pompeya 5 (CeSAC Nº 32)",
                    "meta": [
                      [
                        "map-pin",
                        "Charrúa 2900"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3632 / 4919-7106"
                  },
                  {
                    "title": "Palermo 1 (CeSAC Nº 17)",
                    "meta": [
                      [
                        "map-pin",
                        "El Salvador 4087"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3617"
                  },
                  {
                    "title": "Palermo 2 (CeSAC Nº 26)",
                    "meta": [
                      [
                        "map-pin",
                        "Gurruchaga 1939"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3626 / 4897-2156"
                  },
                  {
                    "title": "Palermo 3 (CeSAC Nº 33)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Córdoba 5741"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3633 / 5197-5078/79"
                  },
                  {
                    "title": "Parque Avellaneda (CeSAC Nº 13)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Directorio 4210"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3613 / 4671-5693"
                  },
                  {
                    "title": "Parque Patricios 1 (CeSAC Nº 10)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Amancio Alcorta 1402"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3610 / 4304-2002"
                  },
                  {
                    "title": "Parque Patricios 2 (CeSAC Nº 39)",
                    "meta": [
                      [
                        "map-pin",
                        "24 de Noviembre 1679"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3639 / 4911-3576"
                  },
                  {
                    "title": "Retiro 1 (CeSAC Nº 21)",
                    "meta": [
                      [
                        "map-pin",
                        "Gendarmería Nacional 522"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3621 / 4313-6985"
                  },
                  {
                    "title": "Retiro 2 (CeSAC Nº 25)",
                    "meta": [
                      [
                        "map-pin",
                        "Letonia s/n esq. Antártida Argentina"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3625 / 5030-9768"
                  },
                  {
                    "title": "Retiro 3 (CeSAC Nº 47)",
                    "meta": [
                      [
                        "map-pin",
                        "Calle Playón (ex galpón SIC), Barrio 31"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3647"
                  },
                  {
                    "title": "Saavedra (CeSAC Nº 27)",
                    "meta": [
                      [
                        "map-pin",
                        "Arias 3783"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3627 / 4543-2998"
                  },
                  {
                    "title": "San Cristóbal (CeSAC Nº 45)",
                    "meta": [
                      [
                        "map-pin",
                        "Cochabamba 2622"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3645 / 4941-0969 (Int. 110)"
                  },
                  {
                    "title": "San Telmo (CeSAC Nº 15)",
                    "meta": [
                      [
                        "map-pin",
                        "Balcarce 1170"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3615"
                  },
                  {
                    "title": "Villa Lugano 1 (CeSAC Nº 5)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Piedra Buena 3140"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3605 / 4687-0494/1672"
                  },
                  {
                    "title": "Villa Lugano 10 (CeSAC Nº 28)",
                    "meta": [
                      [
                        "map-pin",
                        "Santander 5955"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3628 / 4605-2148"
                  },
                  {
                    "title": "Villa Lugano 2 (CeSAC Nº 7)",
                    "meta": [
                      [
                        "map-pin",
                        "2 de Abril de 1982 N° 6850"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3607 / 4602-5161"
                  },
                  {
                    "title": "Villa Lugano 3 (CeSAC Nº 14)",
                    "meta": [
                      [
                        "map-pin",
                        "Horacio Casco 4446 / Saravia 2486"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3614 / 4602-6527 / 5928"
                  },
                  {
                    "title": "Villa Lugano 4 (CeSAC Nº 18)",
                    "meta": [
                      [
                        "map-pin",
                        "Batlle y Ordóñez 5080 (Barrio 20)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3618 / 4638-7226"
                  },
                  {
                    "title": "Villa Lugano 5 (CeSAC Nº 29)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Dellepiane 6999"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3629 / 4601-7973"
                  },
                  {
                    "title": "Villa Lugano 6 (CeSAC Nº 43)",
                    "meta": [
                      [
                        "map-pin",
                        "Fonrouge 4377"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3643 / 4602-4178"
                  },
                  {
                    "title": "Villa Lugano 7 (CeSAC Nº 44)",
                    "meta": [
                      [
                        "map-pin",
                        "Saraza 4202"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3644 / 4601-3686/5573"
                  },
                  {
                    "title": "Villa Lugano 9 (CeSAC Nº 3)",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Soldado de la Frontera 5144"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3603 / 4605-7823"
                  },
                  {
                    "title": "Villa Luro (CeSAC Nº 23)",
                    "meta": [
                      [
                        "map-pin",
                        "Bacacay 5640"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3623"
                  },
                  {
                    "title": "Villa Pueyrredón (CeSAC Nº 2)",
                    "meta": [
                      [
                        "map-pin",
                        "Terrada 5850"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3602 / 4572-9520/6798"
                  },
                  {
                    "title": "Villa Soldati 1 (CeSAC Nº 6)",
                    "meta": [
                      [
                        "map-pin",
                        "Mariano Acosta 3673 (esq. Av. Rabanal)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3606"
                  },
                  {
                    "title": "Villa Soldati 2 (CeSAC Nº 24)",
                    "meta": [
                      [
                        "map-pin",
                        "Calle L sin n° e/ M. Castro y Laguna (B° R. Carrillo)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3624 / 4637-2002"
                  },
                  {
                    "title": "Villa Urquiza (CeSAC Nº 12)",
                    "meta": [
                      [
                        "map-pin",
                        "Olazábal 3960"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "2821-3612 / 4543-2494"
                  },
                  {
                    "title": "Centro de Cuidado Integral Ex Playón de Chacarita",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Triunvirato 2491"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11-3631-0552"
                  },
                  {
                    "title": "Fundación Huésped",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Forest 345"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "0800-222-4837"
                  },
                  {
                    "title": "Cruz Roja – Saavedra",
                    "meta": [
                      [
                        "map-pin",
                        "Quesada 2602"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4544-1188/3024"
                  },
                  {
                    "title": "Cruz Roja – Villa Crespo",
                    "meta": [
                      [
                        "map-pin",
                        "Maure 3955"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11-3573-3949"
                  },
                  {
                    "title": "Tekoporã Salud Comunitaria",
                    "meta": [
                      [
                        "map-pin",
                        "Cochabamba 2508"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11 5588-2426"
                  },
                  {
                    "title": "Mutual Senderos",
                    "meta": [
                      [
                        "map-pin",
                        "Pedro Echagüe 1265"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "5263-3984 int. 140"
                  },
                  {
                    "title": "VIHsibles (Federación LGTBI)",
                    "meta": [
                      [
                        "map-pin",
                        "Pte. Perón 683 (Piso 4, Dpto A)"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11 6617-7088"
                  },
                  {
                    "title": "AHF Argentina",
                    "meta": [
                      [
                        "map-pin",
                        "San Martín 899"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11 5885 3333"
                  },
                  {
                    "title": "Hospital de Infecciosas F. Muñiz",
                    "meta": [
                      [
                        "map-pin",
                        "Uspallata 2272"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "117040-9816"
                  },
                  {
                    "title": "Hospital Gral. de Agudos Álvarez, Servicio de Infectología",
                    "meta": [
                      [
                        "map-pin",
                        "Aranguren 2701"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4630-2900"
                  },
                  {
                    "title": "Hospital Gral. de Agudos C. Argerich, Servicio de Infectología (1° piso)",
                    "meta": [
                      [
                        "map-pin",
                        "Pi y Margal 750"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4121-0833 / 0828 / 0829"
                  },
                  {
                    "title": "Hospital Laura Bonaparte, consultorio de Salud Integral",
                    "meta": [
                      [
                        "map-pin",
                        "Combate de los Pozos 2133"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4305-0091"
                  },
                  {
                    "title": "Hospital Durand, Servicio de Infectología y Salud Mental",
                    "meta": [
                      [
                        "map-pin",
                        "J. B. Ambrosetti 743, Pabellón Herrera Vega, 2° piso"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4982-5555 int. 379/381"
                  },
                  {
                    "title": "Hospital Gral. de Agudos J. María Penna, Servicio de Infectología (Aula pre-Castells)",
                    "meta": [
                      [
                        "map-pin",
                        "Almafuerte 408"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4911-3030 int. 239"
                  },
                  {
                    "title": "Hospital Gral. de Agudos Ramos Mejía, Clínica de Salud Sexual (planta baja)",
                    "meta": [
                      [
                        "map-pin",
                        "Urquiza 609"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "11 3386-8530 (solo WhatsApp)"
                  },
                  {
                    "title": "Hospital Gral. de Agudos E. Tornú, Consultorio 152",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Combatientes de Malvinas 3002"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4521-8700 / 3600 / 4485"
                  },
                  {
                    "title": "Hospital Gral. de Agudos F. Santojanni, Servicio Social",
                    "meta": [
                      [
                        "map-pin",
                        "Pilar 950"
                      ],
                      [
                        "droplet",
                        "VIH y sífilis"
                      ]
                    ],
                    "phone": "4630-5565"
                  },
                  {
                    "title": "Hospital Gral. de Agudos Cecilia Grierson, Laboratorio",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Gral. Francisco Fernández de la Cruz 4402"
                      ],
                      [
                        "droplet",
                        "VIH"
                      ]
                    ],
                    "phone": "4604-9000"
                  },
                  {
                    "title": "Rock & Vida",
                    "meta": [
                      [
                        "map-pin",
                        "Coronel Pagola 3880 (esq. Sáenz al 300)"
                      ],
                      [
                        "droplet",
                        "VIH"
                      ]
                    ],
                    "phone": "4912-4150"
                  },
                  {
                    "title": "Casa Trans",
                    "meta": [
                      [
                        "map-pin",
                        "Av. Jujuy 1341"
                      ],
                      [
                        "droplet",
                        "VIH"
                      ]
                    ],
                    "phone": "5032-6335"
                  }
                ]
              }
            ]
          }
        ],
        "note": "Atienden en distintos días y horarios: llamá antes de ir. Si vivís en otro lugar, preguntá en tu centro de salud."
      },
      {
        "type": "callout",
        "id": "riesgo",
        "tone": "alert",
        "title": "Si el preservativo se rompió, se corrió o no lo usaste",
        "icon": "clock",
        "list": [
          "Consultá cuanto antes en un centro de salud u hospital público: así se reduce la posibilidad de infección por VIH y otras ITS y se puede evitar un embarazo no intencional.",
          "Según el Ministerio, la profilaxis post exposición al VIH (PEP) debe tomarse dentro de las 72 horas de la posible exposición, y cuanto antes mejor. La anticoncepción de emergencia puede tomarse hasta 5 días después, aunque es más efectiva en las primeras 12 horas."
        ]
      }
    ],
    "sources": [
      {
        "label": "Preservativos · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual/preservativos"
      },
      {
        "label": "Preguntas frecuentes sobre preservativo vaginal · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/vih-sida/preguntas-frecuentes-sobre-preservativo-vaginal"
      },
      {
        "label": "Test de VIH y sífilis y centros de testeo · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/test-de-vih-y-sifilis-y-centros-de-testeo-0"
      },
      {
        "label": "Salud sexual, VIH e ITS · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual"
      }
    ]
  },
  "ive": {
    "key": [
      {
        "icon": "calendar",
        "title": "IVE",
        "value": "Semana 14",
        "label": "inclusive, con solo pedirla",
        "to": "tipos"
      },
      {
        "icon": "clock",
        "title": "Plazo máximo",
        "value": "10 días",
        "label": "corridos desde que la pedís",
        "to": "falta"
      },
      {
        "icon": "hand-heart",
        "title": "Costo",
        "value": "Gratis",
        "label": "en el sistema público, obras sociales y prepagas",
        "to": "tipos"
      },
      {
        "icon": "shield-check",
        "title": "Trato",
        "value": "Confidencial",
        "label": "con secreto médico",
        "to": "trato"
      }
    ],
    "blocks": [
      {
        "type": "cards",
        "id": "tipos",
        "title": "IVE e ILE",
        "icon": "file-text",
        "tone": "t1",
        "items": [
          {
            "icon": "calendar",
            "title": "IVE (interrupción voluntaria)",
            "text": "Hasta la semana 14 inclusive, con solo pedirla."
          },
          {
            "icon": "scale",
            "title": "ILE (interrupción legal)",
            "text": "Después de la semana 14, si el embarazo es resultado de una violación o si está en peligro la vida o la salud integral de la persona gestante.",
            "note": "En casos de violación se firma una declaración jurada; a niñas menores de 13 años no se les pide."
          }
        ],
        "note": "Es gratis en el sector público, las obras sociales y las prepagas, en todo el país."
      },
      {
        "type": "list",
        "id": "falta",
        "title": "Qué hace falta",
        "icon": "clock",
        "tone": "t2",
        "items": [
          "Pedirla y firmar el consentimiento informado, después de recibir toda la información. Es personal: nadie puede firmarlo por vos.",
          "El plazo máximo para acceder es de 10 días corridos desde que la pedís."
        ],
        "note": "La Ley 27.610 tiene reglas propias para adolescentes y personas con capacidad restringida: están en la página oficial."
      },
      {
        "type": "cards",
        "id": "trato",
        "title": "Cómo te tienen que tratar",
        "icon": "shield-check",
        "tone": "t3",
        "items": [
          {
            "title": "Con dignidad",
            "text": "Con respeto por tus convicciones, sin juzgar tus decisiones."
          },
          {
            "title": "Con confidencialidad",
            "text": "Alcanzada por el secreto médico. Tu familia o acompañante participa solo si vos lo autorizás."
          },
          {
            "title": "Con información",
            "text": "Clara, actualizada y accesible, con una escucha respetuosa."
          },
          {
            "title": "Con atención posaborto",
            "text": "Siempre, y con acceso a métodos anticonceptivos."
          }
        ]
      },
      {
        "type": "slide",
        "title": "Si el profesional objeta por conciencia",
        "icon": "info",
        "tone": "t4",
        "label": "Qué dice la Ley 27.610 de Acceso a la IVE",
        "count": "",
        "blocks": [
          {
            "type": "text",
            "paras": [
              "Tiene que derivarte de buena fe y sin demoras a otro profesional. No puede negarse si tu vida o tu salud están en peligro, y nadie puede objetar la atención posaborto.",
              "Si es un efector privado o de obra social sin profesionales que no objeten, tiene que derivarte a otro y hacerse cargo de la gestión y los costos."
            ]
          }
        ]
      },
      {
        "type": "rows",
        "title": "Dónde consultar o reclamar",
        "icon": "message-circle",
        "tone": "t5",
        "items": [
          {
            "title": "Línea nacional de salud sexual",
            "text": "Para consultar o denunciar obstáculos.",
            "phone": "0800-222-3444"
          },
          {
            "title": "Línea 144",
            "text": "Violencia de género: impedir el acceso a la IVE es violencia contra la libertad reproductiva.",
            "phone": "144"
          },
          {
            "title": "Si tu obra social o prepaga no cumple",
            "text": "Reclamá ante la Superintendencia de Servicios de Salud o Defensa del Consumidor.",
            "url": "https://www.argentina.gob.ar/generos/acceso-la-interrupcion-voluntaria-del-embarazo-ive"
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "Ley 27.610, acceso a la interrupción voluntaria del embarazo · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-27610-346231/texto"
      },
      {
        "label": "Acceso a la Interrupción Voluntaria del Embarazo (IVE) · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/generos/acceso-la-interrupcion-voluntaria-del-embarazo-ive"
      }
    ]
  },
  "derechos": {
    "key": [
      {
        "icon": "scale",
        "title": "Ley 25.673",
        "value": "Información",
        "label": "y atención en salud sexual",
        "to": "derechos"
      },
      {
        "icon": "book-open",
        "title": "Ley 26.150",
        "value": "ESI",
        "label": "en todas las escuelas",
        "section": "que-es"
      },
      {
        "icon": "hand-heart",
        "title": "Ley 27.610",
        "value": "Decidir",
        "label": "sobre un embarazo",
        "to": "derechos"
      },
      {
        "icon": "file-text",
        "title": "Materiales",
        "value": "3 fuentes",
        "label": "oficiales de ESI",
        "to": "materiales"
      }
    ],
    "blocks": [
      {
        "type": "cards",
        "id": "derechos",
        "title": "Tus derechos",
        "icon": "scale",
        "tone": "t1",
        "items": [
          {
            "icon": "message-circle",
            "title": "Información y atención",
            "text": "La Ley 25.673 garantiza a toda la población el acceso a información, orientación, métodos y prestaciones de salud sexual y reproductiva."
          },
          {
            "icon": "book-open",
            "title": "Educación sexual integral",
            "text": "La Ley 26.150 establece que todas las personas que estudian tienen derecho a recibir educación sexual integral en escuelas públicas, de gestión estatal y privadas."
          },
          {
            "icon": "hand-heart",
            "title": "Decidir sobre un embarazo",
            "text": "La Ley 27.610 reconoce el derecho a decidir y establece que el sector público y las obras sociales deben cubrir la interrupción del embarazo de forma integral y gratuita.",
            "button": {
              "go": "ive",
              "label": "Ver IVE e ILE"
            }
          }
        ]
      },
      {
        "type": "links",
        "id": "materiales",
        "title": "Materiales de ESI",
        "icon": "file-text",
        "tone": "t3",
        "lead": "Materiales oficiales para estudiantes, docentes y familias. Se abren en la página de cada organismo.",
        "items": [
          {
            "icon": "book-open",
            "who": "Nación",
            "title": "Ministerio de Educación",
            "text": "Láminas, cuadernillos, una serie animada hecha con Pakapaka y videos en Lengua de Señas Argentina.",
            "url": "https://www.argentina.gob.ar/noticias/educacion-sexual-integral-nuevos-materiales-educativos"
          },
          {
            "icon": "graduation-cap",
            "who": "Provincia de Buenos Aires",
            "title": "Dirección de ESI",
            "text": "Lineamientos curriculares, la colección #ESI y el Canal ESI.",
            "url": "https://abc.gob.ar/secretarias/areas/subsecretaria-de-educacion/programa-provincial-de-educacion-sexual-integral/programa"
          },
          {
            "icon": "users",
            "who": "Chaco",
            "title": "Ministerio de Educación",
            "text": "Cuadernillos para estudiantes, materiales para docentes, para compartir en familia y en lenguas indígenas.",
            "url": "https://dirdocumentacion.educacion.chaco.gob.ar/esi/recursos/"
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "Ley 25.673, Programa Nacional de Salud Sexual y Procreación Responsable · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-25673-79831/texto"
      },
      {
        "label": "Ley 26.150, Programa Nacional de Educación Sexual Integral · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-26150-121222/texto"
      },
      {
        "label": "Ley 27.610, acceso a la interrupción voluntaria del embarazo · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/normativa/nacional/ley-27610-346231/texto"
      },
      {
        "label": "Salud sexual y reproductiva · Ministerio de Salud de la Nación",
        "url": "https://www.argentina.gob.ar/salud/sexual"
      },
      {
        "label": "Educación Sexual Integral: nuevos materiales educativos · argentina.gob.ar, 4/10/2022",
        "url": "https://www.argentina.gob.ar/noticias/educacion-sexual-integral-nuevos-materiales-educativos"
      },
      {
        "label": "Programa provincial de Educación Sexual Integral",
        "url": "https://abc.gob.ar/secretarias/areas/subsecretaria-de-educacion/programa-provincial-de-educacion-sexual-integral/programa"
      },
      {
        "label": "Educación Sexual Integral: recursos",
        "url": "https://dirdocumentacion.educacion.chaco.gob.ar/esi/recursos/"
      }
    ]
  }
}

/** The ids of the sections in the model → in the app, for the buttons and summary cells that open another section */
export const SEX_EDUCATION_SECTION_IDS: Record<string, string> = {
  "que-es": "section-1",
  "consultar": "section-2",
  "metodos": "section-3",
  "its": "section-4",
  "ive": "section-5",
  "derechos": "section-6"
}

/** The places of the map, as the model lists them */
export const SEX_EDUCATION_PLACES: BlockPlace[] = [
  {
    "id": "cesac-3",
    "name": "CeSAC Nº 3",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Soldado de la Frontera 5144, CABA",
    "phones": [
      [
        "Principal",
        "2821-3603"
      ],
      [
        "Alternativo",
        "11 5048-1097"
      ]
    ],
    "lat": -34.68463871592785,
    "lng": -58.464336857206874,
    "guard24": false,
    "free": null,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "IVE/ILE: gratuidad no confirmada",
      "Pruebas de VIH: gratuidad no confirmada",
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-41",
    "name": "CeSAC Nº 41",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "La Boca",
    "address": "Ministro Brin 843, CABA",
    "phones": [
      [
        "Principal",
        "2821-3641"
      ],
      [
        "Alternativo",
        "4361-8736"
      ]
    ],
    "lat": -34.63132509345374,
    "lng": -58.35792934227024,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-47",
    "name": "CeSAC Nº 47",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barrio Mugica",
    "address": "Alpaca 620, CABA",
    "phones": [
      [
        "Teléfono",
        "2821-3647"
      ]
    ],
    "lat": -34.584255999999996,
    "lng": -58.37930900000001,
    "guard24": false,
    "free": null,
    "consejeria": false,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Métodos anticonceptivos: gratuidad no confirmada",
      "IVE/ILE: gratuidad no confirmada",
      "Preservativos: gratuidad no confirmada",
      "Anticoncepción de emergencia: gratuidad no confirmada",
      "Pruebas de VIH: gratuidad no confirmada"
    ],
    "source": []
  },
  {
    "id": "hospital-general-de-ninos-pedro-de-elizalde",
    "name": "Hospital Elizalde",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Barracas",
    "address": "Av. Montes de Oca 40, CABA",
    "phones": [
      [
        "Central",
        "4363-2100"
      ]
    ],
    "lat": -34.6288459,
    "lng": -58.3775546,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-38",
    "name": "CeSAC Nº 38",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Almagro",
    "address": "Medrano 350, CABA",
    "phones": [
      [
        "Principal",
        "2821-3638"
      ]
    ],
    "lat": -34.606611,
    "lng": -58.421427,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-11",
    "name": "CeSAC Nº 11",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Balvanera",
    "address": "Aguero 940, CABA",
    "phones": [
      [
        "Principal",
        "2821-3611"
      ]
    ],
    "lat": -34.599002,
    "lng": -58.410552,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-ramos",
    "name": "Hospital Ramos Mejía",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Balvanera",
    "address": "Urquiza 609, CABA",
    "phones": [
      [
        "Principal",
        "4127-0400"
      ]
    ],
    "lat": -34.617634,
    "lng": -58.409436,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-1",
    "name": "CeSAC Nº 1",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barracas",
    "address": "Velez Sarsfield 1271, CABA",
    "phones": [
      [
        "Principal",
        "2821-3601"
      ]
    ],
    "lat": -34.649014,
    "lng": -58.38929,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-8",
    "name": "CeSAC Nº 8",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barracas",
    "address": "Osvaldo Cruz 3469, CABA",
    "phones": [
      [
        "Principal",
        "2821-3608"
      ]
    ],
    "lat": -34.656076,
    "lng": -58.396967,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-16",
    "name": "CeSAC Nº 16",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barracas",
    "address": "Osvaldo Cruz 2055, CABA",
    "phones": [
      [
        "Principal",
        "2821-3616"
      ]
    ],
    "lat": -34.651832,
    "lng": -58.374717,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-35",
    "name": "CeSAC Nº 35",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barracas",
    "address": "Osvaldo Cruz y Zavaleta, CABA",
    "phones": [
      [
        "Principal",
        "2821-3635"
      ]
    ],
    "lat": -34.656376,
    "lng": -58.399536,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-durand",
    "name": "Hospital Durand",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Caballito",
    "address": "Av. Díaz Vélez 5044, CABA",
    "phones": [
      [
        "Principal",
        "4982-5555"
      ]
    ],
    "lat": -34.608872,
    "lng": -58.437888,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-pirovano",
    "name": "Hospital Pirovano",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Coghlan",
    "address": "Av. Monroe 3555, CABA",
    "phones": [],
    "lat": -34.565106,
    "lng": -58.470986,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-19",
    "name": "CeSAC Nº 19",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Flores",
    "address": "Curapaligüe 1905, CABA",
    "phones": [
      [
        "Principal",
        "2821-3619"
      ]
    ],
    "lat": -34.642936,
    "lng": -58.442266,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-20",
    "name": "CeSAC Nº 20",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Flores",
    "address": "Ana María Janer y Charrúa, CABA",
    "phones": [
      [
        "Principal",
        "2821-3620"
      ]
    ],
    "lat": -34.649532,
    "lng": -58.438062,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-40",
    "name": "CeSAC Nº 40",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Flores",
    "address": "Esteban Bonorino 1729, CABA",
    "phones": [
      [
        "Principal",
        "2821-3640"
      ]
    ],
    "lat": -34.645072,
    "lng": -58.445442,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-48",
    "name": "CeSAC Nº 48",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Flores",
    "address": "Av. F. de la Cruz 1753, CABA",
    "phones": [
      [
        "Principal",
        "2821-3648"
      ]
    ],
    "lat": -34.650082,
    "lng": -58.431076,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-alvarez",
    "name": "Hospital Álvarez",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Flores",
    "address": "Aranguren 2701, CABA",
    "phones": [
      [
        "Principal",
        "4611-6666"
      ]
    ],
    "lat": -34.624292,
    "lng": -58.469422,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-pinero",
    "name": "Hospital Piñero",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Flores",
    "address": "Av. Varela 1301, CABA",
    "phones": [
      [
        "Principal",
        "4631-8100"
      ]
    ],
    "lat": -34.644118,
    "lng": -58.453681,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-36",
    "name": "CeSAC Nº 36",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Floresta",
    "address": "Mercedes 1371, CABA",
    "phones": [
      [
        "Principal",
        "2821-3636"
      ]
    ],
    "lat": -34.621937,
    "lng": -58.491802,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-9",
    "name": "CeSAC Nº 9",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "La Boca",
    "address": "Irala 1254, CABA",
    "phones": [
      [
        "Principal",
        "2821-3609"
      ]
    ],
    "lat": -34.640137,
    "lng": -58.366071,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-argerich",
    "name": "Hospital Argerich",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Boca",
    "address": "Pi y Margal 750, CABA",
    "phones": [
      [
        "Principal",
        "4121-0700"
      ]
    ],
    "lat": -34.627781,
    "lng": -58.366027,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-34",
    "name": "CeSAC Nº 34",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Del Parque",
    "address": "Artigas 2262, CABA",
    "phones": [
      [
        "Principal",
        "2821-3634"
      ]
    ],
    "lat": -34.606536,
    "lng": -58.478148,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-22",
    "name": "CeSAC Nº 22",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Paternal",
    "address": "Fragata Pres. Sarmiento 2152, CABA",
    "phones": [
      [
        "Principal",
        "2821-3622"
      ]
    ],
    "lat": -34.600874,
    "lng": -58.459046,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-santojanni",
    "name": "Hospital Santojanni",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Liniers",
    "address": "Pilar 950, CABA",
    "phones": [
      [
        "Principal",
        "4630-5500"
      ]
    ],
    "lat": -34.649353,
    "lng": -58.515801,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-4",
    "name": "CeSAC Nº 4",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Mataderos",
    "address": "Av. Alberdi 6300, CABA",
    "phones": [
      [
        "Principal",
        "2821-3604"
      ]
    ],
    "lat": -34.655044,
    "lng": -58.506343,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-32",
    "name": "CeSAC Nº 32",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Nueva Pompeya",
    "address": "Charrúa 2900, CABA",
    "phones": [
      [
        "Principal",
        "2821-3632"
      ]
    ],
    "lat": -34.654267,
    "lng": -58.431164,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-17",
    "name": "CeSAC Nº 17",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Palermo",
    "address": "El Salvador 4087, CABA",
    "phones": [
      [
        "Principal",
        "2821-3617"
      ]
    ],
    "lat": -34.592726,
    "lng": -58.420525,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-26",
    "name": "CeSAC Nº 26",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Palermo",
    "address": "Gurruchaga 1939, CABA",
    "phones": [
      [
        "Principal",
        "2821-3626"
      ]
    ],
    "lat": -34.58715,
    "lng": -58.425701,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-33",
    "name": "CeSAC Nº 33",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Palermo",
    "address": "Av. Córdoba 5741, CABA",
    "phones": [
      [
        "Principal",
        "2821-3633"
      ]
    ],
    "lat": -34.58645,
    "lng": -58.441725,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-fernandez",
    "name": "Hospital Fernández",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Palermo",
    "address": "Cerviño 3356, CABA",
    "phones": [
      [
        "Principal",
        "4808-2600"
      ]
    ],
    "lat": -34.581042,
    "lng": -58.406761,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-13",
    "name": "CeSAC Nº 13",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Parque Avellaneda",
    "address": "Av. Directorio 4210, CABA",
    "phones": [
      [
        "Principal",
        "2821-3613"
      ]
    ],
    "lat": -34.643246,
    "lng": -58.482101,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-10",
    "name": "CeSAC Nº 10",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Barracas",
    "address": "Av. Amancio Alcorta 1402, CABA",
    "phones": [
      [
        "Principal",
        "2821-3610"
      ]
    ],
    "lat": -34.633331,
    "lng": -58.383729,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-39",
    "name": "CeSAC Nº 39",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "24 de Noviembre 1679, CABA",
    "phones": [
      [
        "Principal",
        "2821-3639"
      ]
    ],
    "lat": -34.631005,
    "lng": -58.409827,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-sarda",
    "name": "Hospital Sardá",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "Esteban De Luca 2151, CABA",
    "phones": [
      [
        "Principal",
        "4943-3567"
      ]
    ],
    "lat": -34.634822,
    "lng": -58.402539,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-rivadavia",
    "name": "Hospital Rivadavia",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Recoleta",
    "address": "Av. Las Heras 2670, CABA",
    "phones": [
      [
        "Principal",
        "4809-2000"
      ]
    ],
    "lat": -34.584355,
    "lng": -58.400811,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-gutierrez",
    "name": "Hospital Gutiérrez",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Recoleta",
    "address": "Gallo 1330, CABA",
    "phones": [
      [
        "Principal",
        "4962-9247"
      ]
    ],
    "lat": -34.594523,
    "lng": -58.410732,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-45",
    "name": "CeSAC Nº 45",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "San Cristobal",
    "address": "Cochabamba 2622, CABA",
    "phones": [
      [
        "Principal",
        "2821-3645"
      ]
    ],
    "lat": -34.625333,
    "lng": -58.402269,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-zubizarreta",
    "name": "Hospital Zubizarreta",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Villa Devoto",
    "address": "Nueva York 3952, CABA",
    "phones": [
      [
        "Principal",
        "4501-5985"
      ]
    ],
    "lat": -34.599905,
    "lng": -58.511205,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-5",
    "name": "CeSAC Nº 5",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Av Piedrabuena 3140, CABA",
    "phones": [
      [
        "Principal",
        "2821-3605"
      ]
    ],
    "lat": -34.670523,
    "lng": -58.495309,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-14",
    "name": "CeSAC Nº 14",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Parque Avellaneda",
    "address": "Saravia 2486, CABA",
    "phones": [
      [
        "Principal",
        "2821-3614"
      ]
    ],
    "lat": -34.660308,
    "lng": -58.474335,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-43",
    "name": "CeSAC Nº 43",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Fonrouge 4377, CABA",
    "phones": [
      [
        "Principal",
        "2821-3643"
      ]
    ],
    "lat": -34.677722,
    "lng": -58.466531,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": false,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      }
    ]
  },
  {
    "id": "cesac-44",
    "name": "CeSAC Nº 44",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Saraza 4202, CABA",
    "phones": [
      [
        "Principal",
        "4601-3686"
      ]
    ],
    "lat": -34.660579,
    "lng": -58.467459,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-28",
    "name": "CeSAC Nº 28",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Santander 5955, CABA",
    "phones": [
      [
        "Principal",
        "2821-3628"
      ]
    ],
    "lat": -34.673065,
    "lng": -58.485932,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-tornu",
    "name": "Hospital Tornú",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Parque Chas",
    "address": "Av. Combatientes de Malvinas 3002, CABA",
    "phones": [
      [
        "Principal",
        "5243-9000"
      ]
    ],
    "lat": -34.587307,
    "lng": -58.470893,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-6",
    "name": "CeSAC Nº 6",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Soldati",
    "address": "Mariano Acosta 3673, CABA",
    "phones": [
      [
        "Principal",
        "2821-3606"
      ]
    ],
    "lat": -34.665617,
    "lng": -58.442481,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "hospital-grierson",
    "name": "Hospital Grierson",
    "kind": "Hospital",
    "province": "caba",
    "zone": "Villa Soldati",
    "address": "Av. Gral. Francisco Fernández de la Cruz 4402, CABA",
    "phones": [
      [
        "Principal",
        "4604-9000"
      ]
    ],
    "lat": -34.673753,
    "lng": -58.459025,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  },
  {
    "id": "cesac-12",
    "name": "CeSAC Nº 12",
    "kind": "Centro de salud",
    "province": "caba",
    "zone": "Villa Urquiza",
    "address": "Olazábal 3960, CABA",
    "phones": [
      [
        "Principal",
        "2821-3612"
      ]
    ],
    "lat": -34.569783,
    "lng": -58.474324,
    "guard24": false,
    "free": true,
    "consejeria": true,
    "metodos": true,
    "preservativos": true,
    "facts": [
      "Consejería en salud sexual: gratis según su fuente",
      "Métodos anticonceptivos: gratis según su fuente",
      "Preservativos: gratis según su fuente"
    ],
    "source": [
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Salud sexual y reproductiva",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos"
      },
      {
        "label": "Gobierno de la Ciudad de Buenos Aires: Preservativos gratis",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual/preservativos-gratis"
      }
    ]
  }
]

/** Every province, in the order of the map's selector */
export const SEX_EDUCATION_PROVINCES: [string, string][] = [["caba", "Ciudad de Buenos Aires"], ["buenos-aires", "Buenos Aires"], ["catamarca", "Catamarca"], ["chaco", "Chaco"], ["chubut", "Chubut"], ["cordoba", "Córdoba"], ["corrientes", "Corrientes"], ["entre-rios", "Entre Ríos"], ["formosa", "Formosa"], ["jujuy", "Jujuy"], ["la-pampa", "La Pampa"], ["la-rioja", "La Rioja"], ["mendoza", "Mendoza"], ["misiones", "Misiones"], ["neuquen", "Neuquén"], ["rio-negro", "Río Negro"], ["salta", "Salta"], ["san-juan", "San Juan"], ["san-luis", "San Luis"], ["santa-cruz", "Santa Cruz"], ["santa-fe", "Santa Fe"], ["santiago-del-estero", "Santiago del Estero"], ["tierra-del-fuego", "Tierra del Fuego"], ["tucuman", "Tucumán"]]
