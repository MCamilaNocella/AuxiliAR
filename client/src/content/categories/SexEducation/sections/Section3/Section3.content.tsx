import { Link } from "react-router"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { PointerList } from "../../PointerList"
import { SEXUAL_RIGHTS } from "../../SexEducation.rights"
import { ESI_CHACO, ESI_MATERIALES, ESI_PBA } from "../../SexEducation.sources"

/**
 * Salud sexual y ESI · Derechos y ESI. Each right is one the law itself states, with its law named. It describes no procedure,
 * no deadline and no clinical step (those are left to the official pages and to a health professional). What it says:
 *  - Ley 25.673, art. 2: "garantizar a toda la población el acceso a la información, orientación, métodos y prestaciones"
 *  - Ley 26.150, art. 1: "todos los educandos tienen derecho a recibir educación sexual integral en los establecimientos
 *    educativos públicos, de gestión estatal y privada"; ESI "articula aspectos biológicos, psicológicos, sociales, afectivos y éticos"
 *  - Ley 27.610, arts. 1, 2 and 12: it regulates the access to the interrupción voluntaria del embarazo y la atención postaborto;
 *    "las mujeres y personas con otras identidades de género con capacidad de gestar tienen derecho a decidir"; the public sector
 *    and the obras sociales "deben incorporar la cobertura integral y gratuita"
 *  - the ministry's page: "información clara, basada en evidencia científica, promoviendo la toma de decisiones informadas y autónomas"
 *  - the materials: the 4/10/2022 note of argentina.gob.ar (láminas, desplegables, cuadernillos for inicial, primario y secundario,
 *    audiovisuales); the pages of PBA and Chaco are pointers to their own materials
 */
export default function Section3Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Conocer tus derechos te ayuda a decidir con información. Esto dicen las leyes nacionales, en palabras simples.</p>

      <section aria-labelledby="ss-rights">
        <h3 id="ss-rights" className="m-0 text-xl font-extrabold">
          Tus derechos
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2.5 pl-5">
          {SEXUAL_RIGHTS.map(({ lead, text }) => (
            <li key={lead}>
              <b>{lead}</b> {text}
            </li>
          ))}
          <li>
            <b>Decidir sobre un embarazo.</b> La Ley 27.610 regula el acceso a la interrupción voluntaria del embarazo y a la atención posaborto. Reconoce el derecho a decidir de las mujeres y de otras personas con
            capacidad de gestar, y establece que el sector público de salud y las obras sociales deben cubrirla de forma integral y gratuita.
          </li>
        </ul>
        <p className="m-0 mt-3 text-ink-soft">
          El Ministerio de Salud de la Nación dice que brinda información clara, basada en evidencia científica, para tomar decisiones informadas y autónomas. Que un derecho exista no significa que haya un turno
          inmediato: la forma de acceder puede variar según el centro.
        </p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
            Dónde buscar atención
          </Link>
        </p>
      </section>

      <section aria-labelledby="ss-esi">
        <h3 id="ss-esi" className="m-0 text-xl font-extrabold">
          Educación Sexual Integral (ESI)
        </h3>
        <p className="m-0 mt-1">La ley define la ESI como la que articula aspectos biológicos, psicológicos, sociales, afectivos y éticos.</p>
        <p className="m-0 mt-2">
          El Ministerio de Educación publicó láminas, desplegables y cuadernillos para el nivel inicial, primario y secundario, y producciones audiovisuales, entre ellas algunas en Lengua de Señas Argentina.
        </p>
      </section>

      <section aria-labelledby="ss-material">
        <h3 id="ss-material" className="m-0 text-xl font-extrabold">
          Materiales de ESI para leer (complemento)
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Son materiales de lectura abierta, algunos pensados para docentes y familias. No son una consulta ni un servicio de atención. AuxiliAR no verificó cada descarga.</p>
        <div className="mt-2">
          <PointerList items={[{ label: "Nuevos materiales educativos de ESI", by: "Ministerio de Educación de la Nación (4/10/2022)", url: ESI_MATERIALES.url }, ESI_PBA, ESI_CHACO]} />
        </div>
      </section>

      <p className="m-0 text-sm text-ink-soft">Es información general: no es asesoramiento legal ni médico.</p>
    </div>
  )
}
