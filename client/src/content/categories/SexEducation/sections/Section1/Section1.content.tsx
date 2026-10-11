import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { CoverageCard } from "../../CoverageCard"
import { NationalLine } from "../../NationalLine"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { HUESPED, HUESPED_SEARCH, PROVINCES } from "../../SexEducation.coverage"

/**
 * Salud sexual y ESI · Dónde buscar atención. Information and orientation: it offers no appointments, shows no phone number
 * (the help numbers are the work of the Emergencias team and are always one tap away in the emergency bar) and
 * recommends no service as free care, because no service of the map has its gratuity verified for sexual health yet.
 * What it says and where it comes from:
 *  - methods and consejería "en centros de salud y hospitales": Preguntas frecuentes of the Ministerio de Salud (SS04)
 *  - the national line has confidential consultations and its own hours, which are read on its page (SS01): no number is copied
 *  - the map button only explores: the map marks gratuity only when it is verified for that very service
 * What the official pages of other provinces and of a civil organization offer is said here, inside AuxiliAR (SexEducation.coverage.ts): for
 * whom, cost and conditions, how to get it and how to reach it, as each page says it (SS05, SS09, SS12, SS13 and the page of Tucumán). They are
 * not centers verified by AuxiliAR, and what a page does not say is marked "para confirmar". The only links that stay open an action that
 * cannot be done from here (a map of establishments, a search, a form). The national line is described, with a call button.
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
        <p className="m-0 mt-1">Consultá tus dudas sobre salud sexual en la línea nacional del Ministerio de Salud.</p>
        <div className="mt-3">
          <NationalLine />
        </div>
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

      <section aria-labelledby="ss-provinces">
        <h3 id="ss-provinces" className="m-0 text-xl font-extrabold">
          Si vivís en otra provincia
        </h3>
        <p className="m-0 mt-1 text-ink-soft">
          Esto dicen las páginas oficiales de algunas provincias sobre lo que ofrecen. Cada una vale solo para su provincia y AuxiliAR no verificó estos servicios: abrí la que te corresponda y confirmá los datos con quien lo ofrece.
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {PROVINCES.map((entry) => (
            <CoverageCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section aria-labelledby="ss-civil">
        <h3 id="ss-civil" className="m-0 text-xl font-extrabold">
          Servicios de una organización civil
        </h3>
        <p className="m-0 mt-1 text-ink-soft">No es un servicio del Estado. Lo que sigue es lo que la propia organización dice de sí misma.</p>
        <div className="mt-2 flex flex-col gap-2">
          <CoverageCard entry={HUESPED}>
            <p className="m-0 mt-3">{HUESPED_SEARCH}</p>
          </CoverageCard>
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
