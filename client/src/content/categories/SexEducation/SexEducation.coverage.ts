/**
 * Salud sexual y ESI · what the official pages of other organizations offer, said INSIDE AuxiliAR (what it offers, for whom, cost and
 * conditions, how to get it, contact), so that a person does not have to leave the site to learn it. Each entry was written from the page
 * named in its `source` (SexEducation.sources.ts), read on 2026-10-10 through an automatic reading tool (a summary of the page, not the
 * page itself): the figures and contacts are the ones the page gave and nobody has compared them with it by eye yet. None of these pages
 * shows a date of update, except where `sourceDate` says so. What a page does not say is written as "no figura" or left in `pending`:
 * nothing is completed from memory. They are services of other organizations and AuxiliAR has not verified any of them in person.
 */
export type CoverageEntry = {
  id: string
  title: string
  /** Who runs it */
  by: string
  offers: string[]
  forWhom: string
  /** Cost and conditions, as the page says them (quoted when it is a quote) */
  cost: string
  access: string[]
  /** Contact lines, as written in the page */
  contact: string[]
  notes?: string[]
  /** What the page does not say or contradicts: to be confirmed by a person */
  pending?: string[]
  /** Date of the page's own content, when it shows one */
  sourceDate?: string
  /** The one action that cannot be done from AuxiliAR (a map, a search, a form): a link to the page that does it */
  action?: { label: string, url: string }
}

export const READ_ON = "2026-10-10"

/** The national line of the Ministerio de Salud (SS01) */
export const NATIONAL_LINE = {
  title: "Línea 0800 de Salud Sexual",
  by: "Ministerio de Salud de la Nación",
  what: "Un servicio de consulta sobre salud sexual y salud reproductiva, pensado para facilitar el acceso a estos servicios en todo el país. La página dice que contiene, orienta y asesora a la población.",
  forWhom: "A la población en general y a los equipos de salud.",
  phone: "0800-222-3444",
  tel: "08002223444",
  email: "saludsexual@msal.gov.ar",
  hours: ["De lunes a viernes de 9 a 20 hs.", "Sábados, domingos y feriados: 10 a 18 hs."],
  notes: ["La página dice: «La llamada es confidencial».", "Atiende un equipo técnico especializado en salud sexual y reproductiva y en salud integral."],
  pending: ["La página no aclara si la llamada es gratuita ni da una lista de los temas que se pueden consultar.", "No muestra fecha de actualización."],
}

/** Provinces (SS05, SS09 and the page of Tucumán) */
export const PROVINCES: CoverageEntry[] = [
  {
    id: "buenos-aires",
    title: "Provincia de Buenos Aires",
    by: "Ministerio de Salud de la provincia de Buenos Aires",
    offers: ["Información y acceso a la interrupción voluntaria del embarazo (IVE/ILE, Ley 27.610) y acompañamiento durante el proceso.", "Acceso a métodos anticonceptivos."],
    forWhom: "Personas con un embarazo no deseado o con dudas sobre un embarazo.",
    cost: "La página dice: «Recibí información sobre aborto y métodos anticonceptivos de forma gratuita y confidencial». No figuran requisitos formales.",
    access: [
      "En centros de salud y hospitales públicos de la provincia. El Ministerio tiene un mapa de establecimientos y un listado para buscar el más cercano.",
      "Podés pedir un test de embarazo en el centro de salud o el hospital. Si el equipo de salud te pide una ecografía, el mapa también ayuda a encontrar dónde hacerla.",
      "Por teléfono: línea 148, opción 3, de lunes a viernes de 9 a 17 horas (información sobre aborto y anticoncepción).",
    ],
    contact: ["Línea 148, opción 3 (lunes a viernes, 9 a 17 h)", "Ministerio de Salud: 0221 429-2700 (la página no dice el horario ni para qué consultas)"],
    notes: ["Si algo no se cumple, el sitio enlaza un «Formulario de Reclamos IVE» del Ministerio Público de la Defensa."],
    pending: ["La página no menciona consejerías ni muestra fecha de actualización."],
    action: { label: "Buscar el establecimiento más cercano (mapa de la Provincia)", url: "https://www.ms.gba.gov.ar/sitios/aborto/" },
  },
  {
    id: "santa-fe",
    title: "Santa Fe",
    by: "Gobierno de Santa Fe",
    offers: ["Información sobre la interrupción voluntaria del embarazo (IVE) y la interrupción legal del embarazo (ILE), Ley 27.610, y atención postaborto."],
    forWhom: "«Todas las personas con capacidad de gestar».",
    cost: "La página dice que la práctica debe garantizarse en efectores públicos, obras sociales y prepagas «de manera integral y gratuita», y que los métodos anticonceptivos se entregan de manera gratuita.",
    access: [
      "IVE: «hasta la semana 14 inclusive, con el sólo requisito de la solicitud de la persona gestante». ILE: si el embarazo es consecuencia de una violación o si pone en riesgo la salud o la vida de la persona gestante.",
      "El consentimiento se da por escrito, y el acceso debe darse en un plazo máximo de 10 días corridos desde que se solicita.",
      "Los efectores con equipos que responden a estas solicitudes figuran en un mapa de efectores de la provincia.",
      "Si una obra social o prepaga no cumple, se puede presentar un reclamo en la Superintendencia de Servicios de Salud o en Defensa del Consumidor.",
    ],
    contact: ["Línea nacional de salud sexual 0800-222-3444, para consultas confidenciales (la página no da su horario)", "Atención general del Gobierno de Santa Fe: 0800-777-0801, de lunes a viernes de 8 a 18 (no es una línea específica de IVE)"],
    pending: ["No muestra fecha de actualización del contenido.", "El mapa de efectores es un enlace a un mapa externo."],
    action: { label: "Ver el mapa de efectores de Santa Fe", url: "https://www.santafe.gob.ar/index.php/web/content/view/full/139666/" },
  },
  {
    id: "tucuman",
    title: "Tucumán",
    by: "Ministerio de Salud Pública de Tucumán · Programa de Salud Sexual y Reproductiva",
    offers: [
      "Métodos anticonceptivos, preservativos, test de embarazo y otros insumos, y asesoramiento.",
      "Métodos disponibles según la nota: preservativos, anticonceptivos orales (de 21 y de 28 comprimidos), inyectables mensuales y trimestrales, implantes subdérmicos y DIU (de cobre y hormonales).",
    ],
    forWhom: "La nota dice que el programa «brinda asesoramiento a la población».",
    cost: "La nota dice que el programa «trabaja para garantizar el acceso gratuito a métodos anticonceptivos». El parche y el anillo vaginal no forman parte de la canasta gratuita del programa.",
    access: [
      "En los Centros de Atención Primaria de la Salud (CAPS): todos cuentan con métodos de corta duración. Para implantes y DIU se requiere personal capacitado.",
      "Podés consultar al programa, que orienta sobre el lugar más cercano donde se hace la prestación.",
    ],
    contact: ["381 361-6554 (la nota recomienda comunicarse preferentemente por WhatsApp)"],
    notes: ["La nota recomienda el doble método: el preservativo no tiene que faltar nunca, porque los métodos hormonales o de larga duración no protegen frente a las infecciones de transmisión sexual."],
    pending: ["No figuran horarios."],
    sourceDate: "19 de agosto de 2026 (fecha de la nota)",
  },
]

/** A civil organization (SS12, SS13) */
export const HUESPED: CoverageEntry = {
  id: "huesped",
  title: "Fundación Huésped",
  by: "Fundación Huésped (organización civil, no es un servicio del Estado)",
  offers: [
    "Centro de testeo de VIH y sífilis: testeo rápido con un pinchazo en el dedo; el resultado se obtiene en unos 20 minutos, con acompañamiento de un equipo especializado.",
    "Primera escucha y consejería sobre VIH, salud sexual integral, acceso a la salud y casos de estigma y discriminación; los casos que requieren más profundidad se derivan a profesionales médicos, psicológicos o legales.",
    "Asesoramiento legal ante la vulneración de derechos (por ejemplo, acceso a medicación o a profilaxis post exposición), apoyo psicológico y grupos de pares.",
  ],
  forWhom: "El testeo y la atención están «abiertos a toda la comunidad». Las terapias psicológicas están pensadas para personas con VIH y personas trans, entre otros destinatarios.",
  cost: "La página dice: «En Fundación Huésped todos nuestros servicios son gratuitos».",
  access: ["Presencial, en Av. Forest 345, Ciudad de Buenos Aires (la página no aclara si el testeo funciona en esa misma sede).", "Turnos por WhatsApp: «de lunes a viernes de 8 a 17hs»."],
  contact: ["WhatsApp 11-6468-1673", "Línea gratuita 0-800-222-HUESPED (4837)", "Teléfono (5411) 2120-9999"],
  pending: ["Los horarios del centro de testeo no coinciden dentro de la propia página (una sección dice de lunes a viernes de 11 a 16:30 y otra de 10 a 12 y de 13 a 17): hay que confirmarlos por teléfono.", "El correo no se pudo leer. No muestra fecha de actualización."],
  action: { label: "Buscar servicios cerca tuyo (buscador de Fundación Huésped)", url: "https://donde.huesped.org.ar/" },
}

/** The buscador «Dónde», said as what it is (SS12) */
export const HUESPED_SEARCH = "El buscador «Dónde», creado por Fundación Huésped, permite buscar por tu ubicación preservativos, métodos anticonceptivos, vacunatorios, interrupción voluntaria del embarazo y testeo de VIH y otras ITS. La página no dice qué zonas cubre ni cada cuánto se actualiza."

export type EsiEntry = {
  id: string
  title: string
  by: string
  what: string
  forWhom: string[]
  materials: string[]
  access: string
  contact: string[]
  pending: string[]
  sourceDate?: string
}

/** ESI materials and programs (SS14 national note, PBA, Chaco) */
export const ESI_ENTRIES: EsiEntry[] = [
  {
    id: "nacion",
    title: "Materiales del Ministerio de Educación de la Nación",
    by: "Ministerio de Educación de la Nación (Programa Nacional de Educación Sexual Integral)",
    what: "Una nota del 4 de octubre de 2022 presenta nuevos materiales educativos de ESI.",
    forWhom: ["Niñas, niños y adolescentes con discapacidad intelectual (láminas y folleto).", "Docentes y referentes escolares de nivel inicial, primario y secundario (cuadernillos).", "Niñas y niños de 3 a 5 y de 6 a 9 años (serie animada)."],
    materials: [
      "Láminas «Aprendemos a tomar nuestras propias decisiones» y «Hablemos de abuso sexual», y el folleto «La ESI y la discapacidad intelectual», con producciones audiovisuales en Lengua de Señas Argentina.",
      "Cuadernillos para Referentes Escolares ESI, y la colección «Derechos Humanos, Género y ESI en la escuela».",
      "«Efemérides para trabajar la ESI».",
      "«Yo quiero saber ¿y vos?», serie animada hecha junto con Pakapaka.",
      "«ESI en primera persona», cinco producciones audiovisuales para el nivel secundario.",
      "Micros de la jornada «Educar en Igualdad», con propuestas para los tres niveles.",
    ],
    access: "La nota enlaza archivos y listas de reproducción en otros sitios del Estado y en YouTube; no explica un procedimiento de descarga.",
    contact: ["La nota no trae datos de contacto."],
    pending: ["Cómo acceder a cada material: pendiente."],
    sourceDate: "4 de octubre de 2022",
  },
  {
    id: "buenos-aires",
    title: "Provincia de Buenos Aires · Dirección de Educación Sexual Integral",
    by: "Subsecretaría de Educación de la Dirección General de Cultura y Educación (DGCyE)",
    what: "La Dirección, creada en 2022, busca «fortalecer la implementación de la ESI en las escuelas bonaerenses de todos los niveles y modalidades», con la Ley 26.150 y la Ley provincial 14.744. Sus líneas de acción son la institucionalización de la ESI, la formación docente, la participación estudiantil, el desarrollo curricular y de materiales, el trabajo con familias y comunidad, y la Ley Micaela bonaerense (15.134).",
    forWhom: ["Escuelas de todos los niveles y modalidades.", "Docentes (formación inicial y continua).", "Estudiantes y familias."],
    materials: ["Lineamientos curriculares, comunicaciones y documentos, la colección #ESI, el Canal ESI, «Continuemos Estudiando» y el 1° Congreso Provincial de ESI.", "La página no detalla títulos, cursos, fechas ni modalidad de la formación."],
    access: "La página no explica cómo acceder a cada material.",
    contact: ["Correo: direccionesi@abc.gob.ar", "No figura un teléfono propio de la Dirección; la página muestra solo el conmutador general (0221) 429-7600."],
    pending: ["Acceso a cada material y detalle de la formación: pendiente."],
  },
  {
    id: "chaco",
    title: "Chaco · recursos de ESI",
    by: "Ministerio de Educación del Chaco",
    what: "Recursos de ESI publicados por el Ministerio de Educación de la provincia.",
    forWhom: ["Docentes de nivel inicial, primario y secundario, y equipos de supervisión.", "Estudiantes.", "Familias."],
    materials: [
      "Referentes Escolares ESI para nivel inicial, primario y secundario.",
      "Cuadernillo para estudiantes de ESI y colección para estudiantes.",
      "Materiales para docentes y «Educación Sexual Integral para compartir en familia».",
      "Materiales de ESI en lenguas indígenas, y «La ESI y los equipos de supervisión».",
    ],
    access: "La página no indica cómo se accede a cada recurso (descarga o consulta) y remite al sitio nacional de recursos de ESI.",
    contact: ["Gob. Bosch N° 99 – Nave 9, Resistencia, Chaco", "Teléfono 441984, internos 4194 y 4175", "WhatsApp 3624-555579", "Correo: dirdocuypc@gmail.com"],
    pending: ["Forma de acceso a cada recurso: pendiente."],
  },
]
