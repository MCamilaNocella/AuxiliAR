import { CalendarClock, Footprints, HandHeart, Heart, MapPin, Users } from "lucide-react"
import { ActivityCards, type ActivityCard } from "@/components/sectionBlocks/ActivityCards"
import { BlockButton } from "@/components/sectionBlocks/BlockButton"
import { Fold } from "@/components/sectionBlocks/Fold"
import { NumberedCards } from "@/components/sectionBlocks/NumberedCards"
import { PriorityBanner } from "@/components/sectionBlocks/PriorityBanner"
import { RotatingPhrases } from "@/components/sectionBlocks/RotatingPhrases"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SideCallout } from "@/components/sectionBlocks/SideCallout"
import { StationsList } from "@/components/sectionBlocks/StationsList"
import { SubLabel } from "@/components/sectionBlocks/SubLabel"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { blockIcon } from "@/utils/blockIcons"
import { MH_ACTIVITIES, MH_SOURCES, MH_WELLBEING } from "../../MentalHealth.model"

const PHRASES = ["Así como cuidás tu cuerpo, tu mente también merece cuidado.", "Tu bienestar también empieza por cómo te sentís."]

/** A class or space: when, where and who, and what the page says of its cost */
const activity = (place?: string) => ({ title, hours, address, who, note }: (typeof MH_ACTIVITIES.yoga)[number]): ActivityCard => ({
  title: place ?? title,
  rows: [
    { icon: CalendarClock, text: hours ?? "" },
    ...(address ? [{ icon: MapPin, text: address }] : []),
    ...(who ? [{ icon: Users, text: who.replace(/\.$/, "") }] : []),
  ],
  note,
})

/** Salud mental · Hábitos antiestrés, as the chosen model: a breath in your day, habits, moving with others, routines and when to ask for help */
export default function Section5Content() {
  return (
    <SectionBody sources={MH_SOURCES.bienestar}>
      <PriorityBanner icon={Heart} title="Un respiro en tu día" text={<RotatingPhrases phrases={PHRASES} />} />
      <ToneBlock tone={1} title="Hábitos para reducir el estrés">
        <NumberedCards balanced items={MH_WELLBEING.ideas.map(({ icon, title, text }) => ({ icon: blockIcon(icon), title, text }))} />
      </ToneBlock>
      <ToneBlock icon={Footprints} tone={2} title="Moverte con otros, cerca tuyo" lead={["Moverte y compartir con otras personas ayuda a bajar el estrés. Hay clases y espacios en parques y plazas."]}>
        <Fold label="Ver clases de yoga y Estaciones Saludables">
          <div className="grid gap-2">
            <SubLabel>Yoga en parques de la Ciudad (Plazas Activas)</SubLabel>
            <ActivityCards items={MH_ACTIVITIES.yoga.map((item) => activity(item.title.replace(/^Yoga en /, ""))(item))} />
            <SubLabel className="mt-2">Estaciones Saludables de la Ciudad</SubLabel>
            <p className="m-0 [overflow-wrap:anywhere] text-ink-soft">{MH_ACTIVITIES.estacionesNote}</p>
            <StationsList items={MH_ACTIVITIES.estaciones.map(({ name, address, zone }) => ({ name, address: zone ? `${address} · ${zone}` : address }))} />
            <SubLabel className="mt-2">En otras provincias</SubLabel>
            <ActivityCards items={MH_ACTIVITIES.provinces.map((item) => activity()(item))} />
          </div>
        </Fold>
      </ToneBlock>
      <ToneBlock icon={CalendarClock} tone={1} title="Rutinas que cuidan tu bienestar">
        <ul role="list" className="m-0 list-none p-0">
          {MH_WELLBEING.habits.map(({ icon, title, text }) => {
            const Icon = blockIcon(icon)
            return (
              <li key={title} className="flex items-start gap-3 border-b border-line-strong py-[0.85rem]">
                {Icon && <Icon aria-hidden="true" className="mt-[0.15rem] size-[1.25em] shrink-0" />}
                <span>
                  <b className="font-black">{`${title}.`}</b> {text}
                </span>
              </li>
            )
          })}
        </ul>
      </ToneBlock>
      <SideCallout tone="brand" title="Cuándo pedir ayuda" icon={HandHeart}>
        <p className="m-0">{MH_WELLBEING.help}</p>
        <div className="mt-2">
          <BlockButton button={{ go: "section-1", label: "Dónde buscar ayuda" }} />
        </div>
      </SideCallout>
    </SectionBody>
  )
}
