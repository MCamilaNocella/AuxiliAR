import { Disclosure } from "@/components/health/Disclosure"
import type { CounselingCenter, TestCenter } from "./SexEducation.lists"

const noteClass = "m-0 text-sm text-ink-soft"

/** The official list of testing centers of the Ciudad, inside AuxiliAR (closed until opened; all its text is in the page) */
export const TestCenterList = ({ centers }: { centers: TestCenter[] }) => (
  <Disclosure title={`Centros de testeo de VIH y sífilis de la Ciudad (${centers.length})`} compact>
    <p className={noteClass}>
      Lista oficial de la Ciudad consultada el 10 de octubre de 2026, tal como la publica. AuxiliAR no verificó estos centros: llamá antes de ir para confirmar días, horarios y si hace falta turno. Una misma dirección puede figurar distinta en otra lista oficial.
    </p>
    <ul role="list" className="m-0 flex list-none flex-col gap-2 p-0">
      {centers.map(({ name, address, phone, syphilis }) => (
        <li key={`${name}-${address}`} className="break-words rounded-xl border border-line-strong bg-card p-3">
          <p className="m-0 font-extrabold">{name}</p>
          <p className="m-0">{address}</p>
          <p className="m-0">{`Teléfono: ${phone}`}</p>
          <p className={noteClass}>{syphilis ? "Test rápido de VIH y de sífilis" : "Test rápido de VIH (la página no marca el de sífilis)"}</p>
        </li>
      ))}
    </ul>
  </Disclosure>
)

/** The official list of consejerías of the Ciudad (methods and interruption of pregnancy) */
export const CounselingCenterList = ({ centers }: { centers: CounselingCenter[] }) => (
  <Disclosure title={`Consejerías en salud sexual de la Ciudad (${centers.length})`} compact>
    <p className={noteClass}>
      Lista oficial de la Ciudad consultada el 10 de octubre de 2026, tal como la publica. Es una lista de consejerías en salud sexual: no confirma que cada sede realice procedimientos de IVE/ILE ni qué prestaciones tiene disponibles hoy. El contacto es el que la lista llama «contacto por IVE/ILE», no es necesariamente el teléfono general del centro, y algunos datos se repiten entre centros. AuxiliAR no verificó estos centros: confirmá antes de ir o escribir.
    </p>
    <ul role="list" className="m-0 flex list-none flex-col gap-2 p-0">
      {centers.map(({ name, address, tubalLigation, vasectomy, contact }) => (
        <li key={`${name}-${address}`} className="break-words rounded-xl border border-line-strong bg-card p-3">
          <p className="m-0 font-extrabold">{name}</p>
          <p className="m-0">{address}</p>
          <p className="m-0">{`Contacto por IVE/ILE: ${contact}`}</p>
          {(tubalLigation || vasectomy) && (
            <p className={noteClass}>{`Anticoncepción quirúrgica según la lista: ${[tubalLigation && "ligadura tubaria", vasectomy && "vasectomía"].filter(Boolean).join(" y ")}`}</p>
          )}
        </li>
      ))}
    </ul>
  </Disclosure>
)
