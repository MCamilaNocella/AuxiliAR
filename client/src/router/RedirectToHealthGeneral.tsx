import { Navigate, useLocation } from "react-router"
import { HEALTH_GENERAL_SLUG, PATHS } from "./paths"

/**
 * Salud física is now Salud general. Links that were already out there (Auxi's answers, bookmarks, shared pages)
 * still land in the right place: same section, topic or filter, because the query and the hash travel along.
 */
export const RedirectToHealthGeneral = () => {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: PATHS.topic(HEALTH_GENERAL_SLUG), search, hash }} replace />
}
