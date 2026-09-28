import { useRef } from "react"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { Logo } from "../Logo"
import { SearchForm } from "../SearchForm"

export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--header-h")

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-card">
      <div className="mx-auto flex max-w-310 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:gap-x-6 sm:px-6 lg:px-8">
        <Logo />
        <SearchForm />
      </div>
    </header>
  )
}
