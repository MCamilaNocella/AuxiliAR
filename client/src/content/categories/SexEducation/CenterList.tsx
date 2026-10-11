import { Disclosure } from "@/components/health/Disclosure"
import type { CounselingCenter, TestCenter } from "./SexEducation.lists"

const noteClass = "m-0 text-sm text-ink-soft"

/** The official list of testing centers of the Ciudad, inside AuxiliAR (closed until opened; all its text is in the page) */
export const TestCenterList = ({ centers }: { centers: TestCenter[] }) => (
  <Disclosure title={`Centros de testeo de VIH y sífilis de la Ciudad (${centers.length})`} compact>
    <p className={noteClass}>
      Lista del Gobierno de la Ciudad leída el 10 de octubre de 2026 con una herramienta de lectura automática, tal como la publica (la página no muestra fecha de actualización). La página dice que los centros atienden en distintos
      días y horarios y pide consultar por teléfono antes de ir; no dice si hace falta turno u orden. Una misma dirección puede figurar distinta en otra lista oficial. AuxiliAR no verificó estos centros.
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
      Lista del Gobierno de la Ciudad leída el 10 de octubre de 2026 con una herramienta de lectura automática, tal como la publica (la página no muestra fecha de actualización): en estos centros se puede acceder a los métodos anticonceptivos y a la interrupción del
      embarazo. La columna de contacto es la que la página llama «contacto por IVE/ILE»: no es necesariamente el teléfono general del centro. Hay datos que la lista repite entre centros distintos (por ejemplo, un mismo correo en varios CeSAC): confirmalos
      antes de escribir. AuxiliAR no verificó estos centros.
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
