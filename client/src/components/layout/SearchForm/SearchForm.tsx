import type { FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Search } from "lucide-react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { PATHS } from "@/router/paths"
import { PLACEHOLDER_NARROW, PLACEHOLDER_WIDE, WIDE_PLACEHOLDER_QUERY } from "./SearchForm.constants"

export const SearchForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get("q") ?? ""
  const isWide = useMediaQuery(WIDE_PLACEHOLDER_QUERY)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim()
    if (!query) return
    navigate(`${PATHS.search}?${new URLSearchParams({ q: query })}`)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="min-w-0 flex-1 sm:max-w-md">
      <label className="flex h-10 items-center gap-2 rounded-full border border-control-line bg-field px-3.5 transition-colors focus-within:border-brand hover:border-brand">
        <Search aria-hidden="true" className="size-4.5 flex-none text-muted" />
        <span className="sr-only">Buscar en AuxiliAR</span>
        <input
          key={currentQuery}
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder={isWide ? PLACEHOLDER_WIDE : PLACEHOLDER_NARROW}
          enterKeyHint="search"
          // 16px como mínimo: evita el zoom automático de iOS al enfocar
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </label>
    </form>
  )
}
