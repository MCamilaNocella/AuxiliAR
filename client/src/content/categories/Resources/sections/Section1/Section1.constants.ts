import type { SectionKeyCell } from "@/components/sectionBlocks/SectionKey"
import type { SoftCard } from "@/components/sectionBlocks/SoftCards"
import { LEY_153, LEY_25673_MODEL, LEY_25871, LEY_26150_MODEL, LEY_26529, LEY_26657_MODEL, LEY_27491, SSSALUD } from "../../Resources.sources"

/** Más recursos · Derechos: the texts of the model (recursos-1), in plain words, each with its law. Not legal advice */

export const RIGHTS_KEY: SectionKeyCell[] = [
  { title: "Al atenderte", value: "Ley 26.529", label: "en todo el país, público o privado", target: "paciente", tone: 2 },
  { title: "Seas de donde seas", value: "Sin excepción", label: "migrantes y no residentes", target: "todos", tone: 4 },
  { title: "Salud mental", value: "Ley 26.657", label: "6 derechos", target: "mental", tone: 5 },
  { title: "Si algo falla", value: "Reclamá", label: "obra social o prepaga", target: "reclamar", tone: 1 },
]

/** Ley 26.529, arts. 2 (a to f) and 14 */
export const PATIENT_RIGHTS: SoftCard[] = [
  { title: "Que te atiendan", text: "Sin discriminación de ningún tipo. Solo pueden dejar de atenderte si otro profesional se hace cargo." },
  { title: "Trato digno", text: "Con respeto por tus convicciones personales y morales y por tu intimidad." },
  { title: "Confidencialidad", text: "Lo que se sabe de tu salud es confidencial, salvo que vos o un juez autoricen otra cosa." },
  { title: "Decidir", text: "Aceptar o rechazar tratamientos, y cambiar de opinión después." },
  { title: "Información", text: "Saber qué te pasa (o elegir no saberlo), y tenerlo por escrito si querés una segunda opinión." },
  { title: "Tu historia clínica", text: "Es tuya: si la pedís, te tienen que dar una copia en 48 horas, salvo una emergencia." },
]

/** Ley 25.871, art. 8; Ley 153 (Ciudad), arts. 2 and 3 */
export const ANYWHERE_RIGHTS: SoftCard[] = [
  {
    title: "Si sos de otro país",
    text: "No te pueden negar ni limitar la atención de salud por tu situación migratoria, aunque no tengas los papeles en regla. En el centro de salud te tienen que orientar para hacer los trámites.",
    law: "Ley 25.871",
  },
  {
    title: "Si no vivís en la Ciudad",
    text: "La Ley Básica de Salud de la Ciudad de Buenos Aires alcanza a todas las personas, vivan o no ahí. En el sistema público no pagás: si tenés obra social o prepaga, la Ciudad se lo cobra a ellas.",
    law: "Ley 153",
  },
]

export const MENTAL_RIGHTS_LEAD = "La Ley Nacional de Salud Mental (26.657) reconoce estos derechos a las personas con padecimiento mental:"

export const MENTAL_RIGHTS = [
  "Recibir el tratamiento más conveniente, el que menos limite tus derechos y libertades.",
  "Que te acompañen tus familiares, tus afectos o la persona que elijas, antes, durante y después del tratamiento.",
  "Acceder a tu historia clínica. También pueden hacerlo tu abogado, un familiar o la persona que elijas.",
  "No ser discriminada ni discriminado por tener, o haber tenido, un padecimiento mental.",
  "Que te atiendan en un hospital general, preferentemente sin internación.",
  "Que la medicación responda a tus necesidades de salud y nunca se use como castigo.",
]

export const MENTAL_RIGHTS_NOTE = "Rechazar la atención de una persona por tener un padecimiento mental es discriminación."

/** Ley 27.491, arts. 2, 7 and 10; Ley 25.673; Ley 26.150 */
export const OTHER_RIGHTS: SoftCard[] = [
  { title: "Vacunas gratis", text: "Las del Calendario Nacional son gratuitas y obligatorias, para todas las edades y en todo el país. Quien tiene chicos a cargo es responsable de vacunarlos.", law: "Ley 27.491" },
  { title: "Salud sexual", text: "Toda la población tiene derecho a información, orientación, métodos y prestaciones de salud sexual y reproductiva.", law: "Ley 25.673" },
  { title: "Educación sexual integral", text: "Todas las personas que estudian tienen derecho a recibirla, en escuelas públicas y privadas.", law: "Ley 26.150" },
]

export const COMPLAINT = {
  title: "Si tu obra social o prepaga no cumple",
  text: "La Superintendencia de Servicios de Salud controla a las obras sociales y prepagas de todo el país. Ahí podés hacer consultas y denuncias: por teléfono, de 8 a 16, en su Centro de Atención Virtual o con turno.",
  phone: { display: "0800-222-72583", dial: "080022272583" },
}

export const RIGHTS_SOURCES = [LEY_26529, LEY_25871, LEY_153, LEY_26657_MODEL, LEY_27491, LEY_25673_MODEL, LEY_26150_MODEL, SSSALUD]
