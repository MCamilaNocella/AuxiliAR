import { useSearchParams } from "react-router"
import { Placeholder } from "../Placeholder"

export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  return <Placeholder title={`Resultados para “${searchParams.get("q") ?? ""}”`} />
}
