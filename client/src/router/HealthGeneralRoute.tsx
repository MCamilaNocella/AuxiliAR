import { Navigate, useLocation } from "react-router"
import { Category } from "@/screens/RenderCategory"
import { legacyFirstAidTarget } from "./legacyFirstAid"

/** /temas/salud-general: the category, except for links that still ask for the section that moved to /primeros-auxilios */
export const HealthGeneralRoute = () => {
  const { search, hash } = useLocation()
  const target = legacyFirstAidTarget(search, hash)
  return target ? <Navigate to={target} replace /> : <Category />
}
