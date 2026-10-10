import { GLOSSARY_REFERENCES } from "./Section4.references"

/**
 * Más recursos · Glosario. Words that appear in AuxiliAR, defined with the sentence of the official page or law they come from or, for
 * the words of the map, with what AuxiliAR itself does. No term is explained beyond its source; where each one comes from is in
 * "Sobre AuxiliAR" (Section4.references.ts), not under the term. The name of each term is read from there: one copy.
 */
const DEFINITIONS: Record<string, string> = {
  "cesac": "Centro de salud público de la Ciudad de Buenos Aires. Junto con los Centros Médicos Barriales (CMB), forma el primer nivel de atención.",
  "primer-nivel-de-atencion": "El de los CeSAC y los Centros Médicos Barriales. Por teléfono se puede pedir turno de clínica médica o medicina general, pediatría y odontología.",
  "empadronamiento": "Trámite que se hace una sola vez, por el 147 o en persona en un centro de salud de la Ciudad, con un documento que acredite identidad.",
  "atencion-primaria": "Estrategia con la que la Ley 153 organiza el área estatal de salud de la Ciudad: en redes y niveles de atención, dando prioridad al primer nivel.",
  "gratuidad-de-las-acciones-de-salud": "Según la Ley 153, es la exención de cualquier forma de pago directo en el área estatal.",
  "consentimiento-informado": "Lo que el profesional debe solicitar a la persona antes de realizar estudios y tratamientos.",
  "calendario-nacional-de-vacunacion": "El conjunto de vacunas que el Ministerio de Salud de la Nación indica para todas las etapas de la vida. Sus vacunas son gratuitas y obligatorias para todos los habitantes del país.",
  "carnet-de-vacunas": "El carnet que se lleva al vacunatorio o al centro de salud para que puedan chequear las dosis de vacunas aplicadas.",
  "esi-educacion-sexual-integral": "Educación que articula aspectos biológicos, psicológicos, sociales, afectivos y éticos. Todas las personas que estudian tienen derecho a recibirla en escuelas públicas, de gestión estatal y privadas.",
  "anticoncepcion-hormonal-de-emergencia-ah": "Pastilla que se usa después de una relación sexual sin protección, si no se usó otro método o si falló el que se estaba usando.",
  "preservativo-vaginal": "Método de barrera de nitrilo que se usa en prácticas sexuales de penetración y protege el interior de la vagina y parte de la vulva.",
  "zoonosis": "Enfermedades comunes y transmisibles entre los animales y el ser humano.",
  "gratuita-y-gratuita-con-condiciones-en-e": "En AuxiliAR, una prestación se marca así solo cuando una fuente oficial lo confirma para esa prestación. «Con condiciones» indica que la fuente aclara requisitos, como un turno previo, una edad o el DNI.",
  "prestacion": "Lo que se atiende en un lugar, por ejemplo vacunación o salud mental. La gratuidad se mira prestación por prestación, nunca por centro entero.",
}

/** Más recursos · Glosario: a definition list (dl), in alphabetical order, so a screen reader announces each term with its definition */
export default function Section4Content() {
  const terms = GLOSSARY_REFERENCES.map(({ id, term }) => ({ term, definition: DEFINITIONS[id] })).sort((a, b) => a.term.localeCompare(b.term, "es"))
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">Palabras que vas a encontrar en AuxiliAR, explicadas con lo que dicen las fuentes oficiales.</p>
      <dl className="m-0 flex flex-col gap-3">
        {terms.map(({ term, definition }) => (
          <div key={term} className="rounded-2xl border border-line-strong bg-card p-4">
            <dt className="text-lg font-extrabold">{term}</dt>
            <dd className="m-0 mt-1">
              {definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
