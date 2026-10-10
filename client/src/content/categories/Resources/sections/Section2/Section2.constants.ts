/**
 * Más recursos · Trámites: the texts of two informative guides, written from what their official pages say (read on 2026-10-10;
 * the pages show no date of update). They copy no date, place, phone number or requirement the pages do not give, say nothing about
 * what the CUD covers (that depends on each case and on the laws), and do not say that the services of the neighbourhood operations are free.
 * PENDING legal and administrative review before they are published.
 */
export const PENDING_NOTICE_TITLE = "Pendiente de revisión legal y administrativa"
export const PENDING_NOTICE_TEXT = "Este resumen se hizo con la página oficial y todavía no fue revisado. No es asesoramiento legal ni administrativo: para tu caso, consultá la fuente."

export const CUD_GUIDE = {
  title: "Cómo tramitar el CUD",
  intro: "El Certificado Único de Discapacidad (CUD) es un documento público, válido en todo el país. Lo otorga una Junta Evaluadora. El trámite es voluntario y gratuito.",
  uses: "Permite acceder a los derechos y prestaciones que prevén las leyes 22.431 y 24.901. Qué corresponde en cada caso depende de esas leyes y de tu situación.",
  steps: [
    "Hacé la consulta personalizada que indica la página oficial: te dicen qué documentación llevar y adónde ir.",
    "Reuní la documentación con el equipo de salud que te atiende: certificados médicos, informes, planillas y estudios complementarios. Cuál necesitás depende de tu consulta.",
    "Acercate al lugar que te indiquen y pedí turno para la Junta Evaluadora.",
    "Asistí el día que te asignen.",
    "Retirá el CUD, o la denegatoria, en el lugar y la fecha que te indiquen.",
  ],
  notes: ["Las exenciones de peajes o de impuestos no son automáticas: se piden ante la autoridad de cada norma.", "La página oficial no informa la vigencia del CUD."],
}

export const NEIGHBORHOOD_GUIDE = {
  title: "Servicios y trámites en tu barrio",
  intro: "«Más servicios en tu barrio» es un programa del Gobierno de la Ciudad de Buenos Aires que lleva servicios y trámites a distintos barrios, en operativos en espacios públicos.",
  variable: "Los servicios, los días, los horarios y los lugares cambian según la semana y el operativo. Que un servicio exista en el programa no quiere decir que esté en el operativo de tu barrio.",
  servicesTitle: "Qué servicios puede haber",
  servicesLead: "Según la página oficial, entre otros:",
  services: [
    "Trámites y asesoramiento: AGIP, ANSES, Mi BA, SUBE, DNI y pasaporte.",
    "Atención social y asesoramiento para personas con discapacidad.",
    "Justicia, defensa del consumidor y mediación vecinal.",
    "Salud: oftalmología, odontología, toma de presión y vacunación.",
    "Servicios veterinarios.",
    "Actividades culturales y recreativas.",
  ],
  before: [
    "Algunos servicios piden turno y varios tienen cupos limitados. Lo indica el cronograma de cada operativo.",
    "Los operativos pueden suspenderse por las condiciones climáticas: antes de ir, mirá las redes del programa, que la página oficial indica.",
    "La página no dice si cada servicio tiene costo: consultalo en el operativo o en la fuente.",
    "Son operativos temporales, no centros fijos: por eso no están en el mapa.",
  ],
}
