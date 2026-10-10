/**
 * Más recursos · Preguntas frecuentes: the source of each answer. Shown only in "Sobre AuxiliAR" (fuentes y referencias), never under the
 * answer; the page keeps the question and its answer (Section3.content.tsx). One copy: the question is read from here by both.
 */
export type FaqReference = { id: string, question: string, source: string }

export const FAQ_REFERENCES: FaqReference[] = [
  { id: "vacunas-orden", question: "¿Necesito orden médica para vacunarme?", source: "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación" },
  { id: "turno-empadronamiento", question: "¿Tengo que anotarme antes de sacar turno en un CeSAC?", source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC" },
  { id: "residentes", question: "¿Me pueden atender en la Ciudad si no vivo en la Ciudad?", source: "Ley 153 de la Ciudad de Buenos Aires, art. 2" },
  { id: "anticonceptivos-costo", question: "¿Tengo que pagar los métodos anticonceptivos?", source: "Gobierno de la Ciudad de Buenos Aires · Métodos anticonceptivos; Ministerio de Salud de la Nación" },
  { id: "preservativo-vaginal", question: "¿Qué es el preservativo vaginal?", source: "Ministerio de Salud de la Nación · Preguntas frecuentes sobre preservativo vaginal" },
  { id: "gratuita", question: "¿Qué significa «Gratuita» y «Gratuita con condiciones» en el mapa?", source: "AuxiliAR · cómo verificamos los datos" },
  { id: "no-aparece", question: "Un lugar no aparece en el mapa, ¿quiere decir que no existe?", source: "AuxiliAR · cómo verificamos los datos" },
  { id: "campana-veterinaria", question: "¿Una campaña gratuita es atención veterinaria gratuita?", source: "AuxiliAR · Salud animal, con las páginas oficiales de cada municipio" },
]
