// Sobre los datos del mapa: shown in "Sobre AuxiliAR" (DataSection) and read by the FAQ of Más recursos. Before: Centros de atención · Sobre los datos.
export type Point = { title: string, text: string[] }

/*
 * What is said here is what the verification system does (see client/src/data/resources/README.md): every place and, when it
 * has its own, every service carries who verified it, when, against which official source and until when it can be shown;
 * the cost of a service is only "free" if its source says so. If the system changes, this text changes with it.
 */
export const POINTS: Point[] = [
  {
    title: "Cómo verificamos",
    text: [
      "Antes de mostrar un centro, una persona de AuxiliAR comprueba sus datos contra una fuente oficial: la dirección, la ubicación en el mapa y las prestaciones, es decir, lo que se atiende en ese lugar.",
      "Anotamos quién lo verificó, cuándo y de qué fuente salió. La gratuidad, en cambio, siempre necesita la fuente propia de esa prestación. Si un dato cambia o dudamos de él, deja de mostrarse hasta que se vuelva a revisar.",
    ],
  },
  {
    title: "Qué significa gratuito",
    text: [
      "Decimos que una atención es gratuita solo cuando la fuente oficial lo dice para esa prestación en particular. Que un hospital o un centro sea público no significa que todo lo que ofrece sea gratis, así que la gratuidad se mira prestación por prestación, nunca por centro entero.",
      "Por eso el mapa muestra solo las prestaciones cuya gratuidad una fuente oficial confirma. Las que no tienen esa confirmación no se muestran, aunque el centro sí esté: un mismo centro puede aparecer con una sola prestación. Que una prestación no aparezca no quiere decir que sea paga: quiere decir que todavía no podemos confirmar que es gratuita.",
      "Cada prestación dice «Gratuita» o «Gratuita con condiciones». Si la fuente aclara condiciones (por ejemplo, «Con DNI argentino», turno previo o una edad), mostramos las condiciones junto a esa prestación, sin extenderlas a las demás.",
      "Que una prestación sea gratuita no asegura que haya turnos, vacunas o insumos disponibles ni un horario de atención: eso conviene consultarlo antes de ir.",
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
      "El mapa y la lista muestran solo lo que ya verificamos, y es una parte de los servicios que hay. Cuando una búsqueda no da resultados puede ser que ese servicio todavía no tenga su gratuidad confirmada por una fuente oficial, que su revisión haya vencido o que tu zona no esté cubierta aún. No significa que el servicio no exista.",
      "Probá con otras palabras, quitá filtros o consultá en el centro de salud u hospital más cercano.",
    ],
  },
  {
    title: "En el mapa y en la lista",
    text: ["El mapa y la lista muestran los mismos lugares. Un lugar sin ubicación verificada aparece solo en la lista: nunca le inventamos un punto."],
  },
]

