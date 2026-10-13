import { Link } from "react-router"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CAMPAIGN_NOT_CARE } from "../../Animals.sources"
import { CABA, CORDOBA, FREE_STATUSES, NEUQUEN, PASTEUR, PROTENENCIA, ROSARIO, SALTA, UNCONFIRMED_STATUSES } from "../../Animals.places"
import { CabaAgenda } from "../../CabaAgenda"
import { PlaceCard } from "../../PlaceCard"

/**
 * Atención veterinaria · Vacunación y castración. Told inside AuxiliAR, place by place and prestación by prestación (Animals.places.ts):
 * for each one, who can use it, the cost and its conditions, where, when, how to ask for it and how to reach it, as the official page says it.
 * The castración and the vacunación antirrábica are told apart from the consulta and the urgencias (the next-but-one section), and the
 * gratuity is the page's statement for that prestación, never for a whole institution. What changes every week (the cronograma of the
 * Ciudad) is shown from today on, with its date and the official page. A free campaign is not free veterinary care, and no page here
 * promises a guardia. Services of other provinces stay: each is only for its place. It is not a second map.
 */
export default function Section1Content() {
  const kinds: ("castracion" | "vacunacion")[] = ["castracion", "vacunacion"]
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Acá encontrás dónde castrar y vacunar contra la rabia a perros y gatos, para quién es, cuánto cuesta y cómo pedirlo, según la página oficial de cada lugar. AuxiliAR no otorga turnos ni atiende animales.
      </p>

      <section aria-labelledby="an-kinds" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-kinds" className="m-0 text-xl font-extrabold">
          Una campaña gratuita no es atención veterinaria gratuita
        </h3>
        <p className="m-0 mt-1">{CAMPAIGN_NOT_CARE}</p>
      </section>

      <section aria-labelledby="an-free">
        <h3 id="an-free" className="m-0 text-xl font-extrabold">
          Gratuitos, según la página oficial
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Cada prestación dice en qué casos aplica. Cada servicio vale solo para su lugar.</p>
        <h4 className="m-0 mt-3 text-lg font-extrabold">Ciudad de Buenos Aires</h4>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={CABA} kinds={kinds} statuses={FREE_STATUSES} title="Castración y vacunación con Animales BA">
            <CabaAgenda />
          </PlaceCard>
          <PlaceCard place={PASTEUR} kinds={["vacunacion"]} statuses={FREE_STATUSES} title="Vacunación antirrábica en el Instituto Pasteur" />
        </div>
        <h4 className="m-0 mt-4 text-lg font-extrabold">Otras provincias</h4>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={ROSARIO} kinds={kinds} statuses={FREE_STATUSES} title="Rosario (Santa Fe)" />
          <PlaceCard place={CORDOBA} kinds={kinds} statuses={FREE_STATUSES} title="Ciudad de Córdoba" />
          <PlaceCard place={SALTA} kinds={kinds} statuses={FREE_STATUSES} title="Ciudad de Salta: Móvil Quirúrgico" />
          <PlaceCard place={NEUQUEN} kinds={kinds} statuses={FREE_STATUSES} title="Ciudad de Neuquén" />
          <PlaceCard place={PROTENENCIA} kinds={kinds} statuses={FREE_STATUSES} title="Operativos de todo el país (Protenencia)" />
        </div>
      </section>

      <section aria-labelledby="an-unconfirmed">
        <h3 id="an-unconfirmed" className="m-0 text-xl font-extrabold">
          Costo no confirmado
        </h3>
        <p className="m-0 mt-1 text-ink-soft">La página no dice si estos servicios tienen costo: confirmalo con el servicio antes de ir.</p>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={SALTA} kinds={kinds} statuses={UNCONFIRMED_STATUSES} title="Ciudad de Salta: hospital y CIC" showAction={false} />
        </div>
      </section>

      <section aria-labelledby="an-paid">
        <h3 id="an-paid" className="m-0 text-xl font-extrabold">
          Arancelados
        </h3>
        <p className="m-0 mt-1">Ninguna castración ni vacunación de esta página figura como arancelada. Los hospitales escuela de la UBA y de la UNLP, que sí lo son, están en «Recursos importantes» como alternativas pagas.</p>
      </section>

      <section aria-labelledby="an-other">
        <h3 id="an-other" className="m-0 text-xl font-extrabold">
          Si tu ciudad no aparece
        </h3>
        <p className="m-0 mt-1">Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial: consultá en tu municipalidad o en el centro de zoonosis de tu zona. Preguntá qué incluye, quién puede usarlo y cómo se pide.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder puede variar según el lugar. Algunos servicios requieren turno, registro o domicilio en el municipio.</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-3`} className="inline-flex min-h-11 items-center font-bold">
            Consulta y urgencias: cómo buscar atención veterinaria
          </Link>
        </p>
      </section>

      <p className="m-0 text-sm text-ink-soft">Los datos salen de la página oficial de cada organismo.</p>
    </div>
  )
}
