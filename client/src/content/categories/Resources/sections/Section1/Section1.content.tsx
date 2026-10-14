import { Brain, HandHeart, Phone, Syringe, Users } from "lucide-react"
import { BlockNote } from "@/components/sectionBlocks/BlockNote"
import { BulletList } from "@/components/sectionBlocks/BulletList"
import { Callout } from "@/components/sectionBlocks/Callout"
import { CalloutButton } from "@/components/sectionBlocks/CalloutButton"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { SoftCards } from "@/components/sectionBlocks/SoftCards"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { ANYWHERE_RIGHTS, COMPLAINT, MENTAL_RIGHTS, MENTAL_RIGHTS_LEAD, MENTAL_RIGHTS_NOTE, OTHER_RIGHTS, PATIENT_RIGHTS, RIGHTS_KEY, RIGHTS_SOURCES } from "./Section1.constants"

/** Más recursos · Derechos, as the model recursos-1: the summary, one block per topic with its law, and where to complain */
export default function Section1Content() {
  return (
    <SectionBody sources={RIGHTS_SOURCES} look="accent">
      <SectionKey cells={RIGHTS_KEY} />
      <ToneBlock id="paciente" title="Al atenderte, en todo el país" icon={HandHeart} tone={2} lead={["La Ley 26.529 reconoce estos derechos a cualquier persona que se atiende, en el sistema público o en el privado."]}>
        <SoftCards items={PATIENT_RIGHTS} />
      </ToneBlock>
      <ToneBlock id="todos" title="Seas de donde seas" icon={Users} tone={4}>
        <SoftCards items={ANYWHERE_RIGHTS} />
      </ToneBlock>
      <ToneBlock id="mental" title="Salud mental" icon={Brain} tone={5} lead={[MENTAL_RIGHTS_LEAD]}>
        <BulletList items={MENTAL_RIGHTS} />
        <BlockNote>{MENTAL_RIGHTS_NOTE}</BlockNote>
      </ToneBlock>
      <ToneBlock id="otros" title="Vacunas y salud sexual" icon={Syringe} tone={1}>
        <SoftCards items={OTHER_RIGHTS} />
      </ToneBlock>
      <Callout id="reclamar" tone="brand" title={COMPLAINT.title} icon={Phone}>
        <p className="m-0">{COMPLAINT.text}</p>
        <CalloutButton href={`tel:${COMPLAINT.phone.dial}`} icon={Phone}>
          {`Llamar al ${COMPLAINT.phone.display}`}
        </CalloutButton>
      </Callout>
    </SectionBody>
  )
}
