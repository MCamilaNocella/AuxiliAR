import { FileText, Hospital, IdCard, MapPin } from "lucide-react"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { BlockPart } from "@/components/sectionBlocks/BlockPart"
import { BulletList } from "@/components/sectionBlocks/BulletList"
import { Callout } from "@/components/sectionBlocks/Callout"
import { CalloutButton } from "@/components/sectionBlocks/CalloutButton"
import { Fold } from "@/components/sectionBlocks/Fold"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { StepList } from "@/components/sectionBlocks/StepList"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { NeighborhoodAgenda } from "./NeighborhoodAgenda"
import { CESAC, CLINICAL_RECORD, CUD, NEIGHBORHOOD, PROCEDURES_KEY, PROCEDURES_SOURCES } from "./Section2.constants"

/** Más recursos · Trámites, as the model recursos-1: the CeSAC appointment, the clinical record, the CUD and the neighbourhood operations */
export default function Section2Content() {
  return (
    <SectionBody sources={PROCEDURES_SOURCES} look="accent">
      <SectionKey cells={PROCEDURES_KEY} />
      <ToneBlock id="cesac" title="Turno en un CeSAC" icon={Hospital} tone={2} lead={[CESAC.lead]}>
        <BlockPart title={CESAC.register.title} lead={[CESAC.register.lead]}>
          <BulletList items={CESAC.register.documents} />
          <BlockNote>{CESAC.register.note}</BlockNote>
        </BlockPart>
        <BlockPart title={CESAC.appointment.title} lead={[CESAC.appointment.lead]}>
          <BulletList items={CESAC.appointment.ways} />
        </BlockPart>
        <BlockPart title={CESAC.which.title}>
          <p className="m-0 pt-2">{CESAC.which.text}</p>
        </BlockPart>
        <BlockPart>
          <Callout>
            <CalloutButton href={CESAC.online.url}>{CESAC.online.label}</CalloutButton>
          </Callout>
        </BlockPart>
      </ToneBlock>
      <ToneBlock id="historia" title="Pedir tu historia clínica" icon={FileText} tone={4}>
        <BulletList items={CLINICAL_RECORD} />
      </ToneBlock>
      <ToneBlock id="cud" title="Tramitar el CUD" icon={IdCard} tone={5} lead={[CUD.lead]}>
        <StepList steps={CUD.steps} />
        <BlockNote>{CUD.note}</BlockNote>
      </ToneBlock>
      <ToneBlock id="barrio" title="Más servicios en tu barrio" icon={MapPin} tone={1} lead={[NEIGHBORHOOD.lead]}>
        <BlockPart>
          <Fold label="Qué puede haber" count={`${NEIGHBORHOOD.services.length} tipos`}>
            <BulletList items={NEIGHBORHOOD.services} />
          </Fold>
        </BlockPart>
        <BlockPart>
          <NeighborhoodAgenda />
        </BlockPart>
        <BlockPart title="Antes de ir">
          <BulletList items={NEIGHBORHOOD.before} />
        </BlockPart>
        <BlockPart>
          <Callout>
            <CalloutButton href={NEIGHBORHOOD.schedule.url}>{NEIGHBORHOOD.schedule.label}</CalloutButton>
          </Callout>
        </BlockPart>
      </ToneBlock>
    </SectionBody>
  )
}
