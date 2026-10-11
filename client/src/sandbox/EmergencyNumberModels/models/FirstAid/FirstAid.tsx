import { Link } from "react-router"
import { ArrowRight, Bandage, ChevronRight } from "lucide-react"
import { GUIDES_GRID } from "@/components/layout/EmergencyBar/EmergencyBar.constants"
import { FEATURED_FIRST_AID } from "@/data/emergency"
import { PATHS } from "@/router/paths"
import { CARD_BASE } from "./FirstAid.constants"
import type { FirstAidBlockProps } from "./FirstAid.types"

/** The bar's right column: heading, one card per guide and "Ver todas las guías"; each model only changes the cards */
const FirstAidBlock = ({ heading = "plain", allLinkClass, renderCard }: FirstAidBlockProps) => (
  <div className="flex flex-col gap-2.5">
    <h2
      className={`m-0 flex items-center gap-2 font-extrabold text-alert-text ${heading === "big" ? "text-lg/6" : "text-base"}`}
    >
      <Bandage aria-hidden="true" className="size-4.5 flex-none" />
      Primeros auxilios: qué hacer ya
    </h2>
    <ul role="list" className={`m-0 grid flex-1 auto-rows-fr list-none gap-2 p-0 ${GUIDES_GRID}`}>
      {FEATURED_FIRST_AID.map((guide) => (
        <li key={guide.slug}>{renderCard(guide)}</li>
      ))}
      <li>
        <Link
          to={PATHS.firstAid}
          className={`flex h-full min-h-11 items-center gap-1.5 px-1 py-1.5 text-sm font-extrabold underline underline-offset-4 ${allLinkClass}`}
        >
          Ver todas las guías
          <ArrowRight aria-hidden="true" className="size-4 flex-none" />
        </Link>
      </li>
    </ul>
  </div>
)

/** F1: the usual light card with a thick red edge on the left */
export const FirstAidRedEdge = () => (
  <FirstAidBlock
    allLinkClass="text-alert-text hover:text-alert-dark"
    renderCard={({ slug, title }) => (
      <Link
        to={PATHS.firstAidGuide(slug)}
        className={`${CARD_BASE} border border-l-4 border-alert-card-line border-l-alert bg-card text-ink hover:border-alert-text hover:text-ink`}
      >
        <span className="min-w-0 wrap-break-word">{title}</span>
        <ChevronRight aria-hidden="true" className="size-4 flex-none text-alert-text" />
      </Link>
    )}
  />
)

/** F2: red outline and red text; it fills red on hover */
export const FirstAidOutline = () => (
  <FirstAidBlock
    allLinkClass="text-alert-text hover:text-alert-dark"
    renderCard={({ slug, title }) => (
      <Link
        to={PATHS.firstAidGuide(slug)}
        className={`${CARD_BASE} border-2 border-alert bg-card font-extrabold text-alert-text hover:bg-alert hover:text-on-alert`}
      >
        <span className="min-w-0 wrap-break-word">{title}</span>
        <ChevronRight aria-hidden="true" className="size-4 flex-none" />
      </Link>
    )}
  />
)

/** F3: the usual light card with a thick red line at the bottom */
export const FirstAidRedBottom = () => (
  <FirstAidBlock
    allLinkClass="text-alert-text hover:text-alert-dark"
    renderCard={({ slug, title }) => (
      <Link
        to={PATHS.firstAidGuide(slug)}
        className={`${CARD_BASE} border border-b-4 border-alert-card-line border-b-alert bg-card text-ink hover:border-alert-text hover:border-b-alert hover:text-ink`}
      >
        <span className="min-w-0 wrap-break-word">{title}</span>
        <ChevronRight aria-hidden="true" className="size-4 flex-none text-alert-text" />
      </Link>
    )}
  />
)

/** F4: solid wine (the brand color), so it stands out without competing with the red numbers */
export const FirstAidSolidBrand = () => (
  <FirstAidBlock
    allLinkClass="text-brand hover:text-brand-dark"
    renderCard={({ slug, title }) => (
      <Link
        to={PATHS.firstAidGuide(slug)}
        className={`${CARD_BASE} bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand`}
      >
        <span className="min-w-0 wrap-break-word">{title}</span>
        <ChevronRight aria-hidden="true" className="size-4 flex-none" />
      </Link>
    )}
  />
)

/** F5: bigger heading and two-line cards: the guide plus a red "Paso a paso" */
export const FirstAidStepByStep = () => (
  <FirstAidBlock
    heading="big"
    allLinkClass="text-alert-text hover:text-alert-dark"
    renderCard={({ slug, title }) => (
      <Link
        to={PATHS.firstAidGuide(slug)}
        className={`${CARD_BASE} border border-alert-card-line bg-card py-2 text-ink hover:border-alert-text hover:text-ink`}
      >
        <span className="flex min-w-0 flex-col">
          <span className="wrap-break-word">{title}</span>
          <span className="text-xs font-extrabold text-alert-text">Paso a paso</span>
        </span>
        <ArrowRight aria-hidden="true" className="size-4 flex-none text-alert-text" />
      </Link>
    )}
  />
)
