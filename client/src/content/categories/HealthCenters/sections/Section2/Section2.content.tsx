const POINTS: { title: string, text: string }[] = [
  {
    title: "Solo lo verificado",
    text: "AuxiliAR muestra un centro y sus prestaciones solo mientras sus datos están verificados y dentro de su plazo de revisión. Cuando el plazo vence, el dato deja de mostrarse hasta que se vuelva a verificar.",
  },
  {
    title: "De dónde sale",
    text: "La información viene de fuentes oficiales, como los datos abiertos del Gobierno de la Ciudad de Buenos Aires y las páginas de cada centro. Cada lugar muestra la fecha en que se verificó.",
  },
  {
    title: "Lo que no sabemos, no lo decimos",
    text: "Si la fuente no lo dice, no damos por hecho que una atención sea gratuita, que no necesite turno ni cuál es su horario. Que un lugar sea público no significa que todas sus prestaciones sean gratuitas.",
  },
  {
    title: "En el mapa y en la lista",
    text: "El mapa y la lista muestran los mismos lugares. Un lugar sin ubicación verificada aparece solo en la lista; nunca le inventamos un punto.",
  },
  {
    title: "Cobertura",
    text: "Estamos incorporando establecimientos de a poco. Por ahora hay centros de la Ciudad de Buenos Aires; otras jurisdicciones se suman a medida que se verifican.",
  },
]

/** Centros de atención · Sobre los datos: how the places on the map are verified, in a few plain points */
export default function Section2Content() {
  return (
    <div className="mt-2 max-w-3xl">
      <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
        {POINTS.map(({ title, text }) => (
          <li key={title} className="rounded-2xl border border-line-strong bg-card p-4">
            <h3 className="m-0 text-lg font-extrabold">{title}</h3>
            <p className="m-0 mt-1 text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
