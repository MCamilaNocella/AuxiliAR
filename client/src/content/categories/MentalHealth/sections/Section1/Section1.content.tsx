import { Info, MapPin, MessageCircle, Phone, Users } from "lucide-react"
import { ActivityCards } from "@/components/sectionBlocks/ActivityCards"
import { BlockMap } from "@/components/sectionBlocks/BlockMap"
import { CallCard } from "@/components/sectionBlocks/CallCard"
import { Fold } from "@/components/sectionBlocks/Fold"
import { NoteBox } from "@/components/sectionBlocks/NoteBox"
import { RowsList } from "@/components/sectionBlocks/RowsList"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SubLabel } from "@/components/sectionBlocks/SubLabel"
import { TOOL_BUTTON } from "@/components/sectionBlocks/ToolCard"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import type { RowData } from "@/types/blocks"
import { MH_CONSUMOS, MH_NUMBERS, MH_OTHER_LINES, MH_PLACES, MH_PROVINCES, MH_SOURCES } from "../../MentalHealth.model"

const FILTERS: [string, string][] = [
  ["all", "Todos"],
  ["guard24", "Guardia 24 h"],
  ["prog", "Atención programada"],
  ["kids", "Niñas, niños y adolescentes"],
]

const lineRow = ({ title, what, phone, hours, note, url }: (typeof MH_OTHER_LINES)[number]): RowData => ({ title, text: what, phone, meta: [["clock", hours ?? ""]], note, url })

/** Salud mental · Dónde buscar ayuda, as the chosen model: the lines to call now, the map of places and support for problematic use */
export default function Section1Content() {
  const { urgent, items } = MH_NUMBERS
  const meta = ({ hours, where, cost }: typeof urgent) => [hours, where, cost].filter((item): item is string => !!item)
  return (
    <SectionBody sources={MH_SOURCES.ayuda}>
      <ToneBlock icon={Phone} tone={1} title="Para hablar ahora">
        <div className="mt-3 grid gap-3">
          <CallCard variant="urgent" number={urgent.number} dial={urgent.dial} name={urgent.name} text={urgent.text} meta={meta(urgent)} />
        </div>
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-3">
          {items.map((line) => (
            <CallCard key={line.number} variant={line.main ? "main" : undefined} number={line.number} dial={line.dial} name={line.name} text={line.text} meta={meta(line)} />
          ))}
        </div>
        <Fold label="Líneas de otras provincias y un chat de escucha" count={`${MH_OTHER_LINES.length} líneas`}>
          <RowsList phoneFirst items={MH_OTHER_LINES.map(lineRow)} />
        </Fold>
      </ToneBlock>
      <ToneBlock icon={MapPin} tone={2} title="Guardias y lugares de atención" lead={["Guardias de salud mental las 24 horas y lugares con atención programada (turnos y admisión), como los centros de salud de la Ciudad."]}>
        <div className="mt-3">
          <BlockMap
            places={MH_PLACES}
            provinces={MH_PROVINCES}
            filters={FILTERS}
            empty={{ title: "Todavía no tenemos lugares verificados en {prov}.", text: "Eso no quiere decir que no haya: estamos sumando provincias de a poco. Mientras tanto:" }}
            emptyExtra={
              <>
                <ul className="m-0 grid list-disc gap-1 pl-[1.2rem]">
                  <li>Podés ir a la guardia de cualquier hospital general: la ley dice que tenés derecho a que te atiendan ahí.</li>
                  <li>La línea 0800-999-0091 atiende las 24 horas en todo el país y te puede orientar.</li>
                </ul>
                <div>
                  <a href="tel:08009990091" className={TOOL_BUTTON}>
                    <Phone aria-hidden="true" />
                    Llamar al 0800-999-0091
                  </a>
                </div>
              </>
            }
          />
        </div>
      </ToneBlock>
      <ToneBlock
        icon={MessageCircle}
        tone={4}
        title="Apoyo ante el consumo problemático"
        lead={["Alcohol, drogas o medicamentos: podés pedir orientación por teléfono o acercarte a la red de la Ciudad. También están el 141, en los números de arriba."]}
      >
        <RowsList phoneFirst items={[lineRow(MH_CONSUMOS.line)]} />
        <Fold label="Centros de la Red de adicciones (Ciudad)" count={`${MH_CONSUMOS.network.length} lugares`}>
          <RowsList
            items={MH_CONSUMOS.network.map(({ title, what, address, hours, phone, how }) => ({
              title,
              text: what,
              meta: [
                ["map-pin", address ?? ""],
                ["clock", hours ?? ""],
              ],
              phone,
              note: how,
            }))}
          />
        </Fold>
        <SubLabel className="mt-5">Grupos de apoyo mutuo</SubLabel>
        <ActivityCards
          items={MH_CONSUMOS.groups.map(({ title, who, how, url }) => ({
            title: title.replace(/ de Argentina| Argentina/, ""),
            rows: [
              { icon: Users, text: (who ?? "").replace(/\.$/, "") },
              { icon: Info, text: how ?? "" },
            ],
            link: { label: "Buscar un grupo", url },
          }))}
        />
        <NoteBox>{MH_CONSUMOS.groups[0].note}</NoteBox>
      </ToneBlock>
    </SectionBody>
  )
}
