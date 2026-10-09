import { Link } from "react-router"
import { SourceList } from "@/components/health/SourceList"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CABA, CAMPAIGN_NOT_CARE, CHECKED_AT, CONFIRMED_BY_SOURCE, NOT_CONFIRMED, ZOONOSIS } from "../../Animals.sources"
import { ServiceList } from "../../ServiceList"

/**
 * Salud animal · Vacunación y castración gratuitas. It lists only what each municipality's own page says about a free
 * campaign or service (SA01, SA03, SA04, SA05), said as "la página informa", never as verified in person by AuxiliAR; the
 * ones whose cost or validity the page leaves open are listed apart (SA02, SA06, SA14). A free campaign is not free veterinary
 * care in general, and none of the pages announces a guardia or urgencias: the page says so and promises no appointment,
 * quota or availability. No phone, address or schedule is copied: each entry goes to the official page. It is not a second
 * map: the shared map has no veterinary services yet.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Acá encontrás campañas y servicios municipales de vacunación antirrábica y castración para perros y gatos, y cómo cuidarlos. AuxiliAR no otorga turnos ni atiende animales.
      </p>

      <section aria-labelledby="an-kinds" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-kinds" className="m-0 text-xl font-extrabold">
          Una campaña gratuita no es atención veterinaria gratuita
        </h3>
        <p className="m-0 mt-1">
          {CAMPAIGN_NOT_CARE}
        </p>
      </section>

      <section aria-labelledby="an-free">
        <h3 id="an-free" className="m-0 text-xl font-extrabold">
          Servicios que la página oficial informa como gratuitos
        </h3>
        <p className="m-0 mt-1 text-ink-soft">
          Son datos de la página de cada municipio, y valen solo para ese lugar. AuxiliAR no los verificó en persona. Las páginas no muestran fecha de actualización: confirmá en la página, antes de ir, que el servicio siga
          funcionando.
        </p>
        <div className="mt-4">
          <ServiceList items={CONFIRMED_BY_SOURCE} />
        </div>
      </section>

      <section aria-labelledby="an-pending">
        <h3 id="an-pending" className="m-0 text-xl font-extrabold">
          Todavía sin confirmar
        </h3>
        <p className="m-0 mt-1 text-ink-soft">En estos casos la página no deja claro el costo, o no sabemos si el servicio sigue vigente. No los tomes como gratuitos hasta confirmarlo.</p>
        <div className="mt-4">
          <ServiceList items={NOT_CONFIRMED} />
        </div>
      </section>

      <section aria-labelledby="an-other">
        <h3 id="an-other" className="m-0 text-xl font-extrabold">
          Si tu ciudad no aparece
        </h3>
        <p className="m-0 mt-1">Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial: consultá en tu municipalidad o en el centro de zoonosis de tu zona. Preguntá si el servicio es gratuito, quién puede usarlo y cómo se pide.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder puede variar según el lugar. Algunos servicios requieren turno, registro o domicilio en el municipio.</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-3`} className="inline-flex min-h-11 items-center font-bold">
            Cómo buscar atención veterinaria gratuita
          </Link>
        </p>
      </section>

      <SourceList
        sources={[
          { label: `${CABA.by}`, url: CABA.url },
          ...[...CONFIRMED_BY_SOURCE.slice(1), ...NOT_CONFIRMED].map(({ by, url }) => ({ label: by, url })),
          ZOONOSIS,
        ]}
        checkedAt={CHECKED_AT}
        note="Cada página es de un organismo oficial: AuxiliAR no responde por cambios posteriores."
      />
    </div>
  )
}
