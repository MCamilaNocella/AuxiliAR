/**
 * Más recursos · Dudas: the source of each question and of each word of the glossary. "Sobre AuxiliAR" (fuentes y referencias) lists
 * them; the section shows its own "Fuentes oficiales" at the end. One copy: the question and the term are read from Section3.constants.
 */
import { FAQ, GLOSSARY } from "./Section3.constants"

export type FaqReference = { id: string, question: string, source: string }
export type GlossaryReference = { term: string, source: string }

const FAQ_SOURCES: Record<string, string> = {
  "negar-atencion": "Ley 26.529, Derechos del Paciente, art. 2 a",
  "migrantes": "Ley 25.871 de Migraciones, art. 8",
  "residentes": "Ley 153 de la Ciudad de Buenos Aires, art. 2",
  "vacunas-orden": "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación",
  "turno-empadronamiento": "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CeSAC",
  "anticonceptivos-costo": "Gobierno de la Ciudad de Buenos Aires · Métodos anticonceptivos; Ley 25.673",
  "reclamo": "Superintendencia de Servicios de Salud · argentina.gob.ar",
  "gratuita": "AuxiliAR · cómo verificamos los datos",
  "no-aparece": "AuxiliAR · cómo verificamos los datos",
}

const GLOSSARY_SOURCES: Record<string, string> = {
  "Atención primaria": "Ley 153 de la Ciudad de Buenos Aires, art. 3",
  "Calendario Nacional de Vacunación": "Ministerio de Salud de la Nación; Ley 27.491, arts. 2 y 7",
  "Carnet de vacunas": "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación",
  "CeSAC": "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CeSAC",
  "Consentimiento informado": "Ley 153 de la Ciudad de Buenos Aires, art. 4",
  "CUD": "argentina.gob.ar · Cómo obtener el Certificado Único de Discapacidad (CUD)",
  "Empadronamiento": "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CeSAC",
  "ESI": "Ley 26.150, art. 1",
  "Gratuita / Gratuita con condiciones": "AuxiliAR · cómo verificamos los datos",
  "Historia clínica": "Ley 26.529, Derechos del Paciente, arts. 12 y 14",
  "Prestación": "AuxiliAR · cómo verificamos los datos",
  "Primer nivel de atención": "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CeSAC",
  "Superintendencia de Servicios de Salud": "Superintendencia de Servicios de Salud · argentina.gob.ar",
  "Zoonosis": "Gobierno de la Ciudad de Buenos Aires · Instituto de Zoonosis Luis Pasteur",
}

export const FAQ_REFERENCES: FaqReference[] = FAQ.map(({ id, question }) => ({ id, question, source: FAQ_SOURCES[id] }))

export const GLOSSARY_REFERENCES: GlossaryReference[] = GLOSSARY.map(({ term }) => ({ term, source: GLOSSARY_SOURCES[term] }))
