import { BookA, MessagesSquare } from "lucide-react"
import { Fold } from "@/components/sectionBlocks/Fold"
import { Glossary } from "@/components/sectionBlocks/Glossary"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SectionKey } from "@/components/sectionBlocks/SectionKey"
import { ToneBlock } from "@/components/sectionBlocks/ToneBlock"
import { DOUBTS_KEY, DOUBTS_SOURCES, FAQ, GLOSSARY } from "./Section3.constants"

/** Más recursos · Dudas, as the model recursos-1: the frequent questions (each one opens its answer) and the glossary with its search box */
export default function Section3Content() {
  return (
    <SectionBody sources={DOUBTS_SOURCES} look="accent">
      <SectionKey cells={DOUBTS_KEY} />
      <ToneBlock id="faq" title="Preguntas frecuentes" icon={MessagesSquare} tone={2}>
        <div>
          {FAQ.map(({ id, question, answer }) => (
            <Fold key={id} label={question} question>
              {answer.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </Fold>
          ))}
        </div>
      </ToneBlock>
      <ToneBlock id="glosario" title="Glosario" icon={BookA} tone={4}>
        <Glossary terms={GLOSSARY} />
      </ToneBlock>
    </SectionBody>
  )
}
