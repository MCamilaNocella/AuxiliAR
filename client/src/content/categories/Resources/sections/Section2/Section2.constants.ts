import type { SectionKeyCell } from "@/components/sectionBlocks/SectionKey"
import { BARRIO_REDES, BARRIO_TURNO_ODONTOLOGIA, BARRIO_TURNO_OFTALMOLOGIA, CUD_PAGINA, LEY_26529, MAS_SERVICIOS_PAGINA, TURNOS_CESAC_MODEL } from "../../Resources.sources"

/**
 * Más recursos · Trámites: the texts of the model (recursos-1). The CeSAC appointment repeats the Gobierno de la Ciudad's "Solicitud de
 * turnos en CESAC" (read on 2026-10-08); the CUD and «Más servicios en tu barrio», their official pages (read on 2026-10-10). Nothing
 * says the services of the neighbourhood operations are free, nor what the CUD covers in each case.
 */

export const PROCEDURES_KEY: SectionKeyCell[] = [
  { title: "Turno en un CeSAC", value: "Empadronate", label: "una sola vez", target: "cesac", tone: 2 },
  { title: "Historia clínica", value: "48 horas", label: "para que te den la copia", target: "historia", tone: 4 },
  { title: "Discapacidad", value: "CUD", label: "gratis y en todo el país", target: "cud", tone: 5 },
  { title: "En tu barrio", value: "Operativos", label: "salud, DNI y más", target: "barrio", tone: 1 },
]

export const CESAC = {
  lead: "Para los Centros de Salud y Acción Comunitaria de la Ciudad de Buenos Aires. Es gratis.",
  register: {
    title: "1. Empadronate, una sola vez",
    lead: "Por el 147 o en persona en cualquier centro de salud de la Ciudad, con un documento que acredite tu identidad. Sirven:",
    documents: ["DNI, cédula extranjera, cédula de la Policía Federal o pasaporte extranjero.", "Constancia de residencia precaria.", "Libreta cívica o de enrolamiento.", "Partida de nacimiento original, o certificado en trámite."],
    note: "Si cambia tu documento (por ejemplo, de residencia precaria a DNI), validá tus datos en un puesto de empadronamiento.",
  },
  appointment: {
    title: "2. Sacá el turno",
    lead: "Si ya te atendés en un CeSAC, con médico o médica de cabecera:",
    ways: ["Por la web, en el portal de turnos de la Ciudad (con tu usuario miBA).", "Por Boti, el WhatsApp de la Ciudad.", "Por teléfono, al 147, opción 1.", "En persona, en el centro de salud."],
  },
  which: {
    title: "Qué turnos hay",
    text: "Por teléfono se pide clínica médica o medicina general, pediatría y odontología. Algunas especialidades piden estudios previos o una derivación, y lo disponible depende de cada centro.",
  },
  online: { label: "Sacar el turno online", url: TURNOS_CESAC_MODEL.url },
}

/** Ley 26.529, arts. 14 and 19 */
export const CLINICAL_RECORD = [
  "Pedila en el hospital o centro donde te atendiste: es tuya.",
  "Te tienen que dar una copia autenticada en 48 horas, salvo una emergencia.",
  "También la pueden pedir tu representante legal y, con tu autorización, tu pareja o tus herederos.",
]

export const CUD = {
  lead: "El Certificado Único de Discapacidad es un documento público, válido en todo el país, que da acceso a los derechos y prestaciones de las leyes 22.431 y 24.901. Lo otorga una Junta Evaluadora. Es voluntario y gratuito.",
  steps: [
    "Hacé la consulta personalizada en la página oficial: te dicen qué documentación llevar y adónde ir.",
    "Reuní la documentación con el equipo de salud que te atiende: certificados, informes, planillas y estudios.",
    "Pedí turno para la Junta Evaluadora en el lugar que te indiquen.",
    "Andá el día que te asignen.",
    "Retirá el CUD (o la respuesta) donde y cuando te digan.",
  ],
  note: "Las exenciones de peajes o impuestos no son automáticas: se piden ante cada organismo.",
}

export const NEIGHBORHOOD = {
  lead: "Un programa de la Ciudad de Buenos Aires que lleva servicios y trámites a plazas y parques. Los servicios, días y lugares cambian en cada operativo.",
  services: [
    "Salud: oftalmología, odontología, control de presión y vacunación.",
    "Trámites: AGIP, ANSES, Mi BA, SUBE, DNI y pasaporte.",
    "Atención social y asesoramiento para personas con discapacidad.",
    "Justicia, defensa del consumidor y mediación vecinal.",
    "Veterinaria.",
    "Actividades culturales y recreativas.",
  ],
  before: ["Algunos servicios piden turno y tienen cupos.", "Si llueve se pueden suspender: mirá sus redes antes de ir.", "Preguntá en el lugar si el servicio que buscás tiene costo."],
  schedule: { label: "Ver el cronograma completo", url: MAS_SERVICIOS_PAGINA.url },
}

export const PROCEDURES_SOURCES = [TURNOS_CESAC_MODEL, LEY_26529, CUD_PAGINA, MAS_SERVICIOS_PAGINA, BARRIO_TURNO_ODONTOLOGIA, BARRIO_TURNO_OFTALMOLOGIA, BARRIO_REDES]

/**
 * The operativos of the cronograma of «Más servicios en tu barrio» (September and October 2026), as the official page lists them, read on
 * NEIGHBORHOOD_AGENDA_READ_ON. Only October is kept: it changes every week, and the page only lists days, hours and places (the services of
 * each week are on the page). The operativos are suspended by weather: that is said where the agenda is shown.
 */
export const NEIGHBORHOOD_AGENDA_READ_ON = "2026-10-11"

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
