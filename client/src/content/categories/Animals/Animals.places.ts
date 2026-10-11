/**
 * Atención veterinaria, told inside AuxiliAR: for every place, each prestación apart (castración, vacunación antirrábica, consulta clínica,
 * urgencias), with who can use it, cost and conditions, where, when, how to get it and how to reach it, as the OFFICIAL PAGE of that
 * place says it. Read on READ_ON from the original HTML of each page (full visible text, not a summary): docs/investigacion/
 * salud-animal-lectura-2026-10-11.md has the method, what each page says and what it leaves open.
 *
 * Rules kept here:
 *  - gratuity is told per prestación and always as the page's statement ("gratuita" is never said of a whole institution);
 *  - what a page does not say is `pending` (never completed with a guess): a missing cost is "no informa", not "gratuita";
 *  - AuxiliAR verified none of it in person; the pages show no update date unless `sourceDate` says so.
 */
export const READ_ON = "2026-10-11"

export type Kind = "castracion" | "vacunacion" | "consulta" | "urgencias"

/** How the page tells the cost of a prestación; "no-aplica" is a service the page says does not exist (it has no cost to tell) */
export type CostStatus = "gratuita" | "condicionada" | "no-informada" | "arancelada" | "no-aplica"

/** The three groups a person is shown, apart: free according to the page (with the condition said where it applies), cost not confirmed, and arancelados */
export const FREE_STATUSES: CostStatus[] = ["gratuita", "condicionada"]
export const UNCONFIRMED_STATUSES: CostStatus[] = ["no-informada"]
export const PAID_STATUSES: CostStatus[] = ["arancelada"]
export const NOT_OFFERED_STATUSES: CostStatus[] = ["no-aplica"]

export type Prestacion = {
  kind: Kind
  title: string
  cost: { status: CostStatus, text: string }
  /** Who can use it, with the requirements the page states */
  who: string
  /** Places, with address when the page gives it */
  where?: string[]
  when?: string[]
  /** How it is asked for, in steps or sentences */
  how: string[]
  /** Conditions and preparation the page asks for */
  conditions?: string[]
  contact?: string[]
  /** What the page leaves open or contradicts */
  pending?: string[]
}

export type AnimalPlace = {
  id: string
  /** The only place it applies to */
  place: string
  /** Who publishes it */
  by: string
  /** The official page the text comes from (kept in Sobre AuxiliAR) */
  url: string
  /** Date of the content when the page shows one */
  sourceDate?: string
  prestaciones: Prestacion[]
  /** An external page that is needed to complete an action, or to see a schedule that changes (one per place) */
  action?: { label: string, url: string }
}

export const CABA: AnimalPlace = {
  id: "caba",
  place: "Ciudad de Buenos Aires",
  by: "Gobierno de la Ciudad · Animales BA",
  url: "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas",
  action: { label: "Pedir el turno de castración y ver el cronograma actualizado", url: "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas" },
  prestaciones: [
    {
      kind: "castracion",
      title: "Castración de perros y gatos",
      cost: { status: "gratuita", text: "La página la describe como «totalmente gratuita»." },
      who: "Perros y gatos, acompañados por una persona mayor de 18 años que pueda quedarse toda la mañana hasta que termine la cirugía. Antes de operar, un veterinario hace un examen clínico y solo opera si el animal está apto.",
      where: ["Centro Fijo Indoamericano: Parque Indoamericano, Villa Soldati (Av. Escalada y Paseo Islas Malvinas).", "Centro Fijo Costanera Sur: Av. Dr. T. Achával Rodríguez 1550, a 100 metros frente a la fuente de Lola Mora.", "Ocho unidades móviles que recorren las comunas de lunes a viernes."],
      when: ["Cada centro atiende ciertos días: las fechas están en el cronograma de abajo. La página no publica horarios de los centros fijos."],
      how: [
        "Pedí el turno online con tu cuenta miBA: elegí castración de perra, perro, gata o gato, y después «por fecha».",
        "Las agendas de la semana siguiente se abren los viernes a las 10 h.",
        "Cuando se confirma, te llega un correo con las indicaciones. Sin turno previo no atienden.",
      ],
      conditions: [
        "Ayuno: 12 horas sin comida y 8 horas sin líquidos.",
        "Perro con collar y correa; gato en transportadora o bolso ventilado. Llevá una manta para abrigarlo después.",
        "Avisá al veterinario si toma medicación o tiene alguna enfermedad; podés llevar estudios previos.",
      ],
      contact: ["La página no publica teléfono: el turno se pide online."],
      pending: ["La página no dice si piden domicilio en la Ciudad."],
    },
    {
      kind: "vacunacion",
      title: "Vacunación antirrábica de perros y gatos",
      cost: { status: "gratuita", text: "La página la describe como «totalmente gratuita»." },
      who: "Perros y gatos. La página no pide documentación ni domicilio.",
      where: ["En los operativos de las unidades móviles: el lugar de cada uno está en el cronograma de abajo. Los centros fijos no figuran para vacunación."],
      when: ["Según el cronograma: en los operativos publicados es de 9 a 12.30 h (uno, de 14 a 17.30 h)."],
      how: ["Acercate al operativo sin turno previo."],
      conditions: ["Perro con collar o pretal, chapita identificatoria, correa y bozal; gato en transportadora."],
      contact: ["La página no publica teléfono."],
    },
  ],
}

export const PASTEUR: AnimalPlace = {
  id: "pasteur",
  place: "Ciudad de Buenos Aires",
  by: "Instituto de Zoonosis Luis Pasteur · Gobierno de la Ciudad",
  url: "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios",
  prestaciones: [
    {
      kind: "vacunacion",
      title: "Vacunación antirrábica de perros y gatos",
      cost: { status: "gratuita", text: "La página de servicios incluye el vacunatorio entre los servicios que el Instituto brinda «a la comunidad, en forma gratuita»." },
      who: "Perros y gatos desde los 3 meses de edad; la vacuna es anual y obligatoria.",
      where: ["Av. Díaz Vélez 4821, Ciudad de Buenos Aires."],
      when: [
        "La página de servicios dice: de 9 a 12 y de 14 a 17 h, los 365 días del año.",
        "La página de vacunación dice: todos los días, incluidos sábados, domingos y feriados, de 8 a 18 h.",
        "Las dos páginas oficiales no coinciden en el horario: no elegimos una. Confirmalo por teléfono antes de ir.",
      ],
      how: ["Acercate al Instituto sin turno, por orden de llegada."],
      conditions: ["Perro con collar, correa y bozal; gato en bolso o transportadora."],
      contact: ["Conmutador 4958-9900, de lunes a viernes de 10 a 17 h."],
      pending: ["El horario del vacunatorio es contradictorio entre dos páginas oficiales (ver «Cuándo»)."],
    },
    {
      kind: "consulta",
      title: "Consultorio clínico orientado a zoonosis",
      cost: { status: "gratuita", text: "La página de servicios lo incluye entre los servicios que el Instituto brinda «a la comunidad, en forma gratuita»." },
      who: "Animales con casos sospechosos de zoonosis: el consultorio es para diagnosticar, evaluar y tratar zoonosis. No es una clínica veterinaria general.",
      where: ["Av. Díaz Vélez 4821, Ciudad de Buenos Aires."],
      when: ["De lunes a viernes: acercate a las 8 o a las 13 h para pedir el turno del día."],
      how: ["El turno es presencial."],
      contact: ["Conmutador 4958-9900, de lunes a viernes de 10 a 17 h."],
      pending: ["La página no detalla qué enfermedades ni qué estudios cubre el consultorio."],
    },
    {
      kind: "urgencias",
      title: "Guardia y urgencias",
      cost: { status: "no-aplica", text: "No tiene costo que informar: la página dice que este servicio no existe." },
      who: "La página dice textualmente: «No existe guardia de atención médica ni urgencias».",
      how: ["Para una urgencia, buscá otro lugar. El Instituto sí recibe denuncias por mordeduras de perros y gatos para la observación antirrábica; la página no explica cómo hacerlas: consultá por el conmutador."],
      contact: ["Conmutador 4958-9900, de lunes a viernes de 10 a 17 h."],
    },
  ],
}

export const ROSARIO: AnimalPlace = {
  id: "rosario",
  place: "Rosario (Santa Fe)",
  by: "Municipalidad de Rosario · Red de Salud Animal (IMuSA)",
  url: "https://www.rosario.gob.ar/inicio/salud-animal",
  action: { label: "Fechas y lugares del móvil barrial: canal de la Red de Salud Animal", url: "https://whatsapp.com/channel/0029Vb0R4BcH5JLz1iwMZb2p" },
  prestaciones: [
    {
      kind: "castracion",
      title: "Esterilización de perros y gatos",
      cost: { status: "gratuita", text: "La página la describe como «servicio gratuito de esterilización del Imusa»." },
      who: "Perros y gatos, machos o hembras. Hay que presentarse con el DNI y el animal; lo lleva una persona mayor.",
      where: [
        "Vecinal Parque Sur: Bolonia 5350. Lunes a viernes de 7.30 a 12.30 h.",
        "Centro de Salud Pasteur: Ayolas 270 (otra página dice «Ayolas y Ayacucho»). Lunes a viernes de 7.30 a 17 h.",
        "Vecinal 7 de Septiembre: Ayala Gauna 7951. Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
        "CMD Oeste: Pte. Perón 4602. Lunes a viernes de 7.30 a 12.30 y de 13 a 17 h.",
      ],
      when: ["Los turnos se gestionan en los puestos de lunes a viernes, de 10 a 12 y de 14 a 16 h (según el puesto)."],
      how: ["Sacá el turno en persona en un puesto fijo, o por WhatsApp.", "El día del turno presentate con el DNI y el animal."],
      conditions: [
        "Perro con collar y correa, o en jaula de transporte. Bañarlo el día anterior.",
        "Sin alimentos sólidos 12 horas antes y sin líquidos 6 o 7 horas antes.",
        "Para retirarlo, llevá una manta. A los 15 días hay que llevarlo a la sede central del IMuSA, sin turno, para sacarle los puntos.",
      ],
      contact: ["WhatsApp 341 383-5121 (turnos y consultas)."],
      pending: ["La página no da la dirección de la sede central del IMuSA."],
    },
    {
      kind: "vacunacion",
      title: "Vacunación antirrábica de perros y gatos",
      cost: { status: "gratuita", text: "La página dice: «colocamos de forma gratuita la vacuna contra la rabia»." },
      who: "Perros y gatos desde los 3 meses de edad, con refuerzo anual.",
      where: ["En los cuatro puestos fijos (direcciones en «Esterilización») y en los operativos de castración barrial."],
      when: ["En los puestos, en sus horarios de atención; la vacunación del hospital municipal se cuenta en «Servicios importantes»."],
      how: ["Acercate sin turno previo."],
      contact: ["WhatsApp 341 383-5121."],
      pending: ["La página del hospital municipal condiciona su atención a estar adscripto al sistema de salud pública municipal: ahí no está dicho que la vacuna sea sin costo para todas las personas."],
    },
    {
      kind: "consulta",
      title: "Atención veterinaria en el Hospital Municipal de Salud Animal",
      cost: { status: "condicionada", text: "Sin costo para personas adscritas al sistema de salud pública municipal. Quienes no lo están pagan un bono de 10 gavets (1 gavet = $1.720 desde el 1/7/2026). Se paga con código QR, tarjeta de crédito o débito." },
      who: "Perros y gatos. Atención veterinaria completa: curaciones, vacunación antirrábica, desparasitación, cirugías y medicación.",
      where: ["Francia 1940, Rosario."],
      when: ["Todos los días de 8 a 20 h; feriados de 8 a 14 h.", "Vacunación antirrábica y desparasitación: de lunes a viernes de 8 a 17 h, excepto feriados."],
      how: ["Sin turno previo, por orden de llegada, priorizando urgencias y casos graves."],
      contact: ["WhatsApp 341 383-5121."],
      pending: ["La página no dice que sea una guardia las 24 horas: es la atención del horario publicado."],
    },
    {
      kind: "consulta",
      title: "Atención primaria en los puestos barriales",
      cost: { status: "gratuita", text: "La página rotula la atención de los puestos como «Sin costo»." },
      who: "Perros y gatos. Atención veterinaria primaria, vacunación antirrábica y desparasitación.",
      where: ["Los mismos cuatro puestos: Vecinal Parque Sur, Centro de Salud Pasteur, Vecinal 7 de Septiembre y CMD Oeste."],
      when: ["Lunes a viernes, en el horario de cada puesto (arriba)."],
      how: ["Sin turno previo."],
      contact: ["WhatsApp 341 383-5121."],
    },
  ],
}

export const CORDOBA: AnimalPlace = {
  id: "cordoba",
  place: "Ciudad de Córdoba",
  by: "Municipalidad de Córdoba · Control de reproducción de animales de compañía",
  url: "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/",
  prestaciones: [
    {
      kind: "castracion",
      title: "Castración de perros y gatos",
      cost: { status: "gratuita", text: "La página dice que las castraciones son «gratuitas para los vecinos de la ciudad de Córdoba»." },
      who: "Vecinos de la ciudad de Córdoba. Perros y gatos, domésticos o en situación de calle. La Municipalidad también ofrece turnos especiales para perros «potencialmente peligrosos».",
      where: ["Centro de Alberdi: Francisco Muñiz 60.", "Centro de La France: Concepción del Bermejo 3129.", "Centro de Villa Allende Parque: Maloca 8321.", "La página dice que pronto se inaugurará un cuarto centro."],
      how: [
        "Pedí el turno por mensaje de WhatsApp. El turnero abre todos los jueves hábiles desde las 8.",
        "Después te contactan para confirmar el turno y validar tus datos.",
        "Las mascotas preñadas tienen prioridad y se atienden sin turno, en los horarios designados de cada centro.",
      ],
      contact: ["WhatsApp 351 860-6269 (turnos)."],
      pending: [
        "La propia página reconoce quejas por la obtención de turnos: hay mucha demanda y pocos turnos.",
        "No publica los horarios de los centros ni los requisitos para castrar.",
        "Otras notas del municipio de 2025 publican otro canal de turno: confirmá cuál es el vigente.",
        "La página no habla de vacunación ni de consulta clínica.",
      ],
    },
  ],
}

export const SALTA: AnimalPlace = {
  id: "salta",
  place: "Ciudad de Salta",
  by: "Municipalidad de Salta · Bienestar animal",
  url: "https://municipalidadsalta.gob.ar/bienestar-animal-7/",
  action: { label: "Cronograma semanal del móvil y ubicación de cada centro: página oficial", url: "https://municipalidadsalta.gob.ar/bienestar-animal-7/" },
  prestaciones: [
    {
      kind: "castracion",
      title: "Castración en el Móvil Quirúrgico",
      cost: { status: "gratuita", text: "La página dice que el Móvil Quirúrgico «recorre la ciudad realizando castraciones gratuitas»." },
      who: "Perros y gatos desde los 6 meses, clínicamente sanos. Las hembras no deben estar en celo ni en lactancia.",
      where: ["Barrios de la ciudad, en los Centros Integradores Comunitarios (CIC): el cronograma se publica cada semana en las redes del municipio."],
      how: ["En cada publicación del cronograma figura el WhatsApp para pedir el turno."],
      conditions: [
        "Ayuno de 12 horas, sin comida ni agua. Bañar al animal dos días antes. Llevar una manta.",
        "Perros con collar o pechera; gatos en jaula, canil o mochila transportadora.",
        "Las razas braquicéfalas (pug, bulldog, bóxer, pekinés, shih tzu, Boston terrier, pomerania, entre otras) se operan de forma programada, con turno previo.",
      ],
      pending: ["El cronograma está en las redes sociales del municipio, no en la página: AuxiliAR no lo tiene."],
    },
    {
      kind: "castracion",
      title: "Castración en el Hospital Municipal de Salud Animal y en el Centro de Adopciones",
      cost: { status: "no-informada", text: "La página titula «Atención veterinaria gratuita» a la atención clínica del hospital y del Centro de Adopciones, pero no dice expresamente si la castración lo es." },
      who: "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta.",
      where: ["Hospital Municipal de Salud Animal. La página no da su dirección.", "Centro de Adopciones «Nicolás Mancilla»: cirugías los lunes, jueves y viernes a las 8 h, con turno solo presencial."],
      when: ["Hospital: las cirugías se hacen de lunes a viernes, por la mañana y por la tarde."],
      how: ["En el hospital, los turnos se entregan los viernes o el último día hábil, en persona o por WhatsApp."],
      contact: ["Hospital: 387 566-8872 (teléfono y WhatsApp)."],
      pending: [
        "En un lugar la página dice que las razas braquicéfalas NO se operan en el hospital y en otro que se operan de forma programada con turno previo: consultá antes.",
        "La página no da la dirección del hospital: tiene un enlace de ubicación.",
      ],
    },
    {
      kind: "castracion",
      title: "Castración en los cinco CIC",
      cost: { status: "no-informada", text: "La página no dice si la castración en los CIC es gratuita." },
      who: "Mayores de 18 años con DNI con domicilio en la ciudad de Salta.",
      where: ["CIC Constitución, CIC Solidaridad, CIC Unión, CIC Asunción y CIC Limache. La página no da sus direcciones: tiene un enlace de ubicación para cada uno."],
      when: [
        "CIC Constitución: de lunes a viernes de 11 a 12 h. Turnos presenciales los viernes desde las 8.",
        "CIC Solidaridad: lunes a miércoles de 8 a 11.30 h; jueves y viernes, 13 h. Turnos presenciales los viernes desde las 8.30.",
        "CIC Unión: de lunes a viernes de 7 a 13 h. Turnos presenciales los viernes desde las 7.",
        "CIC Asunción: turnos presenciales los viernes de 14 a 20 h.",
        "CIC Limache: de lunes a viernes de 7 a 11 h. Turnos presenciales los viernes desde las 8.",
      ],
      how: ["Sacá el turno en persona, los viernes, en el CIC."],
      contact: ["CIC Constitución 387 226-6146 · CIC Solidaridad 387 226-6210 · CIC Unión 387 226-6246 · CIC Asunción 387 226-6133 · CIC Limache 387 226-6199."],
    },
    {
      kind: "vacunacion",
      title: "Vacunación antirrábica de perros y gatos",
      cost: { status: "no-informada", text: "La página dice que los CIC ofrecen «atención veterinaria y vacunación antirrábica», pero no dice si tienen costo." },
      who: "Mayores de 18 años con DNI con domicilio en la ciudad de Salta.",
      where: ["Los cinco CIC (direcciones en «Castración en los cinco CIC»). El Móvil también lleva vacunación antirrábica y desparasitación a distintos barrios."],
      when: [
        "CIC Constitución: lunes a viernes de 10 a 12.15 h.",
        "CIC Solidaridad: lunes a miércoles de 11 a 13 h, por orden de llegada; jueves y viernes, turnos a las 13 h y atención a las 14 h.",
        "CIC Unión: lunes a viernes de 8 a 12 h.",
        "CIC Asunción: lunes a viernes de 13 a 19 h; martes, miércoles y viernes también de 7 a 13 h.",
        "CIC Limache: lunes a viernes de 11 a 12 h.",
      ],
      how: ["Acercate al CIC en el horario indicado."],
      contact: ["Los teléfonos de cada CIC están en «Castración en los cinco CIC»."],
      pending: ["En CIC Unión la página pide además un «certificado de carente de recursos»: no explica para qué prestación."],
    },
    {
      kind: "consulta",
      title: "Atención veterinaria en el Hospital Municipal de Salud Animal",
      cost: { status: "gratuita", text: "La página titula la atención del hospital como «Atención veterinaria gratuita». Para los controles posteriores pide un «certificado de carente de recursos»." },
      who: "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta.",
      where: ["Hospital Municipal de Salud Animal. La página no da su dirección: tiene un enlace de ubicación."],
      when: ["Lunes a viernes de 7 a 18 h. Sábados y feriados de 8 a 12 h."],
      how: ["La página no explica cómo pedir la consulta: confirmalo por teléfono."],
      contact: ["387 566-8872 (teléfono y WhatsApp)."],
      pending: ["La página no dice si hace falta turno para la consulta."],
    },
    {
      kind: "consulta",
      title: "Atención veterinaria en el Centro de Adopciones «Nicolás Mancilla»",
      cost: { status: "gratuita", text: "La página lo titula «Atención veterinaria gratuita»." },
      who: "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta. Controles posteriores: certificado de carente de recursos.",
      where: ["Centro de Adopciones «Nicolás Mancilla»: la página no da su dirección."],
      when: ["De lunes a viernes de 8 a 18 h."],
      how: ["La página no explica cómo pedir la consulta: confirmalo antes de ir."],
    },
    {
      kind: "consulta",
      title: "Atención veterinaria en los cinco CIC",
      cost: { status: "no-informada", text: "La página dice que los CIC ofrecen «atención veterinaria y vacunación antirrábica», pero no dice si tienen costo." },
      who: "Mayores de 18 años con DNI con domicilio en la ciudad de Salta.",
      where: ["CIC Constitución, Solidaridad, Unión, Asunción y Limache. La página no da sus direcciones."],
      when: ["Los horarios de cada CIC son los de «Vacunación antirrábica» (en «Vacunación y castración»)."],
      how: ["Acercate al CIC en el horario indicado."],
      contact: ["CIC Constitución 387 226-6146 · CIC Solidaridad 387 226-6210 · CIC Unión 387 226-6246 · CIC Asunción 387 226-6133 · CIC Limache 387 226-6199."],
      pending: ["En CIC Unión la página pide además un «certificado de carente de recursos»: no explica para qué prestación."],
    },
    {
      kind: "urgencias",
      title: "«Guardia y urgencias» del Hospital Municipal",
      cost: { status: "no-informada", text: "La página no dice si este apartado tiene un costo distinto de la atención del hospital." },
      who: "Mayores de 18 años con fotocopia del DNI con domicilio en la ciudad de Salta.",
      how: ["La página dice que «se prioriza controles y urgencias» y que no se realizan internaciones ni métodos complementarios. Si tu mascota tiene una urgencia, informalo al llegar."],
      pending: ["El apartado no tiene horario propio: no es una guardia confirmada. Llamá al hospital (387 566-8872) antes de ir."],
    },
  ],
}

export const NEUQUEN: AnimalPlace = {
  id: "neuquen",
  place: "Ciudad de Neuquén",
  by: "Municipalidad de Neuquén · Bienestar animal",
  url: "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/",
  sourceDate: "27 de mayo de 2026",
  action: { label: "Pedir el preturno de castración (Muni Express)", url: "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/" },
  prestaciones: [
    {
      kind: "castracion",
      title: "Esterilización de perros y gatos",
      cost: {
        status: "condicionada",
        text: "La página dice «Castración gratuita para perros/as de 3 a 5 kg». Para los demás casos el apartado «Costo del trámite» está vacío: AuxiliAR no sabe si tienen costo.",
      },
      who: "Mayores de 18 años con residencia en la ciudad. Perros y gatos, machos y hembras; los perros, desde los seis meses. No hace falta que hayan tenido crías.",
      where: [
        "Quirófano fijo Parque Industrial: Domingo Savio 3215 (299 592-8056).",
        "Quirófano fijo: Novella y Godoy (299 596-2039).",
        "Quirófano fijo: Dr. Ramón y Catriel (299 406-3969).",
        "Quirófano fijo: Ricchieri 667 (299 576-4402).",
        "Quirófanos móviles, en los barrios que correspondan.",
      ],
      when: ["Preturnos online: los viernes a las 9 h.", "Móviles: los turnos se dan los lunes a las 9 h, en persona, en los barrios.", "Perros de 3 a 5 kg (gratuito): se pide turno los miércoles, llamando de 9 a 13 h al 299 592-8056 o al 299 576-4402, solo para el quirófano de Parque Industrial."],
      how: [
        "Entrá a Muni Express (neuquencapital.gov.ar) con usuario y contraseña; si no tenés, registrate.",
        "Elegí «Pre-turno Bienestar Animal», después «Castración» y el lugar de castración.",
        "Completá los datos del animal y confirmá. Después, personal de Bienestar Animal te llama para asignarte día y horario: un preturno no es una cirugía confirmada.",
      ],
      conditions: ["Completar la planilla de autorización de cirugía. Ir con correa, collar y una manta."],
      contact: ["Municipalidad: 299 449-1200, de lunes a viernes de 8 a 15 h."],
      pending: ["La página no dice si el servicio es gratuito para animales de más de 5 kg ni para gatos."],
    },
  ],
}

export const PROTENENCIA: AnimalPlace = {
  id: "protenencia",
  place: "Operativos de municipios de todo el país",
  by: "Ministerio de Salud de la Nación · Protenencia",
  url: "https://www.argentina.gob.ar/salud/protenencia/castraciones",
  action: { label: "Ver la página de Protenencia", url: "https://www.argentina.gob.ar/salud/protenencia/castraciones" },
  prestaciones: [
    {
      kind: "castracion",
      title: "Castraciones gratuitas en operativos",
      cost: { status: "gratuita", text: "La página se titula «Castraciones gratuitas»." },
      who: "Personas mayores de edad con DNI, con animales de compañía desde los 6 meses. Máximo dos animales por persona (para castrar más hay que ir con otra persona que ayude). La atención es prioritaria para los gatos.",
      where: ["En el lugar de cada operativo. La página no informa localidades."],
      when: ["Hay que presentarse en el horario indicado y esperar hasta que te entreguen al animal después de la cirugía."],
      how: [
        "Comunicate con el referente de tu municipio para confirmar el lugar de la actividad.",
        "Los turnos se dan por orden de llegada al operativo, uno por animal. Si llamás o te acercás a un punto de encuentro solo te dan un compromiso de asistencia: no te guardan el turno.",
        "Vas a firmar un consentimiento para la cirugía; por eso necesitás ser mayor de edad y llevar el DNI.",
      ],
      conditions: ["Un veterinario hace un examen clínico básico para decidir si el animal puede operarse. Llevá una manta. Durante el operativo no se hace atención clínica veterinaria."],
      pending: ["La página no informa fechas ni localidades, ni si hay operativos en este momento."],
    },
  ],
}

/** The teaching hospitals are told apart: their own pages say all their services are arancelados */
export const UNIVERSITY_HOSPITALS: AnimalPlace[] = [
  {
    id: "uba",
    place: "Ciudad de Buenos Aires",
    by: "Hospital Escuela · Facultad de Ciencias Veterinarias, UBA",
    url: "https://www.fvet.uba.ar/hospital/",
    prestaciones: [
      {
        kind: "consulta",
        title: "Hospital de pequeños animales",
        cost: { status: "arancelada", text: "La página dice: «Todos los servicios son arancelados»." },
        who: "Perros y gatos. Hay que traerlos con bozal y correa (los gatos en jaula o bolso) y con el certificado de vacunación antirrábica al día; sin esas condiciones no los atienden.",
        when: ["Lunes a viernes de 9 a 19 h. Solo con turno, y un paciente por turno."],
        how: ["El turno se pide online en la página de la Facultad (turnos.net01.fvet.uba.ar)."],
        contact: ["Informes y consultas: admision@fvet.uba.ar"],
        pending: ["La página no da la dirección del hospital."],
      },
      {
        kind: "urgencias",
        title: "Urgencias",
        cost: { status: "arancelada", text: "La atención es arancelada." },
        who: "La página dice que el Hospital Escuela «no atiende urgencias sin previa coordinación».",
        how: ["Hay que coordinar antes por el contacto de admisión."],
      },
    ],
  },
  {
    id: "unlp",
    place: "La Plata (Buenos Aires)",
    by: "Atención clínica primaria de pequeños animales · Facultad de Ciencias Veterinarias, UNLP",
    url: "https://www.fcv.unlp.edu.ar/index.php/hospital/servicio-de-atencion-clinica-primaria-de-pequenos-animales/",
    sourceDate: "22 de marzo de 2024",
    prestaciones: [
      {
        kind: "consulta",
        title: "Atención clínica primaria de perros y gatos",
        cost: { status: "arancelada", text: "La página dice: «Los servicios son arancelados»." },
        who: "Perros y gatos que concurren a la consulta primaria o que derivan veterinarios de la actividad privada, con la ficha de derivación completa.",
        how: ["Pedí el turno a la Secretaría del Hospital Escuela."],
        contact: ["Secretaría del Hospital Escuela: 221 599-0158."],
        pending: ["La página no da dirección ni horarios, y su fecha es de 2024."],
      },
    ],
  },
]

/** The agenda the Ciudad's page publishes (read on READ_ON): operativos and centers by day, which change every week */
export type AgendaEntry = { date: string, service: "castracion" | "vacunacion", place: string, hours?: string, kind: "fijo" | "movil" }

export const CABA_AGENDA_UNTIL = "2026-10-17"

export const CABA_AGENDA: AgendaEntry[] = [
  { date: "2026-10-01", service: "castracion", kind: "movil", place: "Plaza Monseñor Miguel de Andrea (Recoleta)" },
  { date: "2026-10-01", service: "castracion", kind: "movil", place: "Plaza Gral. Pueyrredón (Flores)" },
  { date: "2026-10-02", service: "vacunacion", kind: "movil", place: "Plaza San Miguel de Garicoits, Av. Álvarez Thomas 1231 (Colegiales)", hours: "9 a 12.30 h" },
  { date: "2026-10-03", service: "castracion", kind: "fijo", place: "Centro Fijo Indoamericano" },
  { date: "2026-10-03", service: "vacunacion", kind: "movil", place: "Plaza Ciudad de Banff, Av. Arregui y Roma (Versalles)", hours: "9 a 12.30 h" },
  { date: "2026-10-03", service: "vacunacion", kind: "movil", place: "Parque Avellaneda, Av. Directorio 4147 (Parque Avellaneda)", hours: "9 a 12.30 h" },
  { date: "2026-10-04", service: "vacunacion", kind: "movil", place: "Plaza Cañitas, Báez y Clay (Palermo)", hours: "9 a 12.30 h" },
  { date: "2026-10-04", service: "vacunacion", kind: "movil", place: "Barrio Tres Rosas, Orma y Agustín Magaldi (Barracas)", hours: "9 a 12.30 h" },
  { date: "2026-10-04", service: "vacunacion", kind: "movil", place: "Plaza 1° de Mayo, Pasco y Alsina (Balvanera)", hours: "14 a 17.30 h" },
  { date: "2026-10-05", service: "castracion", kind: "movil", place: "Plaza Benito Nazar (Villa Crespo)" },
  { date: "2026-10-06", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-06", service: "castracion", kind: "movil", place: "Plaza Martín Rodríguez (Villa Pueyrredón)" },
  { date: "2026-10-06", service: "castracion", kind: "movil", place: "Parque Florentino Ameghino (Parque Patricios)" },
  { date: "2026-10-07", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-08", service: "castracion", kind: "fijo", place: "Centro Fijo Indoamericano" },
  { date: "2026-10-08", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-08", service: "castracion", kind: "movil", place: "Plaza Aristóbulo del Valle (Villa del Parque)" },
  { date: "2026-10-09", service: "castracion", kind: "movil", place: "Plaza Corralón Floresta (Floresta)" },
  { date: "2026-10-09", service: "vacunacion", kind: "movil", place: "Plazoleta Nueva Pompeya, Av. Sáenz y Traful (Nueva Pompeya)", hours: "9 a 12.30 h" },
  { date: "2026-10-10", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-10", service: "vacunacion", kind: "movil", place: "Parque Lezama, Av. Martín García y Defensa (San Telmo)", hours: "9 a 12.30 h" },
  { date: "2026-10-10", service: "vacunacion", kind: "movil", place: "Plaza Houssay, Paraguay y Junín (Recoleta)", hours: "9 a 12.30 h" },
  { date: "2026-10-11", service: "vacunacion", kind: "movil", place: "Centro de Jubilados Lugano, Murguiondo 3386 (Villa Lugano)", hours: "9 a 12.30 h" },
  { date: "2026-10-11", service: "vacunacion", kind: "movil", place: "Plaza Manzana 66, Av. Belgrano y Av. Jujuy (Balvanera)", hours: "9 a 12.30 h" },
  { date: "2026-10-13", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-13", service: "castracion", kind: "movil", place: "Barrio Castex (Flores)" },
  { date: "2026-10-13", service: "castracion", kind: "movil", place: "Parque Onega (Villa Devoto)" },
  { date: "2026-10-15", service: "castracion", kind: "fijo", place: "Centro Fijo Indoamericano" },
  { date: "2026-10-15", service: "castracion", kind: "fijo", place: "Centro Fijo Costanera Sur" },
  { date: "2026-10-17", service: "castracion", kind: "fijo", place: "Centro Fijo Indoamericano" },
]
