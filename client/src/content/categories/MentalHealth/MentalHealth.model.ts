import type { BlockPlace } from "@/types/blocks"
import type { BreathingExercise } from "@/components/sectionBlocks/BreathGuide"
import type { GroundingStep } from "@/components/sectionBlocks/GroundingSteps"
import type { Source } from "@/components/health/SourceList"

// The content of every section, from the chosen model (diseñoCategorias/salud-mental-6-renglones-compacto-y-lo-nuevo.html).
// Icons are lucide names (utils/blockIcons)

type Phone = { number: string, dial: string, name: string, text: string, hours?: string, where?: string, cost?: string, main?: boolean }
type Line = { id: string, title: string, what: string, phone?: string, hours?: string, who?: string, how?: string, note?: string, url: string, address?: string, province?: string }

/** Dónde buscar ayuda: the lines to call now */
export const MH_NUMBERS: { urgent: Phone, items: Phone[] } = {
  "urgent": {
    "number": "911",
    "dial": "911",
    "name": "Emergencias",
    "text": "Si la vida de alguien corre peligro ahora: pide ambulancia o policía.",
    "where": "Todo el país"
  },
  "items": [
    {
      "number": "0800-999-0091",
      "dial": "08009990091",
      "name": "Urgencias de salud mental",
      "text": "Crisis emocional, angustia intensa, ideas de hacerse daño, consumos.",
      "hours": "24 h, todos los días",
      "where": "Todo el país",
      "cost": "Gratis y confidencial",
      "main": true
    },
    {
      "number": "0800-333-1665",
      "dial": "08003331665",
      "name": "Salud Mental Responde",
      "text": "Escucha, contención y orientación con profesionales de salud mental.",
      "hours": "24 h, todos los días",
      "where": "Ciudad de Buenos Aires",
      "cost": "Gratis"
    },
    {
      "number": "0800-222-5462",
      "dial": "08002225462",
      "name": "Salud Mental bonaerense",
      "text": "Atención, acompañamiento y derivación en salud mental.",
      "hours": "Lun a vie 8 a 24 h · fin de semana 10 a 22 h",
      "where": "Provincia de Buenos Aires",
      "cost": ""
    },
    {
      "number": "135",
      "dial": "135",
      "name": "Prevención del suicidio",
      "text": "Crisis emocional, angustia intensa o ideas de suicidio.",
      "hours": "De 8 a 0 h",
      "where": "CABA y Gran Buenos Aires",
      "cost": "Gratis"
    },
    {
      "number": "0800-345-1435",
      "dial": "08003451435",
      "name": "Prevención del suicidio",
      "text": "Lo mismo que el 135, desde el resto del país.",
      "hours": "De 8 a 0 h",
      "where": "Todo el país",
      "cost": ""
    },
    {
      "number": "141",
      "dial": "141",
      "name": "Consumos problemáticos",
      "text": "Alcohol, drogas o medicamentos (SEDRONAR).",
      "hours": "24 h, todos los días",
      "where": "Todo el país",
      "cost": "Gratis"
    }
  ]
}

/** Lines of other provinces and a listening chat */
export const MH_OTHER_LINES: Line[] = [
  {
    "id": "cordoba-linea-5555",
    "title": "Municipalidad de Córdoba - Escucha y orientación",
    "what": "Contención y orientación en salud mental y adicciones.",
    "phone": "0800-888-5555",
    "hours": "24 horas, todos los días",
    "who": "Vecinas/os de Córdoba Capital.",
    "how": "Llamada directa.",
    "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
  },
  {
    "id": "entre-rios-135",
    "title": "Entre Ríos - Línea 135",
    "what": "Orientación y acompañamiento ante urgencias en salud mental.",
    "phone": "135",
    "hours": "24 horas",
    "who": "Personas en crisis y su entorno.",
    "how": "Llamar desde Entre Ríos.",
    "url": "https://portal.entrerios.gov.ar/suicidio/"
  },
  {
    "id": "jujuy-linea-4767",
    "title": "Jujuy - Salud Mental Escucha",
    "what": "Orientación y acompañamiento profesional en salud mental.",
    "phone": "0800-888-4767",
    "hours": "24 horas",
    "who": "Personas de la provincia y su entorno.",
    "how": "Llamada directa provincial.",
    "url": "https://salud.jujuy.gob.ar/2026/06/16/pedir-ayuda-tambien-es-salud-mental-el-abordaje-que-impulsa-jujuy-para-acompanar-antes-que-el-malestar-avance/"
  },
  {
    "id": "tucuman-135",
    "title": "Tucumán - Línea 135 de urgencias en salud mental",
    "what": "Orientación ante urgencias en salud mental y derivación.",
    "phone": "135",
    "hours": "24 horas",
    "who": "Personas en urgencia, adolescentes y familias.",
    "how": "Llamar desde Tucumán.",
    "url": "https://msptucuman.gov.ar/red-integral-para-la-contencion-de-adolescentes-en-tucuman/"
  },
  {
    "id": "neuquen-te-escucha",
    "title": "Neuquén - Salud Mental Te Escucha",
    "what": "Apoyo profesional y orientación ante crisis.",
    "phone": "2995358191",
    "hours": "24 horas",
    "who": "Personas de Neuquén y su entorno.",
    "how": "Contacto al número provincial publicado.",
    "note": "La institución llama gratuita a la asistencia; el número es un celular y puede tener condiciones de comunicación que dependen de tu operador.",
    "url": "https://salud.neuquen.gob.ar/hablemos-de-salud-mental-y-suicidio/"
  },
  {
    "id": "aqui-estoy-chat",
    "title": "Aquí Estoy Chat / Res Non Verba Asociación Civil",
    "what": "Escucha humana por voluntarios entrenados y supervisados; no terapia ni emergencia.",
    "hours": "Lunes a viernes, 15:00 a 23:00, horario de Argentina",
    "who": "Personas que buscan apoyo emocional.",
    "how": "Entrar al sitio y al enlace oficial de WhatsApp.",
    "note": "Es escucha de voluntarios: no es terapia ni una emergencia.",
    "url": "https://aquiestoy.chat/"
  }
]

/** Support for problematic use: the Ciudad's line, its network of centers and the mutual-help groups */
export const MH_CONSUMOS: { line: Line, network: Line[], groups: Line[] } = {
  "line": {
    "id": "linea-caba-108-3",
    "title": "Línea 108, opción 3",
    "what": "Primera escucha y orientación ante consumos problemáticos.",
    "phone": "108, opción 3",
    "hours": "24 horas, todo el año",
    "who": "Personas con consumos problemáticos y su entorno.",
    "how": "Llamar y elegir opción 3.",
    "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-e-integracion-social/linea-108-opcion-3-contencion-y-orientacion-en"
  },
  "network": [
    {
      "id": "cemar-2#consumos-problematicos",
      "title": "Centro de día Cable a Tierra (CEMAR 2)",
      "what": "Atención de consumos problemáticos",
      "address": "Av. Iriarte 3501",
      "phone": "2821-3672",
      "hours": "Lunes a viernes 8–14:30",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "cesac-10#consumos-problematicos",
      "title": "CeSAC Nº 10 · Centro Biedak",
      "what": "Atención ambulatoria de consumos problemáticos: psicología, con operadores sociocomunitarios y promotora de salud",
      "address": "Amancio Alcorta 1402",
      "hours": "Lunes a viernes 8:30–14:30",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "hospital-alvarez#consumos-problematicos",
      "title": "Hospital Álvarez",
      "what": "Atención de consumos problemáticos",
      "address": "Aranguren 2701",
      "hours": "Lunes a viernes 8–12:30",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "hospital-fernandez#consumos-problematicos",
      "title": "Hospital Fernández",
      "what": "Atención de consumos problemáticos",
      "address": "Cerviño 3356",
      "hours": "Lunes a viernes 8–18; admisiones 9–14",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "hospital-pinero#consumos-problematicos",
      "title": "Hospital Piñero",
      "what": "Atención de consumos problemáticos",
      "address": "Varela 1301",
      "hours": "9–15; días no publicados",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "hospital-rivadavia#consumos-problematicos",
      "title": "Hospital Rivadavia",
      "what": "Atención de consumos problemáticos",
      "address": "Las Heras 2670",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "estacion-saludable-chacabuco#acercate-consumos",
      "title": "Estación Saludable Parque Chacabuco",
      "what": "Acercate: acompañamiento de consumos problemáticos",
      "address": "Emilio Mitre 995",
      "phone": "11 3161-9798",
      "hours": "Martes y jueves 16–21",
      "how": "Por demanda espontánea.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "estacion-saludable-patricios#acercate-consumos",
      "title": "Estación Saludable Parque Patricios",
      "what": "Acercate: acompañamiento de consumos problemáticos",
      "address": "Patagones y Monteagudo",
      "phone": "11 3161-9798",
      "hours": "Martes y jueves 16–21",
      "how": "Por demanda espontánea.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "id": "csm-3-ameghino",
      "title": "Centro de Salud Mental Nº 3 Arturo Ameghino",
      "what": "Atención de alcoholismo (lunes a viernes de 8 a 12) y de consumos problemáticos (lunes a viernes de 12 a 16)",
      "address": "Av. Córdoba 3120",
      "phone": "11 3723-0224",
      "how": "Consultá al centro cómo es la primera admisión; la página no asegura internación ni cupos.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    }
  ],
  "groups": [
    {
      "id": "aa",
      "title": "Alcohólicos Anónimos de Argentina",
      "what": "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.",
      "who": "Personas que buscan dejar de beber; allegados en reuniones abiertas.",
      "how": "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.",
      "note": "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.",
      "url": "https://aa.org.ar/informacion-primaria/problemas-con-el-alcohol/un-principiante-pregunta/"
    },
    {
      "id": "alanon",
      "title": "Al-Anon Argentina",
      "what": "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.",
      "who": "Familiares y amistades afectados por el consumo de alcohol de otra persona.",
      "how": "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.",
      "note": "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.",
      "url": "https://alanon.org.ar/que-es-alanon/"
    },
    {
      "id": "alateen",
      "title": "Alateen Argentina",
      "what": "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.",
      "who": "Jóvenes aproximadamente entre 12 y 18 años; la institución dice que el rango no es excluyente.",
      "how": "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.",
      "note": "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.",
      "url": "https://alanon.org.ar/alateen/"
    }
  ]
}

/** The places of the map */
export const MH_PLACES: BlockPlace[] = [
  {
    "id": "alvear",
    "name": "Hospital de Emergencias Psiquiátricas Dr. Torcuato de Alvear",
    "kind": "Hospital de salud mental",
    "province": "caba",
    "zone": "La Paternal",
    "address": "Av. Warnes 2630, CABA",
    "phones": [
      [
        "Guardia",
        "4521-5555"
      ],
      [
        "Guardia",
        "4521-5934"
      ]
    ],
    "lat": -34.59691,
    "lng": -58.47445,
    "guard24": true,
    "free": true,
    "mental": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "borda",
    "name": "Hospital Psicoasistencial Dr. José T. Borda",
    "kind": "Hospital de salud mental",
    "province": "caba",
    "zone": "Barracas",
    "address": "Av. Ramón Carrillo 375, CABA",
    "phones": [
      [
        "Guardia",
        "4305-6666"
      ]
    ],
    "lat": -34.63587,
    "lng": -58.38377,
    "guard24": true,
    "free": true,
    "mental": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "moyano",
    "name": "Hospital Neuropsiquiátrico Dr. Braulio A. Moyano",
    "kind": "Hospital de salud mental",
    "province": "caba",
    "zone": "Barracas",
    "address": "Brandsen 2570, CABA",
    "phones": [
      [
        "Guardia",
        "4301-4522"
      ]
    ],
    "lat": -34.64106,
    "lng": -58.38383,
    "guard24": true,
    "free": true,
    "mental": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "tobar",
    "name": "Hospital Infanto Juvenil Dra. Carolina Tobar García",
    "kind": "Hospital de salud mental · niñas, niños y adolescentes",
    "province": "caba",
    "zone": "Barracas",
    "address": "Dr. Ramón Carrillo 315, CABA",
    "phones": [
      [
        "Guardia",
        "4304-6666"
      ]
    ],
    "lat": -34.63566,
    "lng": -58.38209,
    "guard24": true,
    "free": true,
    "mental": true,
    "kids": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito",
      "La página no dice hasta qué edad atiende"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "elizalde",
    "name": "Hospital de Niños Dr. Pedro de Elizalde",
    "kind": "Hospital de niños",
    "province": "caba",
    "zone": "Barracas",
    "address": "Av. Montes de Oca 40, CABA",
    "phones": [
      [
        "Guardia",
        "4307-7491"
      ]
    ],
    "lat": -34.62918,
    "lng": -58.37644,
    "guard24": true,
    "free": true,
    "kids": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito",
      "La página no dice hasta qué edad atiende"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "gutierrez",
    "name": "Hospital General de Niños Dr. Ricardo Gutiérrez",
    "kind": "Hospital de niños",
    "province": "caba",
    "zone": "Recoleta",
    "address": "Gallo 1330, CABA",
    "phones": [
      [
        "Guardia",
        "4962-9232"
      ]
    ],
    "lat": -34.59418,
    "lng": -58.41139,
    "guard24": true,
    "free": true,
    "kids": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito",
      "La página no dice hasta qué edad atiende"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "alvarez",
    "name": "Hospital General de Agudos Dr. Teodoro Álvarez",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Flores",
    "address": "Aranguren 2701, CABA",
    "phones": [
      [
        "Guardia",
        "4612-0326 int. 2947"
      ]
    ],
    "lat": -34.62382,
    "lng": -58.46963,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "argerich",
    "name": "Hospital General de Agudos Dr. Cosme Argerich",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "La Boca",
    "address": "Pi y Margall 750, CABA",
    "phones": [
      [
        "Guardia",
        "4121-0701"
      ],
      [
        "Guardia",
        "4121-0702"
      ]
    ],
    "lat": -34.62811,
    "lng": -58.36557,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "durand",
    "name": "Hospital General de Agudos Dr. Carlos Durand",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Caballito",
    "address": "Av. Díaz Vélez 5044, CABA",
    "phones": [
      [
        "Guardia",
        "4982-0457"
      ]
    ],
    "lat": -34.60887,
    "lng": -58.43801,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "fernandez",
    "name": "Hospital General de Agudos Dr. Juan A. Fernández",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Palermo",
    "address": "Cerviño 3356, CABA",
    "phones": [
      [
        "Guardia",
        "4808-2605"
      ],
      [
        "Guardia",
        "4808-2606"
      ]
    ],
    "lat": -34.58137,
    "lng": -58.40694,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "grierson",
    "name": "Hospital General de Agudos Dra. Cecilia Grierson",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Villa Soldati",
    "address": "Av. Fernández de la Cruz 4402, CABA",
    "phones": [
      [
        "Conmutador",
        "4604-9000"
      ]
    ],
    "lat": -34.67193,
    "lng": -58.45579,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "muniz",
    "name": "Hospital de Enfermedades Infecciosas Dr. Francisco Muñiz",
    "kind": "Hospital especializado",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "Uspallata 2272, CABA",
    "phones": [
      [
        "Guardia",
        "4304-5555"
      ]
    ],
    "lat": -34.63929,
    "lng": -58.39229,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "penna",
    "name": "Hospital General de Agudos Dr. José Penna",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "Pedro Chutro 3380, CABA",
    "phones": [
      [
        "Guardia",
        "4911-7300 int. 230"
      ]
    ],
    "lat": -34.64324,
    "lng": -58.41133,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "pirovano",
    "name": "Hospital General de Agudos Dr. Ignacio Pirovano",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Coghlan",
    "address": "Monroe 3555, CABA",
    "phones": [
      [
        "Guardia",
        "4541-5552"
      ]
    ],
    "lat": -34.56414,
    "lng": -58.47186,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "ramos-mejia",
    "name": "Hospital General de Agudos Dr. José María Ramos Mejía",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Balvanera",
    "address": "Gral. Urquiza 609, CABA",
    "phones": [
      [
        "Guardia",
        "4931-5555"
      ],
      [
        "Guardia",
        "4127-0404"
      ]
    ],
    "lat": -34.61804,
    "lng": -58.41018,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "rivadavia",
    "name": "Hospital General de Agudos Dr. Bernardino Rivadavia",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Recoleta",
    "address": "Av. Las Heras 2670, CABA",
    "phones": [
      [
        "Guardia",
        "4809-2002"
      ]
    ],
    "lat": -34.58469,
    "lng": -58.40168,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "santojanni",
    "name": "Hospital General de Agudos Donación Francisco Santojanni",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Liniers",
    "address": "Pilar 950, CABA",
    "phones": [
      [
        "Guardia",
        "4630-5673"
      ],
      [
        "Guardia",
        "4630-5606"
      ]
    ],
    "lat": -34.64869,
    "lng": -58.51504,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "velez",
    "name": "Hospital General de Agudos Dalmacio Vélez Sarsfield",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Monte Castro",
    "address": "Calderón de la Barca 1550, CABA",
    "phones": [
      [
        "Guardia",
        "4648-2456"
      ]
    ],
    "lat": -34.62546,
    "lng": -58.50781,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "zubizarreta",
    "name": "Hospital General de Agudos Dr. Abel Zubizarreta",
    "kind": "Hospital general",
    "province": "caba",
    "zone": "Villa Devoto",
    "address": "Nueva York 3952, CABA",
    "phones": [
      [
        "Guardia",
        "4501-5555"
      ]
    ],
    "lat": -34.60015,
    "lng": -58.51086,
    "guard24": true,
    "free": true,
    "facts": [
      "Guardia de salud mental las 24 h, los 365 días",
      "Hospital público y gratuito"
    ],
    "source": [
      {
        "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
      },
      {
        "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "cesac-1",
    "name": "CeSAC Nº 1 · Barracas 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Barracas",
    "address": "Vélez Sarsfield 1271, CABA",
    "phones": [
      [
        "Centro",
        "2821-3601"
      ]
    ],
    "lat": -34.649014,
    "lng": -58.38929,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 1 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-1"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-3",
    "name": "CeSAC Nº 3 · Villa Lugano 9",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Soldado de la Frontera 5144, CABA",
    "phones": [
      [
        "Centro",
        "2821-3603"
      ],
      [
        "Centro",
        "11 5048-1097"
      ]
    ],
    "lat": -34.68463871592785,
    "lng": -58.464336857206874,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología adultos · Psicología niños y adolescentes",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 3 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-3"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-4",
    "name": "CeSAC Nº 4 · Mataderos 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Mataderos",
    "address": "Av. J. B Alberdi 6300, CABA",
    "phones": [
      [
        "Centro",
        "2821-3604"
      ]
    ],
    "lat": -34.655044,
    "lng": -58.506343,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Salud mental infantil, de adolescentes y de adultos",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 4 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-4"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-5",
    "name": "CeSAC Nº 5 · Villa Lugano 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Av. Piedrabuena 3140, CABA",
    "phones": [
      [
        "Centro",
        "2821-3605"
      ]
    ],
    "lat": -34.670523,
    "lng": -58.495309,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 5 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-5"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-6",
    "name": "CeSAC Nº 6 · Villa Soldati 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Soldati",
    "address": "Mariano Acosta 3673 (esq. Av. Intendente Rabanal, ex Av. Roca), CABA",
    "phones": [
      [
        "Centro",
        "2821-3606"
      ]
    ],
    "lat": -34.665617,
    "lng": -58.442481,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 6 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-6"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-7",
    "name": "CeSAC Nº 7 · Villa Lugano 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "2 de Abril de 1982 6850, CABA",
    "phones": [
      [
        "Centro",
        "2821-3607"
      ]
    ],
    "lat": -34.67882400000001,
    "lng": -58.49190000000002,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 7 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-7"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-10",
    "name": "CeSAC Nº 10 · Parque Patricios 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "Amancio Alcorta 1402, CABA",
    "phones": [
      [
        "Centro",
        "2821-3610"
      ]
    ],
    "lat": -34.633331,
    "lng": -58.383729,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 10 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-10"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-11",
    "name": "CeSAC Nº 11 · Balvanera",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Balvanera",
    "address": "Agüero 940, CABA",
    "phones": [
      [
        "Centro",
        "2821-3611"
      ]
    ],
    "lat": -34.599002,
    "lng": -58.410552,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 11 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-11"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-12",
    "name": "CeSAC Nº 12 · Villa Urquiza",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Urquiza",
    "address": "Olazábal 3960, CABA",
    "phones": [
      [
        "Centro",
        "2821-3612"
      ]
    ],
    "lat": -34.569783,
    "lng": -58.474324,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 12 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-12"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-13",
    "name": "CeSAC Nº 13 · Parque Avellaneda",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Parque Avellaneda",
    "address": "Directorio 4210, CABA",
    "phones": [
      [
        "Centro",
        "2821-3613"
      ]
    ],
    "lat": -34.643246,
    "lng": -58.482101,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 13 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-13"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-14",
    "name": "CeSAC Nº 14 · Villa Lugano 3",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Saravia 2486, CABA",
    "phones": [
      [
        "Centro",
        "2821-3614"
      ]
    ],
    "lat": -34.660308,
    "lng": -58.474335,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría · espacio de salud mental con derivación interna",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 14 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-14"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-16",
    "name": "CeSAC Nº 16 · Barracas 3",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Barracas",
    "address": "Osvaldo Cruz 2055, CABA",
    "phones": [
      [
        "Centro",
        "2821-3616"
      ]
    ],
    "lat": -34.651832,
    "lng": -58.374717,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Salud mental · Taller de salud mental",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 16 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-16"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-19",
    "name": "CeSAC Nº 19 · Flores 1",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Flores",
    "address": "Curapaligüe 1905, CABA",
    "phones": [
      [
        "Centro",
        "2821-3619"
      ]
    ],
    "lat": -34.642936,
    "lng": -58.442266,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría · Psiquiatría infantil",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 19 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-19"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-20",
    "name": "CeSAC Nº 20 · Flores 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Flores",
    "address": "Ana María Janer y Charrua 2330, CABA",
    "phones": [
      [
        "Centro",
        "2821-3620"
      ]
    ],
    "lat": -34.649532,
    "lng": -58.438062,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 20 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-20"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-22",
    "name": "CeSAC Nº 22 · La Paternal 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "La Paternal",
    "address": "Fragata Pres. Sarmiento 2152, CABA",
    "phones": [
      [
        "Centro",
        "2821-3622"
      ]
    ],
    "lat": -34.600874,
    "lng": -58.459046,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 22 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-22"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-23",
    "name": "CeSAC Nº 23 · Villa Luro",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Luro",
    "address": "Bacacay 5640, CABA",
    "phones": [
      [
        "Centro",
        "2821-3623"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 23 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-23"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-26",
    "name": "CeSAC Nº 26 · Palermo 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Palermo",
    "address": "Gurruchaga 1939, CABA",
    "phones": [
      [
        "Centro",
        "2821-3626"
      ]
    ],
    "lat": -34.58715,
    "lng": -58.425701,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 26 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-26"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-28",
    "name": "CeSAC Nº 28 · Villa Lugano 10",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Santander 5955, CABA",
    "phones": [
      [
        "Centro",
        "2821-3628"
      ]
    ],
    "lat": -34.673065,
    "lng": -58.485932,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 28 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-28"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-30",
    "name": "CeSAC Nº 30 · Barracas 4",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Barracas",
    "address": "Av. Amancio Alcorta 3100, CABA",
    "phones": [
      [
        "Centro",
        "2821-3630"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 30 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-30"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-32",
    "name": "CeSAC Nº 32 · Nueva Pompeya",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Nueva Pompeya",
    "address": "Charrúa 2900, CABA",
    "phones": [
      [
        "Centro",
        "2821-3632"
      ]
    ],
    "lat": -34.654267,
    "lng": -58.431164,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología infanto juvenil",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 32 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-32"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-33",
    "name": "CeSAC Nº 33 · Palermo 3",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Palermo",
    "address": "Córdoba 5741, CABA",
    "phones": [
      [
        "Centro",
        "2821-3633"
      ]
    ],
    "lat": -34.58645,
    "lng": -58.441725,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 33 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-33"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-34",
    "name": "CeSAC Nº 34 · La Paternal",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "La Paternal",
    "address": "Gral. José G. Artigas 2262, CABA",
    "phones": [
      [
        "Centro",
        "2821-3634"
      ]
    ],
    "lat": -34.606536,
    "lng": -58.478148,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psiquiatría de adultos · Psicología de niños y adolescentes · Trabajo social · Farmacia y enfermería",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 34 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-34"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-35",
    "name": "CeSAC Nº 35 · Barracas 6",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Barracas",
    "address": "Osvaldo Cruz y Zavaleta, CABA",
    "phones": [
      [
        "Centro",
        "2821-3635"
      ]
    ],
    "lat": -34.656376,
    "lng": -58.399536,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 35 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-35"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-36",
    "name": "CeSAC Nº 36 · Floresta",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Floresta",
    "address": "Mercedes 1371/ 79, CABA",
    "phones": [
      [
        "Centro",
        "2821-3636"
      ]
    ],
    "lat": -34.621937,
    "lng": -58.491802,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 36 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-36"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-37",
    "name": "CeSAC Nº 37 · Mataderos 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Mataderos",
    "address": "Av. los Corrales 6999 esquina Carhué, CABA",
    "phones": [
      [
        "Centro",
        "2821-3637"
      ]
    ],
    "lat": -34.66567686615979,
    "lng": -58.50417537376841,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psiquiatría · Psicología · Talleres de salud mental",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 37 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-37"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-38",
    "name": "CeSAC Nº 38 · Almagro",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Almagro",
    "address": "Av. Medrano 350, CABA",
    "phones": [
      [
        "Centro",
        "2821-3638"
      ]
    ],
    "lat": -34.606611,
    "lng": -58.421427,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 38 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-38"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-39",
    "name": "CeSAC Nº 39 · Parque Patricios 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Parque Patricios",
    "address": "24 de noviembre 1679, CABA",
    "phones": [
      [
        "Centro",
        "2821-3639"
      ]
    ],
    "lat": -34.631005,
    "lng": -58.409827,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 39 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-39"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-40",
    "name": "CeSAC Nº 40 · Flores 4",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Flores",
    "address": "Esteban Bonorino 1729, CABA",
    "phones": [
      [
        "Centro",
        "2821-3640"
      ]
    ],
    "lat": -34.645072,
    "lng": -58.445442,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 40 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-40"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-41",
    "name": "CeSAC Nº 41 · La Boca 2",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "La Boca",
    "address": "Ministro Brin 843, CABA",
    "phones": [
      [
        "Centro",
        "2821-3641"
      ],
      [
        "Centro",
        "4361-8736"
      ]
    ],
    "lat": -34.63132509345374,
    "lng": -58.35792934227024,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Salud Mental Niños y Adultos",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 41 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-41"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-42",
    "name": "CeSAC Nº 42 · Boedo",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Boedo",
    "address": "Av. La Plata 2241, CABA",
    "phones": [
      [
        "Centro",
        "11 2821-3642"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 42 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-42"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-43",
    "name": "CeSAC Nº 43 · Villa Lugano 6",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Fonrouge 4377, CABA",
    "phones": [
      [
        "Centro",
        "2821-3643"
      ]
    ],
    "lat": -34.677722,
    "lng": -58.466531,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología · Psiquiatría infantojuvenil · Espacio de salud mental",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 43 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-43"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-44",
    "name": "CeSAC Nº 44 · Villa Lugano 7",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Villa Lugano",
    "address": "Saraza 4202, CABA",
    "phones": [
      [
        "Centro",
        "4601-3686"
      ]
    ],
    "lat": -34.660579,
    "lng": -58.467459,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 44 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-44"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "cesac-49",
    "name": "CeSAC Nº 49 · Barracas 7",
    "kind": "Centro de salud (CeSAC)",
    "province": "caba",
    "zone": "Barracas",
    "address": "Agustín Magaldi 2189 y Camino de Sirga, CABA",
    "phones": [
      [
        "Centro",
        "2821-3649"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Psicología",
      "Atención programada: la página no publica horarios",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "CeSAC Nº 49 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-49"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "csm-1",
    "name": "Centro de Salud Mental Nº 1",
    "kind": "Centro de salud mental",
    "province": "caba",
    "zone": "",
    "address": "Manuela Pedraza 1558, CABA",
    "phones": [
      [
        "Centro",
        "11 2821-3588"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": true,
    "prog": true,
    "facts": [
      "Atención ambulatoria para personas de todas las edades: orientación en salud mental, psicoterapia individual, grupal y familiar, tratamiento psiquiátrico, tratamiento de adicciones, orientación a padres, hospital de día infantojuvenil y de adultos, y farmacia",
      "Se atiende por demanda espontánea o por derivación de la red (área de responsabilidad). Consultá el horario de admisión.",
      "Sin pago directo en los servicios estatales de la Ciudad (Ley 153)"
    ],
    "source": [
      {
        "label": "Centro de Salud Mental Nº 1 · Gobierno de la Ciudad de Buenos Aires",
        "url": "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/csm-no-1"
      },
      {
        "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
        "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
      }
    ]
  },
  {
    "id": "bonaparte",
    "name": "Hospital Nacional Laura Bonaparte",
    "kind": "Hospital de salud mental (Nación)",
    "province": "caba",
    "zone": "",
    "address": "Combate de los Pozos 2099, CABA",
    "phones": [
      [
        "Guardia",
        "(11) 4304-6356 int. 1155"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": true,
    "free": null,
    "prog": true,
    "mental": true,
    "facts": [
      "Guardia interdisciplinaria: 24 horas, todos los días (mayores de 18 años según circuito publicado)",
      "Admisión y tratamiento de adultos: Admisión lunes a viernes 8:00-14:00; consultorios externos 8:00-20:00 (mayores de 18 años según circuito publicado)",
      "Atención infantojuvenil: Admisión / consultas lunes a viernes 8:00-14:00 (hasta 17 años)"
    ],
    "note": "Sin pago directo para quienes tienen ciudadanía argentina o residencia permanente (art. 7.a, Ley 26.657). La Resolución 1066/2026 regula el cobro a personas extranjeras sin residencia permanente en los hospitales nacionales; las urgencias no se pueden negar ni demorar por trámites.",
    "source": [
      {
        "label": "Hospital Nacional Laura Bonaparte: acceso a los servicios · argentina.gob.ar",
        "url": "https://www.argentina.gob.ar/salud/hospitalbonaparte/acceso-los-servicios-de-salud"
      }
    ]
  },
  {
    "id": "fiorito",
    "name": "Hospital Dr. Pedro Fiorito",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Avellaneda",
    "address": "Avellaneda, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.66675,
    "lng": -58.36584,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "peron",
    "name": "Hospital Presidente Perón",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Avellaneda",
    "address": "Avellaneda, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.68109,
    "lng": -58.35812,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "evita-pueblo",
    "name": "Hospital Evita Pueblo",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Berazategui",
    "address": "Berazategui, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.78192,
    "lng": -58.21204,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "narciso-lopez",
    "name": "Hospital Narciso López",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Lanús",
    "address": "Lanús, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.7038,
    "lng": -58.38257,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "gandulfo",
    "name": "Hospital Luisa C. de Gandulfo",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Lomas de Zamora",
    "address": "Lomas de Zamora, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.76229,
    "lng": -58.39306,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "iriarte",
    "name": "Hospital Dr. Isidoro Iriarte",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Quilmes",
    "address": "Quilmes, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.7203,
    "lng": -58.24636,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "mi-pueblo",
    "name": "Hospital Mi Pueblo",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Florencio Varela",
    "address": "Florencio Varela, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.81995,
    "lng": -58.27219,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "belgrano",
    "name": "Hospital Manuel Belgrano",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "San Martín",
    "address": "San Martín, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.54983,
    "lng": -58.52569,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "balestrini",
    "name": "Hospital Dr. Alberto Balestrini",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "La Matanza",
    "address": "La Matanza, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.7073,
    "lng": -58.53336,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "malvinas",
    "name": "Hospital Héroes de Malvinas",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Merlo",
    "address": "Merlo, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.66922,
    "lng": -58.74285,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "mercante",
    "name": "Hospital Gobernador Domingo Mercante",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "José C. Paz",
    "address": "José C. Paz, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.51669,
    "lng": -58.7406,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "cordero",
    "name": "Hospital Petrona V. de Cordero",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "San Fernando",
    "address": "San Fernando, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.44865,
    "lng": -58.55245,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "guemes",
    "name": "Hospital Luis Güemes",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "Morón (Haedo)",
    "address": "Morón (Haedo), Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.64183,
    "lng": -58.57981,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "san-roque",
    "name": "Hospital San Roque",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "La Plata (Gonnet)",
    "address": "La Plata (Gonnet), Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.89153,
    "lng": -58.00722,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "rossi",
    "name": "Hospital Rodolfo Rossi",
    "kind": "Hospital general",
    "province": "buenos-aires",
    "zone": "La Plata",
    "address": "La Plata, Provincia de Buenos Aires",
    "phones": [],
    "lat": -34.89652,
    "lng": -57.95489,
    "guard24": false,
    "free": null,
    "facts": [
      "Equipo de salud mental en la guardia (psiquiatría, psicología y trabajo social), según el Ministerio de Salud bonaerense en 2021",
      "Confirmá antes de ir: el dato es de 2021"
    ],
    "source": [
      {
        "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
        "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "el-sauce",
    "name": "Hospital El Sauce",
    "kind": "Hospital de salud mental",
    "province": "mendoza",
    "zone": "Guaymallén",
    "address": "Guaymallén, Mendoza",
    "phones": [],
    "lat": -32.86269,
    "lng": -68.74306,
    "guard24": true,
    "free": null,
    "mental": true,
    "facts": [
      "Atención las 24 horas, según el Gobierno de Mendoza (marzo de 2025)",
      "Desde los 18 años"
    ],
    "source": [
      {
        "label": "Salud Mental aumenta las guardias interdisciplinarias (2025) · Gobierno de Mendoza",
        "url": "https://www.mendoza.gov.ar/prensa/salud-mental-aumenta-las-guardias-interdisciplinarias-en-hospitales-generales/"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "pereyra",
    "name": "Hospital Dr. Carlos Pereyra",
    "kind": "Hospital de salud mental",
    "province": "mendoza",
    "zone": "Ciudad de Mendoza",
    "address": "Ciudad de Mendoza, Mendoza",
    "phones": [],
    "lat": -32.8705,
    "lng": -68.82875,
    "guard24": true,
    "free": null,
    "mental": true,
    "facts": [
      "Atención las 24 horas, según el Gobierno de Mendoza (marzo de 2025)",
      "Desde los 18 años"
    ],
    "source": [
      {
        "label": "Salud Mental aumenta las guardias interdisciplinarias (2025) · Gobierno de Mendoza",
        "url": "https://www.mendoza.gov.ar/prensa/salud-mental-aumenta-las-guardias-interdisciplinarias-en-hospitales-generales/"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "central-mza",
    "name": "Hospital Central",
    "kind": "Hospital general",
    "province": "mendoza",
    "zone": "Ciudad de Mendoza",
    "address": "Ciudad de Mendoza, Mendoza",
    "phones": [],
    "lat": -32.89212,
    "lng": -68.83293,
    "guard24": false,
    "free": null,
    "facts": [
      "Guardia interdisciplinaria de salud mental todos los días, según el Gobierno de Mendoza (marzo de 2025)"
    ],
    "source": [
      {
        "label": "Salud Mental aumenta las guardias interdisciplinarias (2025) · Gobierno de Mendoza",
        "url": "https://www.mendoza.gov.ar/prensa/salud-mental-aumenta-las-guardias-interdisciplinarias-en-hospitales-generales/"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "lagomaggiore",
    "name": "Hospital Luis Lagomaggiore",
    "kind": "Hospital general",
    "province": "mendoza",
    "zone": "Ciudad de Mendoza",
    "address": "Ciudad de Mendoza, Mendoza",
    "phones": [],
    "lat": -32.87235,
    "lng": -68.86488,
    "guard24": false,
    "free": null,
    "facts": [
      "Guardia interdisciplinaria de salud mental todos los días, según el Gobierno de Mendoza (marzo de 2025)",
      "Hay un documento de 2024 con otro horario: confirmá antes de ir"
    ],
    "source": [
      {
        "label": "Salud Mental aumenta las guardias interdisciplinarias (2025) · Gobierno de Mendoza",
        "url": "https://www.mendoza.gov.ar/prensa/salud-mental-aumenta-las-guardias-interdisciplinarias-en-hospitales-generales/"
      },
      {
        "label": "Ubicaciones aproximadas · OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright"
      }
    ]
  },
  {
    "id": "cordoba-tramas",
    "name": "Tramas",
    "kind": "Atención en salud mental",
    "province": "cordoba",
    "zone": "Córdoba",
    "address": "San Jerónimo 2573",
    "phones": [
      [
        "Contacto",
        "351 2266003"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención individual y grupal ambulatoria con equipo interdisciplinario.",
      "Horario: Lunes a viernes 8:00-18:00",
      "Mayores de 16 años con domicilio en Córdoba Capital.",
      "Para la admisión, consultá en la sede o en la línea municipal."
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba - Tramas",
        "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
      }
    ]
  },
  {
    "id": "cordoba-lazos",
    "name": "Lazos",
    "kind": "Atención en salud mental",
    "province": "cordoba",
    "zone": "Córdoba",
    "address": "Bv. Castro Barros 559",
    "phones": [
      [
        "Contacto",
        "351 5081286"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Escucha, orientación, acompañamiento, grupos y actividades terapéuticas.",
      "Horario: Lunes a viernes 8:00-18:00",
      "Residentes de Córdoba Capital.",
      "Para la admisión, consultá en la sede o en la línea municipal."
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba - Lazos",
        "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
      }
    ]
  },
  {
    "id": "cordoba-aldeas",
    "name": "Las Aldeas",
    "kind": "Atención en salud mental",
    "province": "cordoba",
    "zone": "Córdoba",
    "address": "Gabriel Ortega 8050",
    "phones": [
      [
        "Contacto",
        "351 6100335"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Acompañamiento comunitario en salud mental y adicciones.",
      "Residentes de Córdoba Capital.",
      "Para la admisión, consultá en la sede o en la línea municipal."
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba - Las Aldeas",
        "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
      }
    ]
  },
  {
    "id": "cordoba-jaire",
    "name": "Jaire",
    "kind": "Atención en salud mental",
    "province": "cordoba",
    "zone": "Córdoba",
    "address": "Ancasti 5750",
    "phones": [
      [
        "Contacto",
        "351 6100536"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Acompañamiento ambulatorio de consumos y actividades comunitarias.",
      "Residentes de Córdoba Capital con necesidades de acompañamiento.",
      "Para la admisión, consultá en la sede o en la línea municipal."
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba - Jaire",
        "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
      }
    ]
  },
  {
    "id": "cordoba-pec",
    "name": "PEC Yapeyú",
    "kind": "Atención en salud mental",
    "province": "cordoba",
    "zone": "Córdoba",
    "address": "Bailén 196",
    "phones": [
      [
        "Contacto",
        "351 5907343"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Primera escucha y atención terapéutica individual y grupal.",
      "Residentes de Córdoba Capital.",
      "Para la admisión, consultá en la sede o en la línea municipal."
    ],
    "source": [
      {
        "label": "Municipalidad de Córdoba - PEC Yapeyú",
        "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
      }
    ]
  },
  {
    "id": "crespo-psico-minguillon",
    "name": "Centro Comunitario Dr. Salustiano Minguillón",
    "kind": "Atención en salud mental",
    "province": "entre-rios",
    "zone": "Crespo",
    "address": "España 748",
    "phones": [
      [
        "Contacto",
        "4951160 int. 237"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención psicológica en CAPS municipales.",
      "Horario: Lunes 14:00-18:00",
      "Para la admisión, consultá en el centro de salud o en Desarrollo Humano de Crespo."
    ],
    "source": [
      {
        "label": "Crespo - Centro Comunitario Dr. Salustiano Minguillón",
        "url": "https://www.crespo.gob.ar/salud-mental-y-adicciones/"
      }
    ]
  },
  {
    "id": "crespo-psico-san-miguel",
    "name": "Centro de Salud Municipal San Miguel",
    "kind": "Atención en salud mental",
    "province": "entre-rios",
    "zone": "Crespo",
    "address": "Los Reseros y Linares Cardozo",
    "phones": [
      [
        "Contacto",
        "4951160 int. 235"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención psicológica en CAPS municipales.",
      "Horario: Lunes 8:00-12:00; miércoles 14:00-19:00",
      "Para la admisión, consultá en el centro de salud o en Desarrollo Humano de Crespo."
    ],
    "source": [
      {
        "label": "Crespo - Centro de Salud Municipal San Miguel",
        "url": "https://www.crespo.gob.ar/salud-mental-y-adicciones/"
      }
    ]
  },
  {
    "id": "crespo-psico-nido-goldenberg",
    "name": "Edificio NIDO Dr. Adolfo Goldenberg",
    "kind": "Atención en salud mental",
    "province": "entre-rios",
    "zone": "Crespo",
    "address": "Mendoza 855",
    "phones": [
      [
        "Contacto",
        "4951160 int. 216"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención psicológica en CAPS municipales.",
      "Horario: Martes 8:00-12:00; miércoles 14:30-18:30; viernes 8:00-12:00",
      "Para la admisión, consultá en el centro de salud o en Desarrollo Humano de Crespo."
    ],
    "source": [
      {
        "label": "Crespo - Edificio NIDO Dr. Adolfo Goldenberg",
        "url": "https://www.crespo.gob.ar/salud-mental-y-adicciones/"
      }
    ]
  },
  {
    "id": "larioja-infantil",
    "name": "Centro de Día Comunitario Infantil",
    "kind": "Atención en salud mental",
    "province": "la-rioja",
    "zone": "La Rioja",
    "address": "El Chacho s/n, barrio Hospital",
    "phones": [
      [
        "Contacto",
        "0380-154250599"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Dispositivo ambulatorio para promoción, prevención, tratamiento y asistencia.",
      "Horario: Lunes a viernes 8:00-12:00 y 14:00-16:00",
      "Niñas/os y adolescentes de 3 a 14 años y 11 meses.",
      "Consultá la admisión en cada sede: las páginas no publican cupos."
    ],
    "source": [
      {
        "label": "La Rioja - Centro de Día Comunitario Infantil",
        "url": "https://larioja.gob.ar/salud/saludmentalyadicciones/"
      }
    ]
  },
  {
    "id": "larioja-hospital-dia",
    "name": "Hospital de Día en Adicciones",
    "kind": "Atención en salud mental",
    "province": "la-rioja",
    "zone": "La Rioja",
    "address": "Dalmacio Vélez y Adolfo E. Dávila 416",
    "phones": [
      [
        "Contacto",
        "0380-154250602 / 0380-4439439"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Orientación, evaluación y tratamiento ambulatorio.",
      "Horario: Lunes a viernes 8:00-12:00 y 14:00-18:00",
      "Mayores de 14 años con consumos problemáticos.",
      "Consultá la admisión en cada sede: las páginas no publican cupos."
    ],
    "source": [
      {
        "label": "La Rioja - Hospital de Día en Adicciones",
        "url": "https://larioja.gob.ar/salud/saludmentalyadicciones/"
      }
    ]
  },
  {
    "id": "larioja-das",
    "name": "Dispositivo Asistencial en Socioadicciones",
    "kind": "Atención en salud mental",
    "province": "la-rioja",
    "zone": "La Rioja",
    "address": "Santa Fe 1199, esquina Coronel Lagos",
    "phones": [
      [
        "Contacto",
        "3804-154250601"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención y asistencia por socioadicciones.",
      "Horario: Lunes a viernes 8:00-13:00 y 14:00-19:00",
      "Personas con juego patológico, uso problemático de tecnología y otras socioadicciones.",
      "Consultá la admisión en cada sede: las páginas no publican cupos."
    ],
    "source": [
      {
        "label": "La Rioja - Dispositivo Asistencial en Socioadicciones",
        "url": "https://larioja.gob.ar/salud/saludmentalyadicciones/"
      }
    ]
  },
  {
    "id": "larioja-munay",
    "name": "Centro Terapéutico Munay",
    "kind": "Atención en salud mental",
    "province": "la-rioja",
    "zone": "La Rioja",
    "address": "Calle Principal s/n, San Lorenzo",
    "phones": [
      [
        "Contacto",
        "03825-660191"
      ]
    ],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Prevención, orientación y tratamiento ambulatorio.",
      "Horario: Lunes a viernes 8:00-13:00 y 14:00-19:00",
      "Personas con consumos problemáticos.",
      "Consultá la admisión en cada sede: las páginas no publican cupos."
    ],
    "source": [
      {
        "label": "La Rioja - Centro Terapéutico Munay",
        "url": "https://larioja.gob.ar/salud/saludmentalyadicciones/"
      }
    ]
  },
  {
    "id": "neuquen-escucha-joven",
    "name": "Escucha Joven",
    "kind": "Atención en salud mental",
    "province": "neuquen",
    "zone": "Neuquén",
    "address": "Picún Leufú 301",
    "phones": [],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Espacio grupal de contención e intercambio coordinado por profesionales de salud.",
      "Horario: Martes 16:00-17:30",
      "Jóvenes de 18 a 35 años.",
      "Sin inscripción previa según publicación."
    ],
    "source": [
      {
        "label": "Neuquén - Escucha Joven",
        "url": "https://www.neuqueninforma.com.ar/noticias/2026/02/23/255285-invitan-a-participar-de-un-nuevo-espacio-de-escucha-joven"
      }
    ]
  },
  {
    "id": "tucuman-hospital-nino-jesus",
    "name": "Hospital del Niño Jesús",
    "kind": "Atención en salud mental",
    "province": "tucuman",
    "zone": "Tucumán",
    "address": "Sabín 750, San Miguel de Tucumán",
    "phones": [],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Hospital pediátrico de 3º nivel, el único exclusivo de pediatría de la provincia. Entre sus servicios figuran Salud Mental y Psicología, y tiene guardia de emergencia las 24 horas.",
      "Niñas, niños y adolescentes menores de 14 años.",
      "La página no explica cómo se pide un turno propio.",
      "La página no informa el costo y no publica teléfono ni horarios de consultorio."
    ],
    "source": [
      {
        "label": "Hospital del Niño Jesús",
        "url": "https://msptucuman.gov.ar/hospitales/hospital-del-nino-jesus/"
      }
    ]
  },
  {
    "id": "corrientes-psico-genero",
    "name": "Atención psicológica por género y diversidad",
    "kind": "Atención en salud mental",
    "province": "corrientes",
    "zone": "Corrientes",
    "address": "Catamarca 771 (inicio del trámite)",
    "phones": [],
    "lat": null,
    "lng": null,
    "guard24": false,
    "free": null,
    "prog": true,
    "facts": [
      "Atención psicológica individual por violencia de género / diversidad.",
      "Horario: Trámite presencial: lunes a viernes 8:00-12:00; horario de sesiones no publicado",
      "Ciudadanas y ciudadanos de Corrientes que hayan sufrido violencia de género y diversidad.",
      "Solicitar por correo o iniciar presencialmente; luego coordinan por teléfono."
    ],
    "source": [
      {
        "label": "Municipalidad de Corrientes - Atención psicológica por género y diversidad",
        "url": "https://ciudaddecorrientes.gov.ar/tramites/politicas-sociales/atenci-n-psicol-gica-individual-por-tema-de-g-nero-y-diversidad"
      }
    ]
  }
]

/** Every province, in the order of the map's selector */
export const MH_PROVINCES: [string, string][] = [["caba", "Ciudad de Buenos Aires"], ["buenos-aires", "Buenos Aires"], ["catamarca", "Catamarca"], ["chaco", "Chaco"], ["chubut", "Chubut"], ["cordoba", "Córdoba"], ["corrientes", "Corrientes"], ["entre-rios", "Entre Ríos"], ["formosa", "Formosa"], ["jujuy", "Jujuy"], ["la-pampa", "La Pampa"], ["la-rioja", "La Rioja"], ["mendoza", "Mendoza"], ["misiones", "Misiones"], ["neuquen", "Neuquén"], ["rio-negro", "Río Negro"], ["salta", "Salta"], ["san-juan", "San Juan"], ["san-luis", "San Luis"], ["santa-cruz", "Santa Cruz"], ["santa-fe", "Santa Fe"], ["santiago-del-estero", "Santiago del Estero"], ["tierra-del-fuego", "Tierra del Fuego"], ["tucuman", "Tucumán"]]

/** Respirá y conectá: the two breathing exercises and grounding */
export const MH_BREATHING: Record<string, BreathingExercise> = {
  "478": {
    "name": "Respiración 4-7-8",
    "short": "4-7-8",
    "lead": "Inhalás en 4, mantenés en 7 y soltás en 8. Contar ayuda a llevar la cabeza a otro lado que no sean las preocupaciones.",
    "before": [
      "Sentate o acostate cómodo.",
      "Apoyá la punta de la lengua detrás de los dientes de arriba y dejala ahí.",
      "Empezá soltando todo el aire por la boca."
    ],
    "phases": [
      [
        "Inhalá por la nariz",
        4,
        "in"
      ],
      [
        "Mantené el aire",
        7,
        "hold"
      ],
      [
        "Soltá por la boca",
        8,
        "out"
      ]
    ],
    "cycles": 4,
    "note": "Al principio podés sentir un poco de mareo o falta de aire: es por respirar más lento. Si te pasa, volvé a respirar normal."
  },
  "slow": {
    "name": "Respiración lenta",
    "short": "Lenta",
    "lead": "Respirar hondo y parejo, contando hasta 5 al entrar y hasta 5 al salir. Sirve para el estrés, la ansiedad y el pánico.",
    "before": [
      "Podés hacerlo parado, sentado o acostado. Aflojá la ropa que te apriete.",
      "Dejá que el aire baje hasta la panza, sin forzarlo.",
      "Entrá el aire por la nariz y soltalo por la boca."
    ],
    "phases": [
      [
        "Inhalá",
        5,
        "in"
      ],
      [
        "Exhalá",
        5,
        "out"
      ]
    ],
    "cycles": 30,
    "note": "Hacelo al menos 5 minutos. Rinde más si lo hacés todos los días."
  }
}
export const MH_GROUNDING: { name: string, lead: string, steps: GroundingStep[] } = {
  "name": "Poner los pies en la tierra",
  "lead": "Cuando los pensamientos y las emociones se vuelven una tormenta, este ejercicio te ayuda a bajar a tierra. No hace desaparecer la tormenta: te ayuda a estar a salvo hasta que pase.",
  "steps": [
    {
      "title": "Notá",
      "text": "Prestá atención a cómo te sentís y en qué estás pensando. No hace falta cambiarlo: solo notarlo."
    },
    {
      "title": "Bajá el ritmo",
      "text": "Vaciá los pulmones del todo y dejá que se llenen lo más despacio que puedas. Apretá despacio los pies contra el piso, estirá los brazos o juntá las manos."
    },
    {
      "title": "Mirá",
      "text": "Mirá dónde estás. ¿Qué 5 cosas ves?",
      "count": 5
    },
    {
      "title": "Escuchá",
      "text": "¿Qué 3 o 4 cosas escuchás?",
      "count": 3
    },
    {
      "title": "Olé y tocá",
      "text": "Respirá el aire: ¿qué olés? Tocá tus rodillas o lo que tengas debajo: ¿cómo se siente en los dedos?"
    },
    {
      "title": "Volvé",
      "text": "Notá dónde estás y qué estás haciendo. Además de lo que sentís, hay un mundo alrededor que podés ver, escuchar y tocar."
    }
  ]
}

/** Relajación muscular: [part, what to do] of each step, and the seconds */
export const MH_MUSCLES: { name: string, lead: string, tense: number, relax: number, before: string[], steps: [string, string, number?][] } = {
  "name": "Relajación muscular progresiva",
  "lead": "Tensás un grupo de músculos, lo soltás y notás la diferencia. Así, de a uno, hasta aflojar todo el cuerpo. Lleva unos 5 minutos.",
  "tense": 5,
  "relax": 15,
  "before": [
    "Sentate en un lugar cómodo y respirá tranquilo, con una mano sobre la panza.",
    "Tensá con fuerza, pero sin que duela.",
    "Si algún paso te molesta o tenés una lesión, salteálo."
  ],
  "steps": [
    [
      "Cejas",
      "Levantalas lo más alto que puedas, como si estuvieras muy sorprendido."
    ],
    [
      "Ojos",
      "Apretá los párpados, como cuando te da el sol de frente."
    ],
    [
      "Boca",
      "Abrila lo más grande que puedas."
    ],
    [
      "Cuello",
      "Llevá la cabeza para atrás, como mirando el techo."
    ],
    [
      "Hombros",
      "Subilos como si quisieras tocarte las orejas."
    ],
    [
      "Pecho",
      "Inhalá hondo hasta llenar los pulmones y mantené el aire.",
      10
    ],
    [
      "Panza",
      "Metela, como si quisieras tocarte la columna."
    ],
    [
      "Brazos",
      "Empujá hacia abajo la superficie donde los apoyás."
    ],
    [
      "Bíceps",
      "Llevá las manos hacia los hombros y flexioná los brazos."
    ],
    [
      "Manos",
      "Cerrá los puños con fuerza."
    ],
    [
      "Muslos",
      "Apoyá la parte de adelante de los pies y empujá el piso."
    ],
    [
      "Piernas",
      "Estiralas hacia adelante con la punta de los pies mirando al techo."
    ]
  ]
}

/** Ejercicios de calma (OMS guide) */
export const MH_CALM: { lead: string, items: { id: string, icon: string, title: string, when: string, steps: string[] }[] } = {
  "lead": "Ejercicios cortos de la guía de la OMS para momentos de estrés. Se pueden hacer en cualquier lugar, en pocos minutos.",
  "items": [
    {
      "id": "nombrar",
      "icon": "tag",
      "title": "Notá y nombrá",
      "when": "Cuando un pensamiento o una emoción te engancha",
      "steps": [
        "Date cuenta de que algo te enganchó.",
        "Nombralo en silencio: «Noto que hay enojo», «Noto un pensamiento difícil sobre mi familia», «Noto una presión en el pecho».",
        "Volvé a lo que estabas haciendo y ponele toda tu atención."
      ]
    },
    {
      "id": "taza",
      "icon": "coffee",
      "title": "Una taza con toda tu atención",
      "when": "Para practicar estar en el presente",
      "steps": [
        "Prepará un té, un mate, un café o un vaso de agua.",
        "Miralo como si fuera la primera vez: el color, el olor.",
        "Tomalo lo más despacio que puedas: la temperatura, el sabor que se va.",
        "Si te distraés, volvé a la bebida."
      ]
    },
    {
      "id": "cielo",
      "icon": "cloud",
      "title": "Hacer lugar, como el cielo",
      "when": "Cuando algo duele y no se va",
      "steps": [
        "Notá y nombrá en silencio lo que sentís.",
        "Observalo con curiosidad, como si fuera el clima.",
        "El cielo siempre tiene lugar para el clima, por fuerte que sea, y el clima siempre cambia.",
        "Dejá que esté ahí, sin pelearte con eso."
      ]
    },
    {
      "id": "amable",
      "icon": "heart",
      "title": "Hablate con amabilidad",
      "when": "Cuando te tratás mal a vos mismo",
      "steps": [
        "Todos necesitamos amabilidad, también de nosotros mismos.",
        "Decite algo como: «Esto es difícil. Esto duele. Pero puedo cuidarme y cuidar a los demás».",
        "Si te cuidás, vas a tener más energía para cuidar a otros."
      ]
    }
  ]
}

/** Hábitos antiestrés */
export const MH_WELLBEING: { habits: { icon: string, title: string, text: string }[], ideas: { icon: string, title: string, text: string }[], help: string } = {
  "habits": [
    {
      "icon": "calendar-clock",
      "title": "Una rutina",
      "text": "Tener horarios fijos ayuda a sentir que controlás mejor tu vida."
    },
    {
      "icon": "bed",
      "title": "Dormir lo suficiente",
      "text": "Horarios parejos y nada de pantallas antes de acostarte."
    },
    {
      "icon": "message-circle",
      "title": "Hablar con quienes querés",
      "text": "Contarle a tu familia y a tus amigos lo que te preocupa puede ayudarte."
    },
    {
      "icon": "footprints",
      "title": "Moverte todos los días",
      "text": "Hacer ejercicio a diario puede ayudar a reducir el estrés."
    },
    {
      "icon": "salad",
      "title": "Comer equilibrado",
      "text": "Con frutas y verduras frescas, y tomando suficiente agua."
    },
    {
      "icon": "newspaper",
      "title": "Límites a las noticias",
      "text": "Si te generan estrés, reducí el tiempo que les dedicás."
    }
  ],
  "ideas": [
    {
      "icon": "users",
      "title": "Conectá con otras personas",
      "text": "Comer en familia a una hora fija, juntarte con amigos que hace mucho no ves, apagar la tele para charlar o jugar a algo juntos."
    },
    {
      "icon": "bike",
      "title": "Movete como te guste",
      "text": "Caminar, andar en bici, hacer un deporte o jugar: la actividad física reduce los síntomas de la depresión y la ansiedad."
    },
    {
      "icon": "puzzle",
      "title": "Algo que te ocupe la cabeza y las manos",
      "text": "Cocinar algo nuevo, pintar, escribir, arreglar algo de la casa, un juego o un rompecabezas: hacerlo con toda tu atención ayuda a desengancharte."
    },
    {
      "icon": "hand-heart",
      "title": "Dá a los demás",
      "text": "Agradecerle a alguien, preguntarle cómo está y escuchar de verdad, acompañar a quien necesita compañía."
    },
    {
      "icon": "sparkles",
      "title": "Prestá atención al presente",
      "text": "Notar lo que pensás, lo que sentís, tu cuerpo y lo que te rodea, sin juzgarlo."
    }
  ],
  "help": "Si el estrés te cuesta controlarlo, conviene consultar a un profesional de la salud o hablar con una persona de confianza."
}

/** Classes and spaces to move with others */
export const MH_ACTIVITIES: { yoga: Line[], estaciones: { name: string, address: string, zone?: string }[], estacionesNote: string, provinces: Line[] } = {
  "yoga": [
    {
      "id": "caba-yoga-rosedal",
      "title": "Yoga en Rosedal",
      "what": "Clase de yoga de Plazas Activas",
      "address": "Avenida Alcorta y Sarmiento, playón Estación Saludable",
      "hours": "Sábados 14:00-16:00",
      "who": "Mayores de 18 años.",
      "note": "La página no informa el costo.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    },
    {
      "id": "caba-yoga-chacabuco",
      "title": "Yoga en Parque Chacabuco",
      "what": "Clase de yoga de Plazas Activas",
      "address": "Emilio Mitre y Asamblea",
      "hours": "Martes 16:00-17:30",
      "who": "Mayores de 18 años.",
      "note": "La página no informa el costo.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    },
    {
      "id": "caba-yoga-saavedra",
      "title": "Yoga en Parque Saavedra",
      "what": "Clase de yoga de Plazas Activas",
      "address": "García del Río y Pinto",
      "hours": "Lunes y miércoles 10:00-11:30",
      "who": "Mayores de 18 años.",
      "note": "La página no informa el costo.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    },
    {
      "id": "caba-yoga-centenario",
      "title": "Yoga en Parque Centenario",
      "what": "Clase de yoga de Plazas Activas",
      "address": "Díaz Vélez y Campichuelo",
      "hours": "Miércoles 10:00-11:30 y 16:30-17:45; jueves 8:30-10:00 (franjas publicadas)",
      "who": "Mayores de 18 años.",
      "note": "La página no informa el costo.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    },
    {
      "id": "caba-yoga-patricios",
      "title": "Yoga en Parque Patricios",
      "what": "Clase de yoga de Plazas Activas",
      "address": "Caseros y Pepirí",
      "hours": "Miércoles 15:30-16:30",
      "who": "Mayores de 18 años.",
      "note": "La página no informa el costo.",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    }
  ],
  "estaciones": [
    {
      "name": "Rubén Darío",
      "address": "Av. del Libertador y Dr. Luis Agote",
      "zone": "Comuna 2"
    },
    {
      "name": "Plaza Houssay",
      "address": "Paraguay y Uriburu",
      "zone": "Comuna 2"
    },
    {
      "name": "Plaza Manzana 66",
      "address": "Moreno entre Catamarca y Av. Jujuy",
      "zone": "Comuna 3"
    },
    {
      "name": "Martín Fierro",
      "address": "Barcala entre La Rioja y Gral. Urquiza",
      "zone": "Comuna 3"
    },
    {
      "name": "Parque Patricios",
      "address": "Patagones y Monteagudo",
      "zone": "Comuna 4"
    },
    {
      "name": "Plaza Almagro",
      "address": "Perón entre Bulnes y Salguero",
      "zone": "Comuna 5"
    },
    {
      "name": "Parque Centenario",
      "address": "Antonio Machado y Leopoldo Marechal",
      "zone": "Comuna 6"
    },
    {
      "name": "Parque Rivadavia",
      "address": "Av. Rivadavia y Pasaje Florencio Balcarce",
      "zone": "Comuna 6"
    },
    {
      "name": "Parque Chacabuco",
      "address": "Av. Asamblea y Emilio Mitre",
      "zone": "Comuna 7"
    },
    {
      "name": "Plaza Flores",
      "address": "Av. Rivadavia y Fray Cayetano Rodríguez",
      "zone": "Comuna 7"
    },
    {
      "name": "Plaza Sudamérica",
      "address": "Av. Piedrabuena y F. de la Cruz",
      "zone": "Comuna 8"
    },
    {
      "name": "Parque Avellaneda",
      "address": "Av. Lacarra y Av. Bilbao",
      "zone": "Comuna 9"
    },
    {
      "name": "Aristóbulo del Valle",
      "address": "Cuenca entre Baigorria y Marcos Sastre",
      "zone": "Comuna 11"
    },
    {
      "name": "Parque Saavedra",
      "address": "Roque Pérez y Paroissien",
      "zone": "Comuna 12"
    },
    {
      "name": "Lagos de Palermo",
      "address": "Andrés Bello casi esquina Tornquist",
      "zone": "Comuna 14"
    },
    {
      "name": "Rosedal",
      "address": "Iraola y Sarmiento",
      "zone": "Comuna 14"
    },
    {
      "name": "Parque Los Andes",
      "address": "Av. Dorrego y Av. Corrientes",
      "zone": "Comuna 15"
    },
    {
      "name": "Parque de la Ciudad",
      "address": "Calle 23 de Junio y Alberto Zorilla",
      "zone": "Comuna 8"
    }
  ],
  "estacionesNote": "Talleres recreativos y actividad física. El programa dice que sus actividades son gratuitas; la grilla cambia, así que consultá antes: 11 3161-9798 o estacionessaludables@buenosaires.gob.ar.",
  "provinces": [
    {
      "id": "rosario-carrasco-yoga",
      "title": "Rosario - Laboratorio Cultural Carrasco: Yoga",
      "what": "Práctica grupal de cuerpo, respiración y atención.",
      "address": "Hospital Carrasco; ingreso Bv. Avellaneda y 9 de Julio",
      "phone": "341-3-924666 interno 228",
      "hours": "Miércoles 8:30 y 10:00",
      "who": "Mayores de 16 años.",
      "how": "Formulario de preinscripción en la página; esperar confirmación del equipo.",
      "url": "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco",
      "province": "Santa Fe (Rosario)"
    },
    {
      "id": "rosario-carrasco-movimiento",
      "title": "Rosario - Laboratorio Cultural Carrasco: Movete Carrasco",
      "what": "Actividad corporal y encuentro grupal.",
      "address": "Hospital Carrasco; ingreso Bv. Avellaneda y 9 de Julio",
      "phone": "341-3-924666 interno 228",
      "hours": "Grupo 1 jueves 9:00; grupo 2 viernes 14:30",
      "who": "Mayores de 16 años.",
      "how": "Formulario de preinscripción en la página; esperar confirmación del equipo.",
      "url": "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco",
      "province": "Santa Fe (Rosario)"
    },
    {
      "id": "mendoza-parque-yoga",
      "title": "Ciudad de Mendoza - Yoga para personas mayores",
      "what": "Actividad del Programa Adultos Mayores en Parque Urbano.",
      "address": "Ituzaingó y Córdoba",
      "hours": "Martes y viernes 10:00",
      "who": "Personas mayores; la nota no dice desde qué edad.",
      "how": "Inscripción previa presencial en oficina del parque o enlace oficial. Oficina lunes a viernes 10:30-19:30; no es horario de clase.",
      "url": "https://prensa.ciudaddemendoza.gob.ar/2026/04/14/el-parque-urbano-presenta-su-propuesta-de-actividades-deportivas-2026/",
      "province": "Mendoza"
    },
    {
      "id": "mendoza-parque-taichi",
      "title": "Ciudad de Mendoza - Tai chi para personas mayores",
      "what": "Actividad del Programa Adultos Mayores en Parque Urbano.",
      "address": "Ituzaingó y Córdoba",
      "hours": "Lunes 11:30",
      "who": "Personas mayores; la nota no dice desde qué edad.",
      "how": "Inscripción previa presencial en oficina del parque o enlace oficial. Oficina lunes a viernes 10:30-19:30; no es horario de clase.",
      "url": "https://prensa.ciudaddemendoza.gob.ar/2026/04/14/el-parque-urbano-presenta-su-propuesta-de-actividades-deportivas-2026/",
      "province": "Mendoza"
    }
  ]
}

/** Tus derechos (Ley 26.657) */
export const MH_RIGHTS: { intro: string, items: { icon: string, short: string, text: string }[], refused: { rule: string, note: string }, disclaimer: string } = {
  "intro": "La Ley Nacional de Salud Mental (26.657) reconoce estos derechos a las personas con padecimiento mental.",
  "items": [
    {
      "icon": "heart-handshake",
      "short": "El mejor tratamiento",
      "text": "Recibir el tratamiento más conveniente, el que menos limite tus derechos y libertades."
    },
    {
      "icon": "users",
      "short": "Estar acompañado",
      "text": "Que te acompañen tus familiares, tus afectos o la persona que designes, antes, durante y después del tratamiento."
    },
    {
      "icon": "file-text",
      "short": "Tu historia clínica",
      "text": "Acceder a tu historia clínica. También pueden hacerlo tu abogado, un familiar o la persona que designes."
    },
    {
      "icon": "ban",
      "short": "Sin discriminación",
      "text": "No ser discriminada ni discriminado por tener, o haber tenido, un padecimiento mental."
    },
    {
      "icon": "hospital",
      "short": "En un hospital general",
      "text": "Ser atendida o atendido en un hospital general. La atención debe hacerse, preferentemente, fuera de la internación."
    },
    {
      "icon": "pill",
      "short": "Medicación, nunca castigo",
      "text": "Que la medicación responda a tus necesidades de salud y nunca se use como castigo."
    }
  ],
  "refused": {
    "rule": "Rechazar la atención de una persona por tener un padecimiento mental es una forma de discriminación.",
    "note": "La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación."
  },
  "disclaimer": "Es una explicación simple de la ley: no reemplaza el asesoramiento de un equipo de salud ni el de un abogado."
}

/** Official sources at the foot of each section (by the model's section id) */
export const MH_SOURCES: Record<string, Source[]> = {
  "ayuda": [
    {
      "label": "Guardias de salud mental · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"
    },
    {
      "label": "Salud: hospitales públicos y gratuitos · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/migrantes/derechos/salud"
    },
    {
      "label": "Salud Mental Responde · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/salud/salud-mental/atencion-telefonica"
    },
    {
      "label": "La Provincia suma 38 equipos de salud mental a las guardias (2021) · Ministerio de Salud bonaerense",
      "url": "https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_suma_38_equipos_de_salud_mental_las_guardias_hospitalarias"
    },
    {
      "label": "Plan provincial de prevención y cuidados ante el suicidio (2026) · Gobierno de la Provincia de Buenos Aires",
      "url": "https://www.gba.gob.ar/comunicacion_publica/gacetillas/kicillof_present%C3%B3_el_plan_provincial_para_fortalecer_la_prevenci%C3%B3n_y"
    },
    {
      "label": "Salud Mental aumenta las guardias interdisciplinarias (2025) · Gobierno de Mendoza",
      "url": "https://www.mendoza.gov.ar/prensa/salud-mental-aumenta-las-guardias-interdisciplinarias-en-hospitales-generales/"
    },
    {
      "label": "Líneas verificadas por AuxiliAR (911, 0800-999-0091, 135, 0800-345-1435, 141)",
      "url": "https://www.argentina.gob.ar/noticias/la-linea-nacional-de-orientacion-y-apoyo-en-la-urgencia-de-salud-mental-funciona-las-24-0"
    },
    {
      "label": "Ubicaciones aproximadas · OpenStreetMap",
      "url": "https://www.openstreetmap.org/copyright"
    },
    {
      "label": "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
      "url": "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800"
    },
    {
      "label": "Centro de Salud Mental Nº 1 · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/csm-no-1"
    },
    {
      "label": "Hospital Nacional Laura Bonaparte: acceso a los servicios · argentina.gob.ar",
      "url": "https://www.argentina.gob.ar/salud/hospitalbonaparte/acceso-los-servicios-de-salud"
    },
    {
      "label": "Red de adicciones · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"
    },
    {
      "label": "Línea 108, opción 3 · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/atencion-e-integracion-social/linea-108-opcion-3-contencion-y-orientacion-en"
    },
    {
      "label": "Alcohólicos Anónimos de Argentina",
      "url": "https://aa.org.ar/informacion-primaria/problemas-con-el-alcohol/un-principiante-pregunta/"
    },
    {
      "label": "Al-Anon Argentina",
      "url": "https://alanon.org.ar/que-es-alanon/"
    },
    {
      "label": "Alateen Argentina",
      "url": "https://alanon.org.ar/alateen/"
    },
    {
      "label": "Línea de salud mental de la Provincia de Buenos Aires · Ministerio de Salud bonaerense",
      "url": "https://www.ms.gba.gov.ar/sitios/saludmental/red-de-dispositivos-de-salud-mental-y-consumo-problematico-con-base-en-la-comunidad/"
    },
    {
      "label": "Municipalidad de Córdoba - Tramas",
      "url": "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/"
    },
    {
      "label": "Crespo - Centro Comunitario Dr. Salustiano Minguillón",
      "url": "https://www.crespo.gob.ar/salud-mental-y-adicciones/"
    },
    {
      "label": "La Rioja - Centro de Día Comunitario Infantil",
      "url": "https://larioja.gob.ar/salud/saludmentalyadicciones/"
    },
    {
      "label": "Neuquén - Escucha Joven",
      "url": "https://www.neuqueninforma.com.ar/noticias/2026/02/23/255285-invitan-a-participar-de-un-nuevo-espacio-de-escucha-joven"
    },
    {
      "label": "Hospital del Niño Jesús",
      "url": "https://msptucuman.gov.ar/hospitales/hospital-del-nino-jesus/"
    },
    {
      "label": "Municipalidad de Corrientes - Atención psicológica por género y diversidad",
      "url": "https://ciudaddecorrientes.gov.ar/tramites/politicas-sociales/atenci-n-psicol-gica-individual-por-tema-de-g-nero-y-diversidad"
    },
    {
      "label": "Entre Ríos - Línea 135",
      "url": "https://portal.entrerios.gov.ar/suicidio/"
    },
    {
      "label": "Jujuy - Salud Mental Escucha",
      "url": "https://salud.jujuy.gob.ar/2026/06/16/pedir-ayuda-tambien-es-salud-mental-el-abordaje-que-impulsa-jujuy-para-acompanar-antes-que-el-malestar-avance/"
    },
    {
      "label": "Tucumán - Línea 135 de urgencias en salud mental",
      "url": "https://msptucuman.gov.ar/red-integral-para-la-contencion-de-adolescentes-en-tucuman/"
    },
    {
      "label": "Neuquén - Salud Mental Te Escucha",
      "url": "https://salud.neuquen.gob.ar/hablemos-de-salud-mental-y-suicidio/"
    },
    {
      "label": "Aquí Estoy Chat / Res Non Verba Asociación Civil",
      "url": "https://aquiestoy.chat/"
    }
  ],
  "calma": [
    {
      "label": "4-7-8 breathing · Cleveland Clinic",
      "url": "https://health.clevelandclinic.org/4-7-8-breathing"
    },
    {
      "label": "Breathing exercises for stress · NHS (Reino Unido)",
      "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/"
    },
    {
      "label": "En tiempos de estrés, haz lo que importa: una guía ilustrada · OMS / OPS",
      "url": "https://www.paho.org/es/documentos/tiempos-estres-haz-lo-que-importa-guia-ilustrada"
    }
  ],
  "musculos": [
    {
      "label": "Progressive Muscle Relaxation · Counseling Center, James Madison University",
      "url": "https://www.jmu.edu/counselingctr/self-help/anxiety/progressive-muscle-relaxation.shtml"
    }
  ],
  "ejercicios": [
    {
      "label": "En tiempos de estrés, haz lo que importa: una guía ilustrada · OMS / OPS",
      "url": "https://www.paho.org/es/documentos/tiempos-estres-haz-lo-que-importa-guia-ilustrada"
    }
  ],
  "bienestar": [
    {
      "label": "Salud mental: fortalecer nuestra respuesta · OMS",
      "url": "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response"
    },
    {
      "label": "Estrés · Organización Mundial de la Salud",
      "url": "https://www.who.int/es/news-room/questions-and-answers/item/stress"
    },
    {
      "label": "Actividad física · OMS",
      "url": "https://www.who.int/es/news-room/fact-sheets/detail/physical-activity"
    },
    {
      "label": "5 steps to mental wellbeing · NHS (Reino Unido)",
      "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/"
    },
    {
      "label": "En tiempos de estrés, haz lo que importa: una guía ilustrada · OMS / OPS",
      "url": "https://www.paho.org/es/documentos/tiempos-estres-haz-lo-que-importa-guia-ilustrada"
    },
    {
      "label": "Yoga en Plazas Activas · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/yoga"
    },
    {
      "label": "Estaciones Saludables · Gobierno de la Ciudad de Buenos Aires",
      "url": "https://buenosaires.gob.ar/gcaba_historico/noticias/estaciones-saludables-espacios-para-moverse-aprender-y-disfrutar-en"
    },
    {
      "label": "Rosario - Laboratorio Cultural Carrasco: Yoga",
      "url": "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco"
    },
    {
      "label": "Ciudad de Mendoza - Yoga para personas mayores",
      "url": "https://prensa.ciudaddemendoza.gob.ar/2026/04/14/el-parque-urbano-presenta-su-propuesta-de-actividades-deportivas-2026/"
    }
  ],
  "derechos": [
    {
      "label": "Ley Nacional de Salud Mental 26.657 (texto original) · argentina.gob.ar",
      "url": "https://www.argentina.gob.ar/normativa/nacional/ley-26657-175977/texto"
    },
    {
      "label": "Ley simple: Salud mental · Derecho Fácil, Ministerio de Justicia",
      "url": "https://www.argentina.gob.ar/justicia/derechofacil/leysimple/salud-mental"
    }
  ]
}
