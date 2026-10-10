/**
 * Más recursos · Glosario: the source of each term. Shown only in "Sobre AuxiliAR" (fuentes y referencias), never next to the term;
 * the page keeps the term and its definition (Section4.content.tsx). One copy: the term's name is read from here by both.
 */
export type GlossaryReference = { id: string, term: string, source: string }

export const GLOSSARY_REFERENCES: GlossaryReference[] = [
  { id: "cesac", term: "CeSAC (Centro de Salud y Acción Comunitaria)", source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC" },
  { id: "primer-nivel-de-atencion", term: "Primer nivel de atención", source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC" },
  { id: "empadronamiento", term: "Empadronamiento", source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC" },
  { id: "atencion-primaria", term: "Atención primaria", source: "Ley 153 de la Ciudad de Buenos Aires, art. 3" },
  { id: "gratuidad-de-las-acciones-de-salud", term: "Gratuidad de las acciones de salud", source: "Ley 153 de la Ciudad de Buenos Aires, art. 3" },
  { id: "consentimiento-informado", term: "Consentimiento informado", source: "Ley 153 de la Ciudad de Buenos Aires, art. 4" },
  { id: "calendario-nacional-de-vacunacion", term: "Calendario Nacional de Vacunación", source: "Ministerio de Salud de la Nación; Ley 27.491, arts. 2 y 7" },
  { id: "carnet-de-vacunas", term: "Carnet de vacunas", source: "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación" },
  { id: "esi-educacion-sexual-integral", term: "ESI (Educación Sexual Integral)", source: "Ley 26.150, art. 1" },
  { id: "anticoncepcion-hormonal-de-emergencia-ah", term: "Anticoncepción hormonal de emergencia (AHE)", source: "Ministerio de Salud de la Nación · Anticoncepción hormonal de emergencia" },
  { id: "preservativo-vaginal", term: "Preservativo vaginal", source: "Ministerio de Salud de la Nación · Preguntas frecuentes sobre preservativo vaginal" },
  { id: "zoonosis", term: "Zoonosis", source: "Gobierno de la Ciudad de Buenos Aires · Instituto de Zoonosis Luis Pasteur" },
  { id: "gratuita-y-gratuita-con-condiciones-en-e", term: "«Gratuita» y «Gratuita con condiciones» (en el mapa)", source: "AuxiliAR · cómo verificamos los datos" },
  { id: "prestacion", term: "Prestación", source: "AuxiliAR · cómo verificamos los datos" },
]
