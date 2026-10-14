import type { GlossaryTerm } from "@/components/sectionBlocks/Glossary"
import type { SectionKeyCell } from "@/components/sectionBlocks/SectionKey"
import { ANTICONCEPTIVOS_CABA, LEY_153, LEY_25673_MODEL, LEY_25871, LEY_26150_MODEL, LEY_26529, SSSALUD, TURNOS_CESAC_MODEL, VACUNAS_PAGINA } from "../../Resources.sources"

/** Más recursos · Dudas: the questions and the glossary of the model (recursos-1). Where each answer and word comes from: Section3.references.ts */

export type FaqItem = { id: string, question: string, answer: string[] }

export const FAQ: FaqItem[] = [
  { id: "negar-atencion", question: "¿Me pueden negar la atención?", answer: ["No. La Ley 26.529 dice que tenés derecho a que te atiendan sin discriminación de ningún tipo, y que solo pueden dejar de atenderte si otro profesional se hace cargo."] },
  { id: "migrantes", question: "Soy de otro país y no tengo DNI, ¿me atienden?", answer: ["Sí. La Ley de Migraciones (25.871) dice que no se te puede negar ni restringir la atención de salud por tu situación migratoria. Además, en el centro de salud te tienen que orientar para regularizarla."] },
  { id: "residentes", question: "¿Me atienden en la Ciudad si no vivo ahí?", answer: ["Sí. La Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires, alcanza a todas las personas, vivan o no en la Ciudad."] },
  { id: "vacunas-orden", question: "¿Necesito orden médica para vacunarme?", answer: ["No. Las vacunas del Calendario Nacional están en centros de salud y hospitales públicos de todo el país y no piden orden médica. Llevá tu carnet si lo tenés."] },
  { id: "turno-empadronamiento", question: "¿Tengo que anotarme antes de pedir turno en un CeSAC?", answer: ["Sí, una sola vez: el empadronamiento, por el 147 o en persona, con un documento. El paso a paso está en Trámites."] },
  {
    id: "anticonceptivos-costo",
    question: "¿Tengo que pagar los anticonceptivos?",
    answer: [
      "No. En la Ciudad de Buenos Aires, la atención y los métodos son gratuitos en el sistema público y las obras sociales y prepagas los tienen que dar sin costo.",
      "En el resto del país, la Ley 25.673 los incluye en la cobertura obligatoria: se piden en centros de salud y hospitales, o a tu obra social o prepaga.",
    ],
  },
  { id: "reclamo", question: "Mi obra social o prepaga no me cubre algo, ¿dónde reclamo?", answer: ["En la Superintendencia de Servicios de Salud, que las controla: 0800-222-72583, de 8 a 16, o en su Centro de Atención Virtual."] },
  {
    id: "gratuita",
    question: "¿Qué significa «Gratuita» en el mapa?",
    answer: [
      "Que una fuente oficial confirma que esa prestación es gratis. Que un hospital sea público no quiere decir que todo lo que ofrece lo sea: por eso lo miramos prestación por prestación.",
      "«Gratuita con condiciones» quiere decir que la fuente pide algo, como un turno, una edad o el DNI, y lo mostramos al lado.",
    ],
  },
  {
    id: "no-aparece",
    question: "Un lugar no aparece en el mapa, ¿no existe?",
    answer: [
      "No necesariamente. El mapa muestra solo lo que ya verificamos: puede que todavía no tengamos confirmada su gratuidad o que tu zona no esté cubierta.",
      "Probá con otras palabras, sacá filtros o consultá en el centro de salud más cercano.",
    ],
  },
]

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Atención primaria", text: "La forma en que la Ley 153 organiza la salud pública de la Ciudad: en redes y niveles, dando prioridad al primer nivel." },
  { term: "Calendario Nacional de Vacunación", text: "Las vacunas que el Ministerio de Salud de la Nación indica para cada etapa de la vida. Son gratuitas y obligatorias." },
  { term: "Carnet de vacunas", text: "El que llevás al vacunatorio o al centro de salud para que vean qué dosis tenés." },
  { term: "CeSAC", text: "Centro de Salud y Acción Comunitaria: centro de salud público de la Ciudad de Buenos Aires. Con los Centros Médicos Barriales, forma el primer nivel de atención." },
  { term: "Consentimiento informado", text: "Tu permiso, que el profesional te tiene que pedir antes de hacerte estudios o tratamientos." },
  { term: "CUD", text: "Certificado Único de Discapacidad: documento público, válido en todo el país, que da acceso a derechos y prestaciones. Es gratuito." },
  { term: "Empadronamiento", text: "Trámite que se hace una sola vez, por el 147 o en un centro de salud de la Ciudad, para poder sacar turnos." },
  { term: "ESI", text: "Educación Sexual Integral: une aspectos biológicos, psicológicos, sociales, afectivos y éticos. Es un derecho de todas las personas que estudian." },
  { term: "Gratuita / Gratuita con condiciones", text: "Cómo marca AuxiliAR una prestación cuando una fuente oficial confirma que es gratis. «Con condiciones»: la fuente pide algo, como turno, edad o DNI." },
  { term: "Historia clínica", text: "Todo lo que los profesionales registran de tu atención. Es tuya: te tienen que dar una copia en 48 horas." },
  { term: "Prestación", text: "Lo que se atiende en un lugar, como vacunación o salud mental." },
  { term: "Primer nivel de atención", text: "El de los CeSAC y los Centros Médicos Barriales: clínica médica, pediatría y odontología, entre otros." },
  { term: "Superintendencia de Servicios de Salud", text: "El organismo nacional que controla a las obras sociales y prepagas. Ahí podés hacer consultas y denuncias." },
  { term: "Zoonosis", text: "Enfermedades que se transmiten entre los animales y las personas." },
]

export const DOUBTS_KEY: SectionKeyCell[] = [
  { title: "Tocá la que te sirva", value: `${FAQ.length} preguntas`, label: "respuestas cortas", target: "faq", tone: 2 },
  { title: "Con buscador", value: "Glosario", label: `${GLOSSARY.length} palabras explicadas`, target: "glosario", tone: 4 },
]

export const DOUBTS_SOURCES = [LEY_26529, LEY_25871, LEY_153, VACUNAS_PAGINA, TURNOS_CESAC_MODEL, ANTICONCEPTIVOS_CABA, LEY_25673_MODEL, SSSALUD, LEY_26150_MODEL]
