/**
 * Salud mental · directory of the places and lines the team's research of 12 October 2026 confirmed from official pages (documentary confirmation:
 * nobody phoned, visited or asked for an appointment). Written from base_revision.csv; only rows CONFIRMADO_DOCUMENTAL* are here. Left out on
 * purpose: everything pending, historic or with a disputed address (CeSAC 2, 8, 21, 24, 27, 29, 31, 47, 48, hospitals Piñero and Tornú for the guardia),
 * the one-day events, the courses and the research's draft texts of wellbeing. CeSAC 3 and 41 are on the map too and are marked: they are not copied twice
 * with different data. A phone number is written only as the page publishes it and with its source link; the national lines come from
 * data/resources/lines, not from here. Cost: only as each page says it; for the Ciudad's state services it is the Ley 153 (arts. 2 and 3.g), said once.
 */
export type DirectoryItem = {
  id: string
  title: string
  /** What it offers, in the page's words */
  what?: string
  address?: string
  phone?: string
  hours?: string
  who?: string
  how?: string
  /** A limit the page itself gives or the research found */
  note?: string
  /** The official page it comes from */
  url: string
}

export type Hospital = { id: string, title: string, address: string, comuna: string }

export type CesacItem = { n: number, title: string, barrio: string, what: string, address: string, comuna: string, phone: string, url: string, onMap?: boolean }

/** Hospitals with a 24-hour mental health guardia, 365 days: "Guardias hospitalarias", Gobierno de la Ciudad (read 2026-10-12). Piñero and Tornú are left out (their address is disputed) */
export const GUARDIAS_CABA: Hospital[] = [
  { id: "hospital-alvarez", title: "Hospital Álvarez", address: "Aranguren 2701", comuna: "Comuna 7" },
  { id: "hospital-argerich", title: "Hospital Argerich", address: "Pi y Margall 750", comuna: "Comuna 4" },
  { id: "hospital-durand", title: "Hospital Durand", address: "Díaz Vélez 5044", comuna: "Comuna 6" },
  { id: "hospital-fernandez", title: "Hospital Fernández", address: "Cerviño 3356", comuna: "Comuna 14" },
  { id: "hospital-grierson", title: "Hospital Grierson", address: "Av. Fernández de la Cruz 4402", comuna: "Comuna 8" },
  { id: "hospital-penna", title: "Hospital Penna", address: "Pedro Chutro 3380", comuna: "Comuna 4" },
  { id: "hospital-pirovano", title: "Hospital Pirovano", address: "Monroe 3555", comuna: "Comuna 12" },
  { id: "hospital-ramos-mejia", title: "Hospital Ramos Mejía", address: "Gral. Urquiza 609", comuna: "Comuna 3" },
  { id: "hospital-rivadavia", title: "Hospital Rivadavia", address: "Las Heras 2670", comuna: "Comuna 2" },
  { id: "hospital-santojanni", title: "Hospital Santojanni", address: "Pilar 950", comuna: "Comuna 9" },
  { id: "hospital-velez-sarsfield", title: "Hospital Vélez Sarsfield", address: "Calderón de la Barca 1550", comuna: "Comuna 10" },
  { id: "hospital-zubizarreta", title: "Hospital Zubizarreta", address: "Nueva York 3952", comuna: "Comuna 11" },
  { id: "hospital-alvear", title: "Hospital de Emergencias Psiquiátricas Alvear", address: "Av. Warnes 2630", comuna: "Comuna 15" },
  { id: "hospital-borda", title: "Hospital Borda", address: "Av. Ramón Carrillo 375", comuna: "Comuna 4" },
  { id: "hospital-moyano", title: "Hospital Moyano", address: "Brandsen 2570", comuna: "Comuna 4" },
  { id: "hospital-muniz", title: "Hospital Muñiz", address: "Uspallata 2272", comuna: "Comuna 4" },
]

/** Children's hospitals with the same guardia: the page does not say up to which age they attend ("confirmar límite etario") */
export const GUARDIAS_CABA_INFANTIL: Hospital[] = [
  { id: "hospital-tobar-garcia", title: "Hospital Tobar García", address: "Dr. Ramón Carrillo 315", comuna: "Comuna 4" },
  { id: "hospital-elizalde", title: "Hospital de Niños Pedro de Elizalde", address: "Av. Montes de Oca 40", comuna: "Comuna 1" },
  { id: "hospital-gutierrez", title: "Hospital de Niños Ricardo Gutiérrez", address: "Gallo 1330", comuna: "Comuna 2" },
]

/** CeSAC whose own official page lists mental health care (psychology or psychiatry) and whose address is not disputed. Hours are not published for these services */
export const CESAC_MENTAL: CesacItem[] = [
  { n: 1, title: "CeSAC Nº 1", barrio: "Barracas 1", what: "Psicología", address: "Vélez Sarsfield 1271", comuna: "Comuna 4", phone: "2821-3601", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-1" },
  { n: 3, title: "CeSAC Nº 3", barrio: "Villa Lugano 9", what: "Psicología adultos · Psicología niños y adolescentes", address: "Soldado de la Frontera 5144", comuna: "Comuna 8", phone: "2821-3603 (Principal) · 11 5048-1097 (Alternativo)", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-3", onMap: true },
  { n: 4, title: "CeSAC Nº 4", barrio: "Mataderos 1", what: "Salud mental infantil, de adolescentes y de adultos", address: "Av. J. B Alberdi 6300", comuna: "Comuna 9", phone: "2821-3604", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-4" },
  { n: 5, title: "CeSAC Nº 5", barrio: "Villa Lugano 1", what: "Psicología · Psiquiatría", address: "Av. Piedrabuena 3140", comuna: "Comuna 8", phone: "2821-3605", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-5" },
  { n: 6, title: "CeSAC Nº 6", barrio: "Villa Soldati 1", what: "Psicología", address: "Mariano Acosta 3673 (esq. Av. Intendente Rabanal, ex Av. Roca)", comuna: "Comuna 8", phone: "2821-3606", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-6" },
  { n: 7, title: "CeSAC Nº 7", barrio: "Villa Lugano 2", what: "Psicología", address: "2 de Abril de 1982 6850", comuna: "Comuna 8", phone: "2821-3607", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-7" },
  { n: 10, title: "CeSAC Nº 10", barrio: "Parque Patricios 1", what: "Psicología · Psiquiatría", address: "Amancio Alcorta 1402", comuna: "Comuna 4", phone: "2821-3610", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-10" },
  { n: 11, title: "CeSAC Nº 11", barrio: "Balvanera", what: "Psicología", address: "Agüero 940", comuna: "Comuna 3", phone: "2821-3611", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-11" },
  { n: 12, title: "CeSAC Nº 12", barrio: "Villa Urquiza", what: "Psicología", address: "Olazábal 3960", comuna: "Comuna 12", phone: "2821-3612", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-12" },
  { n: 13, title: "CeSAC Nº 13", barrio: "Parque Avellaneda", what: "Psicología · Psiquiatría", address: "Directorio 4210", comuna: "Comuna 9", phone: "2821-3613", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-13" },
  { n: 14, title: "CeSAC Nº 14", barrio: "Villa Lugano 3", what: "Psicología · Psiquiatría · espacio de salud mental con derivación interna", address: "Saravia 2486", comuna: "Comuna 9", phone: "2821-3614", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-14" },
  { n: 16, title: "CeSAC Nº 16", barrio: "Barracas 3", what: "Psicología · Salud mental · Taller de salud mental", address: "Osvaldo Cruz 2055", comuna: "Comuna 4", phone: "2821-3616", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-16" },
  { n: 19, title: "CeSAC Nº 19", barrio: "Flores 1", what: "Psicología · Psiquiatría · Psiquiatría infantil", address: "Curapaligüe 1905", comuna: "Comuna 7", phone: "2821-3619", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-19" },
  { n: 20, title: "CeSAC Nº 20", barrio: "Flores 2", what: "Psicología", address: "Ana María Janer y Charrua 2330", comuna: "Comuna 7", phone: "2821-3620", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-20" },
  { n: 22, title: "CeSAC Nº 22", barrio: "La Paternal 2", what: "Psicología", address: "Fragata Pres. Sarmiento 2152", comuna: "Comuna 15", phone: "2821-3622", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-22" },
  { n: 23, title: "CeSAC Nº 23", barrio: "Villa Luro", what: "Psicología", address: "Bacacay 5640", comuna: "Comuna 10", phone: "2821-3623", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-23" },
  { n: 26, title: "CeSAC Nº 26", barrio: "Palermo 2", what: "Psicología", address: "Gurruchaga 1939", comuna: "Comuna 14", phone: "2821-3626", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-26" },
  { n: 28, title: "CeSAC Nº 28", barrio: "Villa Lugano 10", what: "Psicología", address: "Santander 5955", comuna: "Comuna 8", phone: "2821-3628", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-28" },
  { n: 30, title: "CeSAC Nº 30", barrio: "Barracas 4", what: "Psicología", address: "Av. Amancio Alcorta 3100", comuna: "Comuna 4", phone: "2821-3630", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-30" },
  { n: 32, title: "CeSAC Nº 32", barrio: "Nueva Pompeya", what: "Psicología infanto juvenil", address: "Charrúa 2900", comuna: "Comuna 4", phone: "2821-3632", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-32" },
  { n: 33, title: "CeSAC Nº 33", barrio: "Palermo 3", what: "Psicología · Psiquiatría", address: "Córdoba 5741", comuna: "Comuna 14", phone: "2821-3633", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-33" },
  { n: 34, title: "CeSAC Nº 34", barrio: "La Paternal", what: "Psiquiatría de adultos · Psicología de niños y adolescentes · Trabajo social · Farmacia y enfermería", address: "Gral. José G. Artigas 2262", comuna: "Comuna 11", phone: "2821-3634", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-34" },
  { n: 35, title: "CeSAC Nº 35", barrio: "Barracas 6", what: "Psicología", address: "Osvaldo Cruz y Zavaleta", comuna: "Comuna 4", phone: "2821-3635", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-35" },
  { n: 36, title: "CeSAC Nº 36", barrio: "Floresta", what: "Psicología", address: "Mercedes 1371/ 79", comuna: "Comuna 10", phone: "2821-3636", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-36" },
  { n: 37, title: "CeSAC Nº 37", barrio: "Mataderos 2", what: "Psiquiatría · Psicología · Talleres de salud mental", address: "Av. los Corrales 6999 esquina Carhué", comuna: "Comuna 9", phone: "2821-3637", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-37" },
  { n: 38, title: "CeSAC Nº 38", barrio: "Almagro", what: "Psicología · Psiquiatría", address: "Av. Medrano 350", comuna: "Comuna 5", phone: "2821-3638", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-38" },
  { n: 39, title: "CeSAC Nº 39", barrio: "Parque Patricios 2", what: "Psicología", address: "24 de noviembre 1679", comuna: "Comuna 4", phone: "2821-3639", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-39" },
  { n: 40, title: "CeSAC Nº 40", barrio: "Flores 4", what: "Psicología", address: "Esteban Bonorino 1729", comuna: "Comuna 7", phone: "2821-3640", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-40" },
  { n: 41, title: "CeSAC Nº 41", barrio: "La Boca 2", what: "Salud Mental Niños y Adultos", address: "Ministro Brin 843", comuna: "Comuna 4", phone: "2821-3641 (Principal) · 4361-8736 (Alternativo)", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-41", onMap: true },
  { n: 42, title: "CeSAC Nº 42", barrio: "Boedo", what: "Psicología", address: "Av. La Plata 2241", comuna: "Comuna 5", phone: "11 2821-3642", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-42" },
  { n: 43, title: "CeSAC Nº 43", barrio: "Villa Lugano 6", what: "Psicología · Psiquiatría infantojuvenil · Espacio de salud mental", address: "Fonrouge 4377", comuna: "Comuna 8", phone: "2821-3643", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-43" },
  { n: 44, title: "CeSAC Nº 44", barrio: "Villa Lugano 7", what: "Psicología", address: "Saraza 4202", comuna: "Comuna 8", phone: "4601-3686", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-44" },
  { n: 49, title: "CeSAC Nº 49", barrio: "Barracas 7", what: "Psicología", address: "Agustín Magaldi 2189 y Camino de Sirga", comuna: "Comuna 4", phone: "2821-3649", url: "https://buenosaires.gob.ar/gcaba_historico/salud/cesac-49" },
]

/** Centro de Salud Mental Nº 1 (Ciudad): the page lists these services; it publishes no hours for them */
export const CSM_1: DirectoryItem[] = [
  { id: "csm-1#atencion-salud-mental", title: "Centro de Salud Mental Nº 1", what: "Atención ambulatoria para personas de todas las edades: orientación en salud mental, psicoterapia individual, grupal y familiar, tratamiento psiquiátrico, tratamiento de adicciones, orientación a padres, hospital de día infantojuvenil y de adultos, y farmacia", address: "Manuela Pedraza 1558", phone: "11 2821-3588", how: "Se atiende por demanda espontánea o por derivación de la red (área de responsabilidad). Consultá el horario de admisión.", url: "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/csm-no-1" },
]
/** Hospital Nacional Laura Bonaparte (Nación): three circuits of the same hospital, not three hospitals (2133 is the institutional address, 2099 the entrance of the guardia and of adults, Pasco 2130 the children's service) */
export const BONAPARTE: DirectoryItem[] = [
  { id: "bonaparte-guardia", title: "Guardia interdisciplinaria", what: "Evaluación de urgencias por profesionales de salud mental.", address: "Combate de los Pozos 2099", phone: "(11) 4304-6356 int. 1155, consultas lunes a viernes 8:00-20:00", hours: "24 horas, todos los días", who: "Mayores de 18 años según circuito publicado.", how: "Ingreso por guardia, por demanda espontánea.", note: "Sin pago directo para quienes tienen ciudadanía argentina o residencia permanente (art. 7.a, Ley 26.657). La Resolución 1066/2026 regula el cobro a personas extranjeras sin residencia permanente en los hospitales nacionales; las urgencias no se pueden negar ni demorar por trámites.", url: "https://www.argentina.gob.ar/salud/hospitalbonaparte/acceso-los-servicios-de-salud" },
  { id: "bonaparte-adultos", title: "Admisión y tratamiento de adultos", what: "Admisión y eventual tratamiento individual / grupal según evaluación.", address: "Combate de los Pozos 2099", phone: "(11) 4304-6356 int. 1155; info@hospitalbonaparte.gob.ar", hours: "Admisión lunes a viernes 8:00-14:00; consultorios externos 8:00-20:00", who: "Mayores de 18 años según circuito publicado.", how: "Admisión publica 10 turnos por día; no garantiza que queden cupos.", note: "Sin pago directo para quienes tienen ciudadanía argentina o residencia permanente (art. 7.a, Ley 26.657). La Resolución 1066/2026 regula el cobro a personas extranjeras sin residencia permanente en los hospitales nacionales; las urgencias no se pueden negar ni demorar por trámites.", url: "https://www.argentina.gob.ar/salud/hospitalbonaparte/acceso-los-servicios-de-salud" },
  { id: "bonaparte-nna", title: "Atención infantojuvenil", what: "Atención ambulatoria interdisciplinaria y grupos para pacientes y referentes.", address: "Pasco 2130", phone: "(11) 4306-7584 int. 1189", hours: "Admisión / consultas lunes a viernes 8:00-14:00", who: "Hasta 17 años.", how: "Enviar datos y motivo a serviciosaludmental.nna@gmail.com o consultar secretaría.", note: "Sin pago directo para quienes tienen ciudadanía argentina o residencia permanente (art. 7.a, Ley 26.657). La Resolución 1066/2026 regula el cobro a personas extranjeras sin residencia permanente en los hospitales nacionales; las urgencias no se pueden negar ni demorar por trámites.", url: "https://www.argentina.gob.ar/salud/hospitalbonaparte/acceso-los-servicios-de-salud" },
]
/** Lines of the Ciudad. The national lines (0800-999-0091, 141, 135) are not here: they come from data/resources/lines */
export const LINEAS_CABA: DirectoryItem[] = [
  { id: "linea-caba-1665", title: "Salud Mental Responde", what: "Asistencia profesional, contención y orientación a la red local.", phone: "0800-333-1665", hours: "24 horas, 7 días", who: "Personas que necesitan orientación en salud mental en CABA.", how: "Llamar desde la Ciudad según cobertura declarada.", url: "https://buenosaires.gob.ar/gcaba_historico/noticias/salud-mental-responde-asistencia-gratuita-y-disponible-las-24-horas-en-la" },
  { id: "linea-caba-108-3", title: "Línea 108, opción 3", what: "Primera escucha y orientación ante consumos problemáticos.", phone: "108, opción 3", hours: "24 horas, todo el año", who: "Personas con consumos problemáticos y su entorno.", how: "Llamar y elegir opción 3.", url: "https://buenosaires.gob.ar/gcaba_historico/atencion-e-integracion-social/linea-108-opcion-3-contencion-y-orientacion-en" },
]
/** Lines of other jurisdictions and the online listening chat */
export const LINEAS_OTRAS: DirectoryItem[] = [
  { id: "pba-linea-5462", title: "Provincia de Buenos Aires - Línea de salud mental", what: "Atención, acompañamiento y derivación en salud mental.", phone: "0800-222-5462", hours: "Lunes a viernes 8:00-24:00; fines de semana 10:00-22:00", who: "Personas que requieren asistencia en la provincia.", how: "Llamada directa al 0800.", note: "No atiende las 24 horas todos los días.", url: "https://www.ms.gba.gov.ar/sitios/saludmental/red-de-dispositivos-de-salud-mental-y-consumo-problematico-con-base-en-la-comunidad/" },
  { id: "cordoba-linea-5555", title: "Municipalidad de Córdoba - Escucha y orientación", what: "Contención y orientación en salud mental y adicciones.", phone: "0800-888-5555", hours: "24 horas, todos los días", who: "Vecinas/os de Córdoba Capital.", how: "Llamada directa.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
  { id: "entre-rios-135", title: "Entre Ríos - Línea 135", what: "Orientación y acompañamiento ante urgencias en salud mental.", phone: "135", hours: "24 horas", who: "Personas en crisis y su entorno.", how: "Llamar desde Entre Ríos.", url: "https://portal.entrerios.gov.ar/suicidio/" },
  { id: "jujuy-linea-4767", title: "Jujuy - Salud Mental Escucha", what: "Orientación y acompañamiento profesional en salud mental.", phone: "0800-888-4767", hours: "24 horas", who: "Personas de la provincia y su entorno.", how: "Llamada directa provincial.", url: "https://salud.jujuy.gob.ar/2026/06/16/pedir-ayuda-tambien-es-salud-mental-el-abordaje-que-impulsa-jujuy-para-acompanar-antes-que-el-malestar-avance/" },
  { id: "tucuman-135", title: "Tucumán - Línea 135 de urgencias en salud mental", what: "Orientación ante urgencias en salud mental y derivación.", phone: "135", hours: "24 horas", who: "Personas en urgencia, adolescentes y familias.", how: "Llamar desde Tucumán.", url: "https://msptucuman.gov.ar/red-integral-para-la-contencion-de-adolescentes-en-tucuman/" },
  { id: "neuquen-te-escucha", title: "Neuquén - Salud Mental Te Escucha", what: "Apoyo profesional y orientación ante crisis.", phone: "2995358191", hours: "24 horas", who: "Personas de Neuquén y su entorno.", how: "Contacto al número provincial publicado.", note: "La institución llama gratuita a la asistencia; el número es un celular y puede tener condiciones de comunicación que dependen de tu operador.", url: "https://salud.neuquen.gob.ar/hablemos-de-salud-mental-y-suicidio/" },
  { id: "formosa-3364", title: "Formosa - Línea de prevención del suicidio", what: "Contención y orientación profesional ante crisis y para allegados.", phone: "0800-888-3364", how: "Llamada al 0800 provincial.", note: "La página no publica el horario.", url: "https://agenfor.com.ar/2026/07/fortalecieron-acciones-para-la-prevencion-del-suicidio-en-el-espinillo/" },
  { id: "aqui-estoy-chat", title: "Aquí Estoy Chat / Res Non Verba Asociación Civil", what: "Escucha humana por voluntarios entrenados y supervisados; no terapia ni emergencia.", hours: "Lunes a viernes, 15:00 a 23:00, horario de Argentina", who: "Personas que buscan apoyo emocional.", how: "Entrar al sitio y al enlace oficial de WhatsApp.", note: "Es escucha de voluntarios: no es terapia ni una emergencia.", url: "https://aquiestoy.chat/" },
]
/** Ciudad's network for problematic use of substances ("Red de adicciones", read 2026-10-12) */
export const CONSUMOS_CABA: DirectoryItem[] = [
  { id: "cemar-2#consumos-problematicos", title: "Centro de día Cable a Tierra (CEMAR 2)", what: "Atención de consumos problemáticos", address: "Av. Iriarte 3501", phone: "2821-3672", hours: "Lunes a viernes 8–14:30", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "cesac-10#consumos-problematicos", title: "CeSAC Nº 10 · Centro Biedak", what: "Atención ambulatoria de consumos problemáticos: psicología, con operadores sociocomunitarios y promotora de salud", address: "Amancio Alcorta 1402", hours: "Lunes a viernes 8:30–14:30", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "hospital-alvarez#consumos-problematicos", title: "Hospital Álvarez", what: "Atención de consumos problemáticos", address: "Aranguren 2701", hours: "Lunes a viernes 8–12:30", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "hospital-fernandez#consumos-problematicos", title: "Hospital Fernández", what: "Atención de consumos problemáticos", address: "Cerviño 3356", hours: "Lunes a viernes 8–18; admisiones 9–14", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "hospital-pinero#consumos-problematicos", title: "Hospital Piñero", what: "Atención de consumos problemáticos", address: "Varela 1301", hours: "9–15; días no publicados", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "hospital-rivadavia#consumos-problematicos", title: "Hospital Rivadavia", what: "Atención de consumos problemáticos", address: "Las Heras 2670", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "estacion-saludable-chacabuco#acercate-consumos", title: "Estación Saludable Parque Chacabuco", what: "Acercate: acompañamiento de consumos problemáticos", address: "Emilio Mitre 995", phone: "11 3161-9798", hours: "Martes y jueves 16–21", how: "Por demanda espontánea.", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
  { id: "estacion-saludable-patricios#acercate-consumos", title: "Estación Saludable Parque Patricios", what: "Acercate: acompañamiento de consumos problemáticos", address: "Patagones y Monteagudo", phone: "11 3161-9798", hours: "Martes y jueves 16–21", how: "Por demanda espontánea.", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
]
/** Centro de Salud Mental Nº 3: two rows of the research are one place */
export const CSM_3: DirectoryItem[] = [
  { id: "csm-3-ameghino", title: "Centro de Salud Mental Nº 3 Arturo Ameghino", what: "Atención de alcoholismo (lunes a viernes de 8 a 12) y de consumos problemáticos (lunes a viernes de 12 a 16)", address: "Av. Córdoba 3120", phone: "11 3723-0224", how: "Consultá al centro cómo es la primera admisión; la página no asegura internación ni cupos.", url: "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones" },
]
/** Mutual-help groups: not clinical care */
export const APOYO_MUTUO: DirectoryItem[] = [
  { id: "aa", title: "Alcohólicos Anónimos de Argentina", what: "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.", who: "Personas que buscan dejar de beber; allegados en reuniones abiertas.", how: "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.", note: "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.", url: "https://aa.org.ar/informacion-primaria/problemas-con-el-alcohol/un-principiante-pregunta/" },
  { id: "alanon", title: "Al-Anon Argentina", what: "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.", who: "Familiares y amistades afectados por el consumo de alcohol de otra persona.", how: "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.", note: "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.", url: "https://alanon.org.ar/que-es-alanon/" },
  { id: "alateen", title: "Alateen Argentina", what: "Reuniones de apoyo mutuo; sin cuotas ni honorarios obligatorios.", who: "Jóvenes aproximadamente entre 12 y 18 años; la institución dice que el rango no es excluyente.", how: "Buscá un grupo y su horario en el directorio de la institución: cada grupo tiene su modalidad y su población.", note: "No es un centro de tratamiento, ni psicoterapia, ni una emergencia. Sin cuotas ni honorarios obligatorios; las contribuciones son voluntarias.", url: "https://alanon.org.ar/alateen/" },
]
/** Yoga classes of the Ciudad: the page gives schedule, age and how to register, but NOT the cost, so it is never said to be free */
export const YOGA_CABA: DirectoryItem[] = [
  { id: "caba-yoga-rosedal", title: "Yoga en Rosedal", what: "Clase de yoga de Plazas Activas", address: "Avenida Alcorta y Sarmiento, playón Estación Saludable", hours: "Sábados 14:00-16:00", who: "Mayores de 18 años.", note: "La página no informa el costo.", url: "https://buenosaires.gob.ar/gcaba_historico/yoga" },
  { id: "caba-yoga-chacabuco", title: "Yoga en Parque Chacabuco", what: "Clase de yoga de Plazas Activas", address: "Emilio Mitre y Asamblea", hours: "Martes 16:00-17:30", who: "Mayores de 18 años.", note: "La página no informa el costo.", url: "https://buenosaires.gob.ar/gcaba_historico/yoga" },
  { id: "caba-yoga-saavedra", title: "Yoga en Parque Saavedra", what: "Clase de yoga de Plazas Activas", address: "García del Río y Pinto", hours: "Lunes y miércoles 10:00-11:30", who: "Mayores de 18 años.", note: "La página no informa el costo.", url: "https://buenosaires.gob.ar/gcaba_historico/yoga" },
  { id: "caba-yoga-centenario", title: "Yoga en Parque Centenario", what: "Clase de yoga de Plazas Activas", address: "Díaz Vélez y Campichuelo", hours: "Miércoles 10:00-11:30 y 16:30-17:45; jueves 8:30-10:00 (franjas publicadas)", who: "Mayores de 18 años.", note: "La página no informa el costo.", url: "https://buenosaires.gob.ar/gcaba_historico/yoga" },
  { id: "caba-yoga-patricios", title: "Yoga en Parque Patricios", what: "Clase de yoga de Plazas Activas", address: "Caseros y Pepirí", hours: "Miércoles 15:30-16:30", who: "Mayores de 18 años.", note: "La página no informa el costo.", url: "https://buenosaires.gob.ar/gcaba_historico/yoga" },
]
/** Other jurisdictions, as the research confirmed them. Each page says its own cost; the ones that say "gratuita" are the institution's statement */
export const PROVINCIAS: { name: string, intro?: string, items: DirectoryItem[] }[] = [
  {
    name: "Córdoba",
    intro: "Para la admisión, consultá en la sede o en la línea municipal.",
    items: [
    { id: "cordoba-tramas", title: "Municipalidad de Córdoba - Tramas", what: "Atención individual y grupal ambulatoria con equipo interdisciplinario.", address: "San Jerónimo 2573", phone: "351 2266003", hours: "Lunes a viernes 8:00-18:00", who: "Mayores de 16 años con domicilio en Córdoba Capital.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
    { id: "cordoba-lazos", title: "Municipalidad de Córdoba - Lazos", what: "Escucha, orientación, acompañamiento, grupos y actividades terapéuticas.", address: "Bv. Castro Barros 559", phone: "351 5081286", hours: "Lunes a viernes 8:00-18:00", who: "Residentes de Córdoba Capital.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
    { id: "cordoba-aldeas", title: "Municipalidad de Córdoba - Las Aldeas", what: "Acompañamiento comunitario en salud mental y adicciones.", address: "Gabriel Ortega 8050", phone: "351 6100335", who: "Residentes de Córdoba Capital.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
    { id: "cordoba-jaire", title: "Municipalidad de Córdoba - Jaire", what: "Acompañamiento ambulatorio de consumos y actividades comunitarias.", address: "Ancasti 5750", phone: "351 6100536", who: "Residentes de Córdoba Capital con necesidades de acompañamiento.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
    { id: "cordoba-pec", title: "Municipalidad de Córdoba - PEC Yapeyú", what: "Primera escucha y atención terapéutica individual y grupal.", address: "Bailén 196", phone: "351 5907343", who: "Residentes de Córdoba Capital.", url: "https://cordoba.gob.ar/cinco-lugares-y-un-centro-telefonico-para-recibir-atencion/" },
    { id: "unc-violencias", title: "Universidad Nacional de Córdoba - Acompañamiento psicológico por violencias de género", what: "Acompañamiento psicológico específico por violencias universitarias; no espacio terapéutico general.", address: "DASPU, Ciudad Universitaria, consultorio 129", phone: "psico.violenciasdegenero@rectorado.unc.edu.ar", hours: "Lunes a viernes 9:00-13:00", who: "Docentes, nodocentes y estudiantes de la UNC.", how: "Solicitar turno por correo.", url: "https://www.unc.edu.ar/node/38836" },
    ],
  },
  {
    name: "Entre Ríos",
    intro: "Para la admisión, consultá en el centro de salud o en Desarrollo Humano de Crespo.",
    items: [
    { id: "crespo-psico-minguillon", title: "Crespo - Centro Comunitario Dr. Salustiano Minguillón", what: "Atención psicológica en CAPS municipales.", address: "España 748", phone: "4951160 int. 237", hours: "Lunes 14:00-18:00", url: "https://www.crespo.gob.ar/salud-mental-y-adicciones/" },
    { id: "crespo-psico-san-miguel", title: "Crespo - Centro de Salud Municipal San Miguel", what: "Atención psicológica en CAPS municipales.", address: "Los Reseros y Linares Cardozo", phone: "4951160 int. 235", hours: "Lunes 8:00-12:00; miércoles 14:00-19:00", url: "https://www.crespo.gob.ar/salud-mental-y-adicciones/" },
    { id: "crespo-psico-nido-goldenberg", title: "Crespo - Edificio NIDO Dr. Adolfo Goldenberg", what: "Atención psicológica en CAPS municipales.", address: "Mendoza 855", phone: "4951160 int. 216", hours: "Martes 8:00-12:00; miércoles 14:30-18:30; viernes 8:00-12:00", url: "https://www.crespo.gob.ar/salud-mental-y-adicciones/" },
    { id: "crespo-escucha", title: "Crespo - Espacio de primera escucha en consumos", what: "Escucha, contención, orientación y derivación para personas con consumos y allegados.", address: "Centro Comunitario Dr. Salustiano Minguillón; calle no publicada en esta fuente", hours: "Lunes por la mañana; hora exacta no publicada", how: "Consultar en Desarrollo Humano.", url: "https://www.crespo.gob.ar/salud-mental-y-adicciones/" },
    { id: "crespo-estres", title: "Crespo - Programa de manejo del estrés y ansiedad", what: "Programa intensivo de cinco días con equipo interdisciplinario y estrategias de afrontamiento y autocuidado.", phone: "Desarrollo Humano: 25 de Mayo 907; 4951160 int. 105", how: "Consultar próxima edición en Desarrollo Humano; no hay calendario de inscripción vigente publicado.", url: "https://www.crespo.gob.ar/salud-mental-y-adicciones/" },
    ],
  },
  {
    name: "Jujuy",
    items: [
    { id: "jujuy-sm-digital", title: "Jujuy - Salud Mental Digital", what: "Consulta virtual espontánea y seguimiento profesional.", hours: "Lunes a viernes 8:00-20:00", who: "Personas que requieren consulta en la provincia.", how: "Seleccionar botón Salud Mental en Asistencia Virtual.", url: "https://salud.jujuy.gob.ar/2026/06/16/pedir-ayuda-tambien-es-salud-mental-el-abordaje-que-impulsa-jujuy-para-acompanar-antes-que-el-malestar-avance/" },
    { id: "jujuy-hospitales", title: "Jujuy - Hospitales con atención de salud mental", what: "Guardia las 24 horas: Gallardo (Palpalá), Pablo Soria, Materno Infantil y San Roque (San Salvador de Jujuy), Paterson (San Pedro) y La Mendieta. Consulta de 8 a 24: Centro de Especialistas Norte y Snopek (Alto Comedero). Fines de semana y feriados de 8 a 20: Zabala (Perico), Oscar Orías (Libertador), Uro (La Quiaca) y Salvador Mazza (Tilcara, desde el viernes). Guardia pasiva de psiquiatría: Sequeiros y Arroyabe", phone: "0800-888-4767", how: "Demanda espontánea según el directorio; consultá la entrada por la línea provincial.", note: "Es el directorio de 2025; la nota de 2026 confirma la red, no cada franja. El Materno Infantil: confirmá la edad.", url: "https://salud.jujuy.gob.ar/2025/08/26/las-consultas-por-salud-mental-pueden-realizarse-de-manera-gratuita-las-24-horas/" },
    ],
  },
  {
    name: "La Rioja",
    intro: "Consultá la admisión en cada sede: las páginas no publican cupos.",
    items: [
    { id: "larioja-infantil", title: "La Rioja - Centro de Día Comunitario Infantil", what: "Dispositivo ambulatorio para promoción, prevención, tratamiento y asistencia.", address: "El Chacho s/n, barrio Hospital", phone: "0380-154250599", hours: "Lunes a viernes 8:00-12:00 y 14:00-16:00", who: "Niñas/os y adolescentes de 3 a 14 años y 11 meses.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    { id: "larioja-san-agustin", title: "La Rioja - Centro San Agustín", what: "Evaluación y diagnóstico; no psicoterapia de acceso general.", address: "Guiraud’s 91, esquina José Hernández", phone: "0380-154447689", hours: "Lunes a viernes 8:00-13:00", who: "Solicitudes del Poder Judicial / restricciones a capacidad jurídica.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    { id: "larioja-hospital-dia", title: "La Rioja - Hospital de Día en Adicciones", what: "Orientación, evaluación y tratamiento ambulatorio.", address: "Dalmacio Vélez y Adolfo E. Dávila 416", phone: "0380-154250602 / 0380-4439439", hours: "Lunes a viernes 8:00-12:00 y 14:00-18:00", who: "Mayores de 14 años con consumos problemáticos.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    { id: "larioja-solar", title: "La Rioja - DTC Solar La Rioja", what: "Atención individual, grupal y acompañamiento comunitario.", address: "Guiraldes 91, esquina José Hernández", phone: "0380-4301351", hours: "Lunes a viernes 14:30-18:30", who: "Personas con consumos problemáticos.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    { id: "larioja-das", title: "La Rioja - Dispositivo Asistencial en Socioadicciones", what: "Atención y asistencia por socioadicciones.", address: "Santa Fe 1199, esquina Coronel Lagos", phone: "3804-154250601", hours: "Lunes a viernes 8:00-13:00 y 14:00-19:00", who: "Personas con juego patológico, uso problemático de tecnología y otras socioadicciones.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    { id: "larioja-munay", title: "La Rioja - Centro Terapéutico Munay", what: "Prevención, orientación y tratamiento ambulatorio.", address: "Calle Principal s/n, San Lorenzo", phone: "03825-660191", hours: "Lunes a viernes 8:00-13:00 y 14:00-19:00", who: "Personas con consumos problemáticos.", url: "https://larioja.gob.ar/salud/saludmentalyadicciones/" },
    ],
  },
  {
    name: "Neuquén",
    items: [
    { id: "neuquen-escucha-joven", title: "Neuquén - Escucha Joven", what: "Espacio grupal de contención e intercambio coordinado por profesionales de salud.", address: "Picún Leufú 301", hours: "Martes 16:00-17:30", who: "Jóvenes de 18 a 35 años.", how: "Sin inscripción previa según publicación.", url: "https://www.neuqueninforma.com.ar/noticias/2026/02/23/255285-invitan-a-participar-de-un-nuevo-espacio-de-escucha-joven" },
    ],
  },
  {
    name: "Tucumán",
    items: [
    { id: "tucuman-hospital-nino-jesus", title: "Hospital del Niño Jesús", what: "Hospital pediátrico de 3º nivel, el único exclusivo de pediatría de la provincia. Entre sus servicios figuran Salud Mental y Psicología, y tiene guardia de emergencia las 24 horas.", address: "Sabín 750, San Miguel de Tucumán", who: "Niñas, niños y adolescentes menores de 14 años.", how: "La página no explica cómo se pide un turno propio.", note: "La página no informa el costo y no publica teléfono ni horarios de consultorio.", url: "https://msptucuman.gov.ar/hospitales/hospital-del-nino-jesus/" },
    { id: "unt-adolescentes", title: "Universidad Nacional de Tucumán - Servicio de Atención a Adolescentes", what: "Atención psicológica gratuita por duplas supervisadas por docentes y profesionales.", phone: "Cuenta oficial @adolescencia.psico.unt y canales de la Facultad", who: "Adolescentes entre 12 y 18 años.", how: "Solicitar turno por los canales que la Facultad vincula; no se inventó WhatsApp.", url: "https://www.psicologia.unt.edu.ar/un-servicio-gratuito-de-la-facultad-de-psicologia-acompana-a-adolescentes-en-el-cuidado-de-su-salud-mental/" },
    ],
  },
  {
    name: "Corrientes",
    items: [
    { id: "corrientes-psico-genero", title: "Municipalidad de Corrientes - Atención psicológica por género y diversidad", what: "Atención psicológica individual por violencia de género / diversidad.", address: "Catamarca 771 (inicio del trámite)", phone: "dggeneroydiversidad@ciudaddecorrientes.gov.ar; 0379-155015619", hours: "Trámite presencial: lunes a viernes 8:00-12:00; horario de sesiones no publicado", who: "Ciudadanas y ciudadanos de Corrientes que hayan sufrido violencia de género y diversidad.", how: "Solicitar por correo o iniciar presencialmente; luego coordinan por teléfono.", url: "https://ciudaddecorrientes.gov.ar/tramites/politicas-sociales/atenci-n-psicol-gica-individual-por-tema-de-g-nero-y-diversidad" },
    ],
  },
  {
    name: "Santa Fe (Rosario)",
    items: [
    { id: "rosario-carrasco-yoga", title: "Rosario - Laboratorio Cultural Carrasco: Yoga", what: "Práctica grupal de cuerpo, respiración y atención.", address: "Hospital Carrasco; ingreso Bv. Avellaneda y 9 de Julio", phone: "341-3-924666 interno 228", hours: "Miércoles 8:30 y 10:00", who: "Mayores de 16 años.", how: "Formulario de preinscripción en la página; esperar confirmación del equipo.", url: "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco" },
    { id: "rosario-carrasco-palabras", title: "Rosario - Laboratorio Cultural Carrasco: Fogones de Palabras", what: "Encuentro de relatos y conversación para participación comunitaria.", address: "Hospital Carrasco; ingreso Bv. Avellaneda y 9 de Julio", phone: "341-3-924666 interno 228", hours: "Tercer miércoles del mes 10:00", who: "Mayores de 16 años.", how: "Formulario de preinscripción en la página; esperar confirmación del equipo.", url: "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco" },
    { id: "rosario-carrasco-movimiento", title: "Rosario - Laboratorio Cultural Carrasco: Movete Carrasco", what: "Actividad corporal y encuentro grupal.", address: "Hospital Carrasco; ingreso Bv. Avellaneda y 9 de Julio", phone: "341-3-924666 interno 228", hours: "Grupo 1 jueves 9:00; grupo 2 viernes 14:30", who: "Mayores de 16 años.", how: "Formulario de preinscripción en la página; esperar confirmación del equipo.", url: "https://www.rosario.gob.ar/inicio/laboratorio-cultural-carrasco" },
    ],
  },
  {
    name: "Mendoza",
    items: [
    { id: "mendoza-parque-yoga", title: "Ciudad de Mendoza - Yoga para personas mayores", what: "Actividad del Programa Adultos Mayores en Parque Urbano.", address: "Ituzaingó y Córdoba", hours: "Martes y viernes 10:00", who: "Personas mayores; la nota no dice desde qué edad.", how: "Inscripción previa presencial en oficina del parque o enlace oficial. Oficina lunes a viernes 10:30-19:30; no es horario de clase.", url: "https://prensa.ciudaddemendoza.gob.ar/2026/04/14/el-parque-urbano-presenta-su-propuesta-de-actividades-deportivas-2026/" },
    { id: "mendoza-parque-taichi", title: "Ciudad de Mendoza - Tai chi para personas mayores", what: "Actividad del Programa Adultos Mayores en Parque Urbano.", address: "Ituzaingó y Córdoba", hours: "Lunes 11:30", who: "Personas mayores; la nota no dice desde qué edad.", how: "Inscripción previa presencial en oficina del parque o enlace oficial. Oficina lunes a viernes 10:30-19:30; no es horario de clase.", url: "https://prensa.ciudaddemendoza.gob.ar/2026/04/14/el-parque-urbano-presenta-su-propuesta-de-actividades-deportivas-2026/" },
    ],
  },
]
