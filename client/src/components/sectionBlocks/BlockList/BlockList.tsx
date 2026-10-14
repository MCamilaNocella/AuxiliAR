import type { ReactNode } from "react"
import { Info, Siren } from "lucide-react"
import type { Block } from "@/types/blocks"
import { blockIcon } from "@/utils/blockIcons"
import { toneOf } from "@/types/tone"
import { guideTones } from "@/utils/guideTones"
import { AspectsList } from "../AspectsList"
import { AxesGrid } from "../AxesGrid"
import { BlockButton } from "../BlockButton"
import { BlockMap } from "../BlockMap"
import { BlockNote } from "../BlockNote"
import { BlockPart } from "../BlockPart"
import { BulletList } from "../BulletList"
import { CallCard } from "../CallCard"
import { Callout } from "../Callout"
import { ChecksList } from "../ChecksList"
import { BlockTabs } from "../BlockTabs"
import { DataTable } from "../DataTable"
import { DoDont } from "../DoDont"
import { Guide } from "../Guide"
import { KitChecklist } from "../KitChecklist"
import { Fold } from "../Fold"
import { LinkCards } from "../LinkCards"
import { PetVaccines } from "../PetVaccines"
import { PictureBanner } from "../PictureBanner"
import { PriorityBanner } from "../PriorityBanner"
import { RichText } from "../RichText"
import { RowsList } from "../RowsList"
import { SoftCards } from "../SoftCards"
import { SpotsGrid } from "../SpotsGrid"
import { StepList } from "../StepList"
import { ToneBlock } from "../ToneBlock"
import { Trainers } from "../Trainers"
import type { BlockListProps } from "./BlockList.types"

const rich = (texts: string[] = []) => texts.map((text, index) => <RichText key={index} text={text} />)
const leads = (lead: string | string[] | undefined) => rich(lead === undefined ? [] : Array.isArray(lead) ? lead : [lead])

/** What a block shows under its title, by type (as the RENDER of the category models) */
const content = (block: Block, props: BlockListProps): ReactNode => {
  switch (block.type) {
    case "text":
      return (
        <div className="grid gap-[0.6rem] pt-2">
          {(block.paras ?? (block.text ? [block.text] : [])).map((paragraph, index) => (
            <p key={index} className="m-0">
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      )
    case "list":
      return <BulletList items={rich(block.items)} />
    case "steps":
      return <StepList steps={rich(block.items)} />
    case "cards":
      return (
        <SoftCards
          items={block.items.map((card) => ({
            icon: blockIcon(card.icon),
            tone: card.tone ? toneOf(card.tone) : undefined,
            title: card.title,
            text: rich(card.paras ?? (card.text ? [card.text] : [])),
            list: card.list && rich(card.list),
            more: card.more && rich(card.more),
            moreLabel: card.moreLabel,
            note: card.note && <RichText text={card.note} />,
            action: card.button && <BlockButton button={card.button} />,
          }))}
        />
      )
    case "rows":
      return <RowsList items={block.items} />
    case "callout": {
      const tone = block.tone ?? "soft"
      return (
        <Callout tone={tone} id={undefined} title={block.title} icon={blockIcon(block.icon) ?? (block.title ? (tone === "alert" ? Siren : Info) : undefined)}>
          {(block.paras ?? (block.text ? [block.text] : [])).map((paragraph, index) => (
            <p key={index} className="m-0">
              <RichText text={paragraph} />
            </p>
          ))}
          {block.list && (
            <ul>
              {block.list.map((item, index) => (
                <li key={index}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          )}
          {block.foot && <p className="m-0 text-[0.95rem] text-ink-soft">{block.foot}</p>}
          {block.button && <BlockButton button={block.button} alert={tone === "alert"} />}
        </Callout>
      )
    }
    case "phone":
      return (
        <div className="mt-3 grid gap-3">
          <CallCard number={block.number} dial={block.dial} name={block.name} text={block.text} meta={[block.hours, block.where, block.cost].filter((m): m is string => !!m)} />
        </div>
      )
    case "faq":
      return (
        <div>
          {block.items.map(({ q, a = [], url }) => (
            <Fold key={q} label={q} question>
              {a.map((paragraph, index) => (
                <p key={index} className="m-0">
                  <RichText text={paragraph} />
                </p>
              ))}
              {url && (
                <span className="text-[0.85rem]">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted underline">
                    Fuente oficial
                  </a>
                </span>
              )}
            </Fold>
          ))}
        </div>
      )
    case "table":
      return <DataTable head={block.head} rows={block.rows} />
    case "slide":
      return (
        <Fold label={block.label} count={block.count}>
          <BlockList {...props} blocks={block.blocks} depth={1} />
        </Fold>
      )
    case "group":
      return <BlockList {...props} blocks={block.blocks} depth={1} />
    case "banner":
      return <PriorityBanner icon={blockIcon(block.icon)} title={block.title ?? ""} text={<RichText text={block.text} />} />
    case "aspects":
      return <AspectsList items={block.items} />
    case "axes":
      return <AxesGrid items={block.items} />
    case "checks":
      return <ChecksList items={rich(block.items)} />
    case "spots":
      return <SpotsGrid items={block.items} />
    case "links":
      return <LinkCards items={block.items} />
    case "map":
      return <BlockMap places={props.places ?? []} provinces={props.provinces ?? []} filters={block.filters} empty={block.empty} />
    case "dodont":
      return <DoDont yes={rich(block.yes)} no={rich(block.no)} />
    case "trainers":
      return <Trainers items={block.items} listTitle={block.listTitle} after={block.after} />
    case "petvax":
      return <PetVaccines species={block.species} />
    case "citytabs":
      return (
        <BlockTabs
          label="Elegí tu ciudad"
          scroll
          tabs={block.cities.map(({ label, steps, button, more = [] }) => ({
            label,
            content: (
              <div>
                <StepList steps={rich(steps)} />
                {button && (
                  <div className="mt-3">
                    <BlockButton button={button} />
                  </div>
                )}
                {more.length > 0 && (
                  <Fold label="Ver todo lo que dice la página">
                    <BlockList {...props} blocks={more} depth={1} />
                  </Fold>
                )}
              </div>
            ),
          }))}
        />
      )
    case "picture":
      return <PictureBanner title={block.title ?? ""} text={<RichText text={block.text} />} />
    case "guide":
    case "kit":
      return null
  }
}

/** The blocks of a section of the category models, each with its title, lead, content and closing note */
export const BlockList = (props: BlockListProps) => {
  const { blocks, depth = 0 } = props
  const tones = guideTones(blocks)
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "guide") return <Guide key={block.id} guide={block} tone={tones[block.id] ?? 2} />
        if (block.type === "kit") return <KitChecklist key={block.id} id={block.id} title={block.title} lead={block.lead} groups={block.groups} tone={tones[block.id] ?? 2} />
        const key = block.id ?? `${block.type}-${index}`
        const note = block.note && <BlockNote>{<RichText text={block.note} />}</BlockNote>
        // A callout carries its own title; a banner is a block of its own, without title
        const ownTitle = block.type === "callout" || block.type === "banner" || block.type === "picture"
        // As the models: any block but a callout may close with an action
        const action = block.type !== "callout" && block.button && <BlockButton button={block.button} />
        if (depth) {
          return (
            <BlockPart key={key} id={block.id} title={ownTitle ? undefined : block.title} icon={blockIcon(block.icon)} lead={leads(block.lead)}>
              {content(block, props)}
              {action}
              {note}
            </BlockPart>
          )
        }
        const Icon = block.noIcon ? undefined : (blockIcon(block.icon) ?? Info)
        return (
          <ToneBlock key={key} id={block.id} title={ownTitle ? undefined : block.title} icon={Icon} tone={toneOf(block.type === "callout" ? undefined : block.tone)} lead={leads(block.lead)} bare={block.bare || ownTitle}>
            {content(block, props)}
            {action}
            {note}
          </ToneBlock>
        )
      })}
    </>
  )
}
