import { useState } from "react"
import { Link } from "react-router"
import { todayInArgentina } from "@/data/resources"
import { PATHS } from "@/router/paths"
import { planLoad, provinceLabel } from "@/utils/places"
import { revealEmergencies } from "@/utils/revealEmergencies"

type Point = { title: string, text: string[] }

/*
 * What is said here is what the verification system does (see client/src/data/resources/README.md): every place and, when it
 * has its own, every service carries who verified it, when, against which official source and until when it can be shown;
 * the cost of a service is only "free" if its source says so. If the system changes, this text changes with it.
 */
const POINTS: Point[] = [
  {
    title: "Cómo verificamos",
    text: [
      "Antes de mostrar un centro, una persona de AuxiliAR comprueba sus datos contra una fuente oficial: la dirección, la ubicación en el mapa y las prestaciones, es decir, lo que se atiende en ese lugar.",
      "Anotamos quién lo verificó, cuándo y de qué fuente salió. Cada prestación se apoya en la verificación del centro, salvo que tenga la suya propia. Si un dato cambia o dudamos de él, deja de mostrarse hasta que se vuelva a revisar.",
    ],
  },
  {
    title: "Qué significa gratuito",
    text: [
      "Decimos que una atención es gratuita solo cuando la fuente oficial lo dice para esa prestación en particular. Que un hospital o un centro sea público no significa que todo lo que ofrece sea gratis, así que la gratuidad se mira prestación por prestación, nunca por centro entero.",
      "En la ficha de un lugar, «Gratuita» aparece arriba solo si todas las prestaciones mostradas están verificadas como gratuitas; si no, aparece junto a cada prestación que lo está. Si la fuente aclara condiciones (por ejemplo, «Con DNI argentino», turno previo o una edad), la prestación dice «Gratuita con condiciones» y mostramos las condiciones junto a esa prestación, sin extenderlas a las demás.",
      "Si la fuente no habla del costo, no escribimos ni «gratuito» ni «arancelado»: no lo sabemos. En ese caso conviene consultarlo antes de ir.",
    ],
  },
  {
    title: "La fecha de verificación",
    text: [
      "En cada ficha ves «Verificada el…», el día en que comprobamos los datos contra la fuente oficial, y «Se vuelve a revisar antes del…», el límite de esa verificación. Pasado ese día, el lugar deja de aparecer hasta que se verifique de nuevo.",
      "La fecha no asegura que nada haya cambiado desde entonces: los horarios y los turnos pueden variar. Si podés, confirmá con el centro antes de ir.",
    ],
  },
  {
    title: "Si no aparece, no quiere decir que no exista",
    text: [
      "El mapa y la lista muestran solo lo que ya verificamos, y es una parte de los servicios que hay. Cuando una búsqueda no da resultados puede ser que ese servicio todavía no esté verificado, que su revisión haya vencido o que tu zona no esté cubierta aún. No significa que el servicio no exista.",
      "Probá con otras palabras, quitá filtros o consultá en el centro de salud u hospital más cercano.",
    ],
  },
  {
    title: "En el mapa y en la lista",
    text: ["El mapa y la lista muestran los mismos lugares. Un lugar sin ubicación verificada aparece solo en la lista: nunca le inventamos un punto."],
  },
]

/** Centros de atención · Sobre los datos: how the places on the map are verified, in plain words, and where it covers today */
export default function Section2Content() {
  // The provinces that have verified places today (names only: the numbers of the index are not for people)
  const [day] = useState(() => todayInArgentina())
  const covered = planLoad({ day, province: null }).covered.map(provinceLabel)

  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-3">
      <p className="m-0 text-ink-soft">
        Estas son las reglas con las que mostramos los centros del{" "}
        <Link to={PATHS.centers} className="font-bold">
          Mapa AuxiliAR
        </Link>
        .
      </p>

      <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
        {POINTS.map(({ title, text }) => (
          <li key={title} className="rounded-2xl border border-line-strong bg-card p-4">
            <h3 className="m-0 text-lg font-extrabold">{title}</h3>
            <div className="mt-1 flex flex-col gap-2 text-ink-soft">
              {text.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </li>
        ))}

        <li className="rounded-2xl border border-line-strong bg-card p-4">
          <h3 className="m-0 text-lg font-extrabold">Fuentes y alcance</h3>
          <div className="mt-1 flex flex-col gap-2 text-ink-soft">
            <p className="m-0">
              La información viene de fuentes oficiales: por ahora, los datos abiertos del Gobierno de la Ciudad de Buenos Aires y las páginas oficiales de cada centro. Cada ficha nombra su fuente y trae el
              enlace para consultarla.
            </p>
            <p className="m-0">
              {covered.length === 0
                ? "Por ahora no hay centros verificados para mostrar."
                : covered.length === 1
                  ? `Hoy solo hay centros verificados en ${covered[0]}.`
                  : `Hoy hay centros verificados en ${covered.join(", ")}.`}{" "}
              En el resto del país todavía no tenemos cobertura: estamos incorporando establecimientos de a poco, y las zonas con cobertura son las que ofrece el selector de provincias del mapa.
            </p>
          </div>
        </li>
      </ul>

      <p className="m-0 text-ink-soft">
        Si hay riesgo inmediato, no busques un centro:{" "}
        <button type="button" onClick={revealEmergencies} className="-my-2.5 inline-block cursor-pointer border-0 bg-transparent py-2.5 font-bold text-brand underline underline-offset-4">
          mirá los números de emergencia
        </button>
        .
      </p>
    </div>
  )
}
