/**
 * Más recursos · Trámites: the texts of two informative guides, written from what their official pages say (read on 2026-10-10;
 * the pages show no date of update). They copy no date, place, phone number or requirement the pages do not give, say nothing about
 * what the CUD covers (that depends on each case and on the laws), and do not say that the services of the neighbourhood operations are free.
 * PENDING legal and administrative review before they are published.
 */
export const PENDING_NOTICE_TITLE = "Pendiente de revisión legal y administrativa"
export const PENDING_NOTICE_TEXT = "Este resumen se hizo con la página oficial y todavía no fue revisado. No es asesoramiento legal ni administrativo: para tu caso, consultá la fuente."

export const CUD_GUIDE = {
  title: "Cómo tramitar el CUD",
  intro: "El Certificado Único de Discapacidad (CUD) es un documento público, válido en todo el país. Lo otorga una Junta Evaluadora. El trámite es voluntario y gratuito.",
  uses: "Permite acceder a los derechos y prestaciones que prevén las leyes 22.431 y 24.901. Qué corresponde en cada caso depende de esas leyes y de tu situación.",
  steps: [
    "Hacé la consulta personalizada que indica la página oficial: te dicen qué documentación llevar y adónde ir.",
    "Reuní la documentación con el equipo de salud que te atiende: certificados médicos, informes, planillas y estudios complementarios. Cuál necesitás depende de tu consulta.",
    "Acercate al lugar que te indiquen y pedí turno para la Junta Evaluadora.",
    "Asistí el día que te asignen.",
    "Retirá el CUD, o la denegatoria, en el lugar y la fecha que te indiquen.",
  ],
  notes: ["Las exenciones de peajes o de impuestos no son automáticas: se piden ante la autoridad de cada norma.", "La página oficial no informa la vigencia del CUD."],
}

export const NEIGHBORHOOD_GUIDE = {
  title: "Servicios y trámites en tu barrio",
  intro: "«Más servicios en tu barrio» es un programa del Gobierno de la Ciudad de Buenos Aires que lleva servicios y trámites a distintos barrios, en operativos en espacios públicos.",
  variable: "Los servicios, los días, los horarios y los lugares cambian según la semana y el operativo. Que un servicio exista en el programa no quiere decir que esté en el operativo de tu barrio.",
  servicesTitle: "Qué servicios puede haber",
  servicesLead: "Según la página oficial, entre otros:",
  services: [
    "Trámites y asesoramiento: AGIP, ANSES, Mi BA, SUBE, DNI y pasaporte.",
    "Atención social y asesoramiento para personas con discapacidad.",
    "Justicia, defensa del consumidor y mediación vecinal.",
    "Salud: oftalmología, odontología, toma de presión y vacunación.",
    "Servicios veterinarios.",
    "Actividades culturales y recreativas.",
  ],
  before: [
    "Algunos servicios piden turno y varios tienen cupos limitados. Lo indica el cronograma de cada operativo.",
    "Los operativos pueden suspenderse por las condiciones climáticas: antes de ir, mirá las redes del programa, que la página oficial indica.",
    "La página no dice si cada servicio tiene costo: consultalo en el operativo o en la fuente.",
    "Son operativos temporales, no centros fijos: por eso no están en el mapa.",
  ],
}

/**
 * The operativos of the cronograma of «Más servicios en tu barrio» (September and October 2026), as the official page lists them, read on
 * NEIGHBORHOOD_AGENDA_READ_ON. Only October is kept: it changes every week, and the page only lists days, hours and places (the services of
 * each week are on the page). The operativos are suspended by weather: that is said where the agenda is shown.
 */
export const NEIGHBORHOOD_AGENDA_READ_ON = "2026-10-11"
export const NEIGHBORHOOD_AGENDA_UNTIL = "2026-10-31"

export type AgendaOperativo = { date: string, hours: string, place: string, note?: string }

export const NEIGHBORHOOD_AGENDA: AgendaOperativo[] = [
  { date: "2026-10-01", hours: "9 a 14 h", place: "Plaza 25 de Agosto, Charlone y Heredia (Villa Ortúzar)" },
  { date: "2026-10-02", hours: "9 a 14 h", place: "Plaza San Miguel de Garicoits, Av. Álvarez Thomas 1231 (Colegiales)" },
  { date: "2026-10-03", hours: "9 a 14 h", place: "Parque Avellaneda, Av. Directorio 4147 (Parque Avellaneda)" },
  { date: "2026-10-05", hours: "9 a 14 h", place: "Plaza Salaberry, Av. Alberdi y Pilar (Mataderos)", note: "operativo para personas mayores" },
  { date: "2026-10-06", hours: "9 a 14 h", place: "Parque Florentino Ameghino, Av. Caseros y Pichincha (Parque Patricios)" },
  { date: "2026-10-07", hours: "9 a 14 h", place: "Plaza Colombia, Av. Montes de Oca y Brandsen (Barracas)" },
  { date: "2026-10-08", hours: "9 a 14 h", place: "Plaza Aristóbulo del Valle, Cuenca y Marcos Sastre (Villa del Parque)" },
  { date: "2026-10-09", hours: "9 a 14 h", place: "Plazoleta Nueva Pompeya, Av. Sáenz y Traful (Nueva Pompeya)" },
  { date: "2026-10-10", hours: "9 a 14 h", place: "Parque Lezama, Av. Martín García y Defensa (San Telmo)" },
  { date: "2026-10-12", hours: "9 a 14 h", place: "Plaza Manuel Belgrano, Vuelta de Obligado 2042 (Belgrano)" },
  { date: "2026-10-13", hours: "9 a 14 h", place: "Barrio Castex, Av. Lafuente y Crisóstomo Álvarez (Flores)" },
  { date: "2026-10-14", hours: "9 a 14 h", place: "Parque Chacabuco, Emilio Mitre y Av. Asamblea (Parque Chacabuco)" },
  { date: "2026-10-15", hours: "9 a 14 h", place: "Plaza Santa Rita, Álvarez Jonte 3222 (Villa Santa Rita)" },
  { date: "2026-10-16", hours: "9 a 14 h", place: "Plaza Roque Sáenz Peña, Av. Juan B. Justo y Boyacá (Villa General Mitre)" },
  { date: "2026-10-17", hours: "9 a 14 h", place: "Parque Rivadavia, Av. Rivadavia 4800 (Caballito)" },
  { date: "2026-10-19", hours: "9 a 14 h", place: "Plaza Monseñor Miguel de Andrea, Av. Córdoba y Dr. Tomás Manuel de Anchorena (Recoleta)" },
  { date: "2026-10-20", hours: "9 a 14 h", place: "La Carbonilla, Manuel Trelles 2750, Playón Sector 1 (Paternal)" },
  { date: "2026-10-21", hours: "9 a 14 h", place: "Plazoleta Baldomero Fernández Moreno, Av. Corrientes y Luis María Drago (Villa Crespo)" },
  { date: "2026-10-22", hours: "9 a 14 h", place: "Complejo Soldati, Corrales 3491 (Villa Soldati)" },
  { date: "2026-10-22", hours: "9 a 14 h", place: "Plaza Miserere, Av. Rivadavia y Av. Pueyrredón (Balvanera)" },
  { date: "2026-10-23", hours: "9 a 14 h", place: "Plaza Félix Lima, Cuba y Ramallo (Núñez)" },
  { date: "2026-10-24", hours: "9 a 14 h", place: "Plaza Arenales, Mercedes y Nueva York (Villa Devoto)" },
  { date: "2026-10-26", hours: "16 a 20 h", place: "Parque José Martí (Lugano I y II), Av. Soldado de la Frontera y Ana Díaz (Villa Lugano)" },
  { date: "2026-10-27", hours: "9 a 14 h", place: "La Rural, Av. Sarmiento y Av. Santa Fe (Palermo)" },
  { date: "2026-10-28", hours: "9 a 14 h", place: "La Rural, Av. Sarmiento y Av. Santa Fe (Palermo)" },
  { date: "2026-10-29", hours: "9 a 14 h", place: "Plaza 25 de Agosto, Charlone y Heredia (Villa Ortúzar)" },
  { date: "2026-10-31", hours: "9 a 14 h", place: "Plaza Martín Fierro, La Rioja y Cochabamba (San Cristóbal)" },
]
