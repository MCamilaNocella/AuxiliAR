import { Link } from "react-router"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CABA, PASTEUR, ROSARIO, SALTA, UNIVERSITY_HOSPITALS } from "../../Animals.places"
import { PlaceCard } from "../../PlaceCard"

/**
 * Salud animal · Atención veterinaria gratuita (consulta clínica y urgencias). Told inside AuxiliAR from each official page (Animals.places.ts),
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
          Cómo buscar atención veterinaria gratuita
        </h3>
        <ol className="m-0 mt-2 flex list-decimal flex-col gap-2 pl-5">
          <li>Consultá en tu municipalidad por el área de bienestar animal o por el centro de zoonosis de tu zona. Para perros y gatos, Senasa indica que se manejan a nivel municipal o provincial.</li>
          <li>Preguntá qué servicios son gratuitos, quién puede usarlos (por ejemplo, si piden domicilio en el municipio) y cómo se pide el turno.</li>
          <li>Pedí que te indiquen la página oficial donde figura, y leela antes de ir.</li>
        </ol>
        <p className="m-0 mt-3">
          <Link to={`${PATHS.topic("animales")}?${SECTION_PARAM}=section-1`} className="inline-flex min-h-11 items-center font-bold">
            Castración y vacunación gratuitas
          </Link>
        </p>
      </section>

      <section aria-labelledby="an-caba3">
        <h3 id="an-caba3" className="m-0 text-xl font-extrabold">
          Ciudad de Buenos Aires
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={PASTEUR} kinds={kinds} title="Instituto de Zoonosis Luis Pasteur: consultorio y urgencias" showAction={false} />
        </div>
        <p className="m-0 mt-2 text-ink-soft">La página de {CABA.by} habla de castración y vacunación antirrábica: no informa consulta clínica, guardia ni urgencias.</p>
      </section>

      <section aria-labelledby="an-others3">
        <h3 id="an-others3" className="m-0 text-xl font-extrabold">
          Otras provincias
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          <PlaceCard place={ROSARIO} kinds={kinds} title="Rosario (Santa Fe): hospital y puestos" showAction={false} />
          <PlaceCard place={SALTA} kinds={kinds} title="Ciudad de Salta: hospital, Centro de Adopciones y urgencias" showAction={false} />
        </div>
      </section>

      <section aria-labelledby="an-uni" className="rounded-2xl border-2 border-control-line bg-field p-4">
        <h3 id="an-uni" className="m-0 text-xl font-extrabold">
          Ser de una universidad pública no hace gratuito un servicio
        </h3>
        <p className="m-0 mt-1">
          Los hospitales escuela de veterinaria de la UBA y de la UNLP publican en sus páginas que sus servicios son arancelados. No los incluimos como atención gratuita: están acá para que sepas cómo son.
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {UNIVERSITY_HOSPITALS.map((place) => (
            <PlaceCard key={place.id} place={place} kinds={kinds} title={place.by} showAction={false} />
          ))}
        </div>
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

      <p className="m-0 text-sm text-ink-soft">Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular.</p>
    </div>
  )
}
