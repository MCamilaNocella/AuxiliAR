import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { PointerList } from "../../PointerList"
import { HUESPED_DONDE, HUESPED_SERVICIOS, LINEA, PBA_SSR, SANTA_FE_IVE, TUCUMAN_ANTICONCEPCION } from "../../SexEducation.sources"

/**
 * Salud sexual y ESI · Dónde buscar atención. Information and orientation: it offers no appointments, shows no phone number
 * (the help numbers are the work of the Emergencias team and are always one tap away in the emergency bar) and
 * recommends no service as free care, because no service of the map has its gratuity verified for sexual health yet.
 * What it says and where it comes from:
 *  - methods and consejería "en centros de salud y hospitales": Preguntas frecuentes of the Ministerio de Salud (SS04)
 *  - the national line has confidential consultations and its own hours, which are read on its page (SS01): no number is copied
 *  - the map button only explores: the map marks gratuity only when it is verified for that very service
 * The pages of other provinces and of a civil organization are pointers, not centers verified by AuxiliAR (SS05, SS09, SS12, SS13).
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Acá encontrás información para cuidar tu salud sexual y reproductiva y para saber dónde buscar orientación y atención. AuxiliAR no otorga turnos ni realiza consultas médicas, y no te pide datos personales ni
        de salud.
      </p>

      <section aria-labelledby="ss-near">
        <h3 id="ss-near" className="m-0 text-xl font-extrabold">
          Una consulta en un centro de salud u hospital
        </h3>
        <p className="m-0 mt-1">Podés pedir información y asesoramiento sobre métodos anticonceptivos en centros de salud y hospitales.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "sexual-health" })} variant="primary">
            Ver el mapa
          </ActionLink>
        </div>
        <p className="m-0 mt-2 text-ink-soft">Consultá cada ficha para saber qué servicios gratuitos están confirmados. Todavía no cubrimos todo el país.</p>
      </section>

      <section aria-labelledby="ss-line">
        <h3 id="ss-line" className="m-0 text-xl font-extrabold">
          Orientación por teléfono
        </h3>
        <p className="m-0 mt-1">Consultá tus dudas sobre salud sexual en la línea nacional del Ministerio de Salud. Su página indica que las consultas son confidenciales. Revisá sus horarios antes de llamar.</p>
        <p className="m-0 mt-2">
          <OutLink href={LINEA.url}>Línea nacional de salud sexual: horarios y contacto</OutLink>
        </p>
      </section>

      <section aria-labelledby="ss-kinds" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="ss-kinds" className="m-0 text-xl font-extrabold">
          Información, orientación y atención no son lo mismo
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>
            <b>Información gratuita:</b> guías, leyes y materiales que podés leer sin pagar. No son una consulta.
          </li>
          <li>
            <b>Orientación:</b> una línea o un equipo que responde dudas. No reemplaza la atención médica.
          </li>
          <li>
            <b>Gratuidad confirmada:</b> una prestación de la que una fuente confiable confirma que no tiene costo. En AuxiliAR la marca el mapa en la ficha de cada prestación; si no la marca, no está
            confirmada.
          </li>
        </ul>
      </section>

      <section aria-labelledby="ss-more">
        <h3 id="ss-more" className="m-0 text-xl font-extrabold">
          Otras páginas para completar la información
        </h3>
        <div className="mt-2">
          <Disclosure title="Ver páginas complementarias (se abren fuera de AuxiliAR)">
            <p className="m-0 mt-1 text-ink-soft">
              Son páginas de organismos oficiales y de una organización civil. AuxiliAR no verificó cada lugar de sus listados ni su gratuidad: confirmá requisitos, costo y horarios con cada uno.
            </p>
            <h4 className="m-0 mt-3 text-lg font-extrabold">Buscadores y servicios de una organización civil</h4>
            <div className="mt-2">
              <PointerList items={[HUESPED_DONDE, HUESPED_SERVICIOS]} />
            </div>
            <h4 className="m-0 mt-4 text-lg font-extrabold">Información oficial de algunas provincias</h4>
            <p className="m-0 mt-1 text-ink-soft">Cada página vale solo para su provincia. No son servicios verificados por AuxiliAR.</p>
            <div className="mt-2">
              <PointerList items={[PBA_SSR, SANTA_FE_IVE, TUCUMAN_ANTICONCEPCION]} />
            </div>
          </Disclosure>
        </div>
      </section>

      <p className="m-0">
        <Link to={`${PATHS.topic("esi")}?${SECTION_PARAM}=section-2`} className="inline-flex min-h-11 items-center font-bold">
          Anticoncepción y prevención de ITS
        </Link>
      </p>

      <p className="m-0 text-sm text-ink-soft">Las páginas de «Más recursos» son de otras organizaciones: AuxiliAR no responde por su contenido.</p>
    </div>
  )
}
