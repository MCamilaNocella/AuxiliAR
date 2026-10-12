import { Link, useParams } from "react-router"
import { FirstAidGuide } from "@/components/firstAid/FirstAidGuide"
import { Page } from "@/components/layout/Page"
import { FIRST_AID_HUB_PATH, getFirstAidGuide } from "@/content/firstAid"

/** /primeros-auxilios/:slug — one guide, from the single copy in src/content/firstAid */
export const FirstAidGuideScreen = () => {
  const { slug } = useParams()
  const guide = getFirstAidGuide(slug)

  if (!guide) {
    return (
      <Page title="No encontramos esta guía">
        <p className="text-muted">
          Puede que el enlace esté mal escrito. <Link to={FIRST_AID_HUB_PATH}>Ver las guías de primeros auxilios</Link>
        </p>
      </Page>
    )
  }

  return <FirstAidGuide key={guide.slug} guide={guide} />
}
