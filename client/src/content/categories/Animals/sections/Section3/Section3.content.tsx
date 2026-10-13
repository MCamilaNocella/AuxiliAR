import { Link } from "react-router"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CABA, FREE_STATUSES, NOT_OFFERED_STATUSES, PASTEUR, PAID_STATUSES, ROSARIO, SALTA, UNCONFIRMED_STATUSES, UNIVERSITY_HOSPITALS } from "../../Animals.places"
import { CremationBlock } from "../../CremationBlock"
import { PlaceCard } from "../../PlaceCard"

/**
 * Atención veterinaria · Recursos importantes (consulta clínica y urgencias, y la cremación gratuita del Instituto Pasteur). Told inside AuxiliAR from each official page (Animals.places.ts),
 * apart from the castración and the vacunación:
 *  - the consultorio of the Instituto Pasteur (zoonosis only, no guardia), the Hospital Municipal and the puestos of Rosario (free for those
 *    adscriptos, a bono for the rest) and the Hospital Municipal, the Centro de Adopciones and the "Guardia y urgencias" of Salta (no hours of its own)
 *  - the page of Animales BA does not tell any consulta or guardia: it is said, not filled in
 *  - the teaching hospitals of UBA and UNLP say on their own pages that their services are arancelados: they are shown as such, never as free
 * AuxiliAR confirms no free guardia or urgencias service and promises no appointment or quota. The shared map is not used: it has no
 * veterinary services yet.
 */
export default function Section3Content() {
  const kinds: ("consulta" | "urgencias")[] = ["consulta", "urgencias"]
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Acá está lo que las páginas oficiales dicen de la consulta veterinaria y de las urgencias. No confirmamos ninguna guardia ni atención de urgencia gratuita para animales.
      </p>

      <section aria-labelledby="an-how">
        <h3 id="an-how" className="m-0 text-xl font-extrabold">
          Cómo buscar atención veterinaria
        </h3>
        <ol className="m-0 mt-2 flex list-decimal flex-col gap-2 pl-5">
          <li>Consultá en tu municipalidad por el área de bienestar animal o por el centro de zoonosis de tu zona. Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial.</li>
          <li>Preguntá qué servicios hay, quién puede usarlos (por ejemplo, si piden domicilio en el municipio) y cómo se pide el turno.</li>
          <li>Pedí que te indiquen la página oficial donde figura, y leela antes de ir.</li>
        </ol>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
            Vacunación y castración
          </Link>
        </p>
      </section>

      <section aria-labelledby="an-free3">
        <h3 id="an-free3" className="m-0 text-xl font-extrabold">
          Gratuitos, según la página oficial
        </h3>
        <p className="m-0 mt-1 text-ink-soft">Cada prestación dice si tiene una condición (por ejemplo, estar adscripto al sistema de salud municipal).</p>
        <h4 className="m-0 mt-3 text-lg font-extrabold">Ciudad de Buenos Aires</h4>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={PASTEUR} kinds={kinds} statuses={FREE_STATUSES} title="Instituto de Zoonosis Luis Pasteur: consultorio" showAction={false} />
        </div>
        <p className="m-0 mt-2 text-ink-soft">La página de {CABA.by} habla de castración y vacunación antirrábica: no informa consulta clínica, guardia ni urgencias.</p>
        <h4 className="m-0 mt-4 text-lg font-extrabold">Otras provincias</h4>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={ROSARIO} kinds={kinds} statuses={FREE_STATUSES} title="Rosario (Santa Fe): hospital y puestos" showAction={false} />
          <PlaceCard place={SALTA} kinds={kinds} statuses={FREE_STATUSES} title="Ciudad de Salta: hospital y Centro de Adopciones" showAction={false} />
        </div>
      </section>

      <section aria-labelledby="an-unconfirmed3">
        <h3 id="an-unconfirmed3" className="m-0 text-xl font-extrabold">
          Costo no confirmado
        </h3>
        <p className="m-0 mt-1 text-ink-soft">La página no dice si tienen costo: confirmalo antes de ir.</p>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={SALTA} kinds={kinds} statuses={UNCONFIRMED_STATUSES} title="Ciudad de Salta: CIC y «Guardia y urgencias»" showAction={false} />
        </div>
      </section>

      <section aria-labelledby="an-notoffered">
        <h3 id="an-notoffered" className="m-0 text-xl font-extrabold">
          Servicios que la página dice que no existen
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={PASTEUR} kinds={kinds} statuses={NOT_OFFERED_STATUSES} title="Instituto Pasteur: guardia y urgencias" showAction={false} />
        </div>
      </section>

      <section aria-labelledby="an-uni" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-uni" className="m-0 text-xl font-extrabold">
          Arancelados: alternativas identificadas
        </h3>
        <p className="m-0 mt-1">
          Los hospitales escuela de veterinaria de la UBA y de la UNLP publican en sus páginas que sus servicios son arancelados. Ser de una universidad pública no cambia eso. Están acá para que sepas que existen y cómo son.
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {UNIVERSITY_HOSPITALS.map((place) => (
            <PlaceCard key={place.id} place={place} kinds={kinds} statuses={PAID_STATUSES} title={place.by} showAction={false} />
          ))}
        </div>
      </section>

      <CremationBlock />

      <section aria-labelledby="an-tetanus" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-tetanus" className="m-0 text-xl font-extrabold">
          Vacuna antitetánica
        </h3>
        <p className="m-0 mt-1">Si un animal te mordió o te arañó, el Ministerio de Salud de la Nación indica:</p>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Lavar la herida con abundante agua y jabón.</li>
          <li>No colocar alcohol ni otro desinfectante.</li>
          <li>Concurrir rápidamente al centro de salud más cercano, para que un profesional de la salud evalúe si hace falta una profilaxis antibiótica, antitetánica y/o antirrábica, de acuerdo a las características del accidente.</li>
        </ul>
        <p className="m-0 mt-2">Llevá tu carnet de vacunas: es lo que permite saber si te falta alguna dosis. Qué corresponde en cada caso lo define el profesional que te atienda.</p>
        <p className="m-0 mt-2 text-ink-soft">La vacuna doble bacteriana protege contra el tétanos y la difteria: esquema de 3 dosis y refuerzo cada 10 años, según el Calendario Nacional.</p>
        <p className="m-0 mt-3">
          <Link to={PATHS.firstAidGuide("vacuna-antitetanica")} className="inline-flex min-h-11 items-center font-bold">
            Ver la guía de la vacuna antitetánica
          </Link>
        </p>
      </section>

      <section aria-labelledby="an-limits">
        <h3 id="an-limits" className="m-0 text-xl font-extrabold">
          Lo que todavía no podemos decirte
        </h3>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
          <li>No prometemos guardias, turnos ni cupos: dependen de cada servicio.</li>
          <li>El mapa de AuxiliAR todavía no incluye servicios veterinarios.</li>
          <li>No listamos clínicas veterinarias pagas.</li>
        </ul>
      </section>

      <p className="m-0 text-sm text-ink-soft">Los datos salen de la página oficial de cada organismo. Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular.</p>
    </div>
  )
}
