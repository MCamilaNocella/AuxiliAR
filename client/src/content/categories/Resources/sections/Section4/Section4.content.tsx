/**
 * Más recursos · Glosario. Words that appear in AuxiliAR, defined with the sentence of the official page or law they come from
 * (named under each one) or, for the words of the map, with what AuxiliAR itself does. No term is explained beyond its source.
 */
type Term = { term: string, definition: string, source: string }

const TERMS: Term[] = [
  {
    term: "CeSAC (Centro de Salud y Acción Comunitaria)",
    definition: "Centro de salud público de la Ciudad de Buenos Aires. Junto con los Centros Médicos Barriales (CMB), forma el primer nivel de atención.",
    source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC",
  },
  {
    term: "Primer nivel de atención",
    definition: "El de los CeSAC y los Centros Médicos Barriales. Por teléfono se puede pedir turno de clínica médica o medicina general, pediatría y odontología.",
    source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC",
  },
  {
    term: "Empadronamiento",
    definition: "Trámite que se hace una sola vez, por el 147 o en persona en un centro de salud de la Ciudad, con un documento que acredite identidad.",
    source: "Gobierno de la Ciudad de Buenos Aires · Solicitud de turnos en CESAC",
  },
  {
    term: "Atención primaria",
    definition: "Estrategia con la que la Ley 153 organiza el área estatal de salud de la Ciudad: en redes y niveles de atención, dando prioridad al primer nivel.",
    source: "Ley 153 de la Ciudad de Buenos Aires, art. 3",
  },
  {
    term: "Gratuidad de las acciones de salud",
    definition: "Según la Ley 153, es la exención de cualquier forma de pago directo en el área estatal.",
    source: "Ley 153 de la Ciudad de Buenos Aires, art. 3",
  },
  {
    term: "Consentimiento informado",
    definition: "Lo que el profesional debe solicitar a la persona antes de realizar estudios y tratamientos.",
    source: "Ley 153 de la Ciudad de Buenos Aires, art. 4",
  },
  {
    term: "Calendario Nacional de Vacunación",
    definition: "El conjunto de vacunas que el Ministerio de Salud de la Nación indica para todas las etapas de la vida. Sus vacunas son gratuitas y obligatorias para todos los habitantes del país.",
    source: "Ministerio de Salud de la Nación; Ley 27.491, arts. 2 y 7",
  },
  {
    term: "Carnet de vacunas",
    definition: "El carnet que se lleva al vacunatorio o al centro de salud para que puedan chequear las dosis de vacunas aplicadas.",
    source: "Ministerio de Salud de la Nación · Calendario Nacional de Vacunación",
  },
  {
    term: "ESI (Educación Sexual Integral)",
    definition: "La que articula aspectos biológicos, psicológicos, sociales, afectivos y éticos. Todas las personas que estudian tienen derecho a recibirla en escuelas públicas, de gestión estatal y privadas.",
    source: "Ley 26.150, art. 1",
  },
  {
    term: "Anticoncepción hormonal de emergencia (AHE)",
    definition: "Pastilla que se usa después de una relación sexual sin protección, si no se usó otro método o si falló el que se estaba usando.",
    source: "Ministerio de Salud de la Nación · Anticoncepción hormonal de emergencia",
  },
  {
    term: "Preservativo vaginal",
    definition: "Método de barrera de nitrilo que se usa en prácticas sexuales de penetración y protege el interior de la vagina y parte de la vulva.",
    source: "Ministerio de Salud de la Nación · Preguntas frecuentes sobre preservativo vaginal",
  },
  {
    term: "Zoonosis",
    definition: "Enfermedades comunes y transmisibles entre los animales y el ser humano.",
    source: "Gobierno de la Ciudad de Buenos Aires · Instituto de Zoonosis Luis Pasteur",
  },
  {
    term: "«Gratuita» y «Gratuita con condiciones» (en el mapa)",
    definition: "En AuxiliAR, una prestación se marca así solo cuando una fuente oficial lo confirma para esa prestación. «Con condiciones» indica que la fuente aclara requisitos, como un turno previo, una edad o el DNI.",
    source: "AuxiliAR · cómo verificamos los datos",
  },
  {
    term: "Prestación",
    definition: "Lo que se atiende en un lugar, por ejemplo vacunación o salud mental. La gratuidad se mira prestación por prestación, nunca por centro entero.",
    source: "AuxiliAR · cómo verificamos los datos",
  },
]

/** Más recursos · Glosario: a definition list (dl), in alphabetical order, so a screen reader announces each term with its definition */
export default function Section4Content() {
  const terms = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, "es"))
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-4">
      <p className="m-0 text-lg text-ink">Palabras que vas a encontrar en AuxiliAR, explicadas con lo que dicen las fuentes oficiales.</p>
      <dl className="m-0 flex flex-col gap-3">
        {terms.map(({ term, definition, source }) => (
          <div key={term} className="rounded-2xl border border-line-strong bg-card p-4">
            <dt className="text-lg font-extrabold">{term}</dt>
            <dd className="m-0 mt-1">
              {definition}
              <span className="mt-1 block text-sm text-ink-soft">Fuente: {source}.</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
