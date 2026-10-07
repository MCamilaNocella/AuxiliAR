import { Link } from "react-router"
import { PATHS } from "@/router/paths"

export const Footer = () => (
  <footer className="border-t border-line bg-surface-alt">
    {/* Phones: text aligned left. Phones and tablets: extra bottom padding so the floating help bot doesn't cover the text; on wide screens it sits beside it */}
    <div className="page-container flex flex-col items-start gap-1 pt-6 pb-24 text-left text-sm sm:items-center sm:text-center lg:pb-6 text-muted">
      {/* Phones: the name on its own line with the tagline below; wider screens: one line */}
      <p className="m-0">
        <span className="block font-display text-lg text-ink sm:inline">AuxiliAR</span>
        <span className="hidden sm:inline"> · </span>
        Recursos de salud gratuitos para Argentina
      </p>
      <p className="m-0 text-pretty">
        AuxiliAR no reemplaza la atención médica ni psicológica profesional.{" "}
        {/* Phones: the emergency sentence on its own line, so the numbers stay with "llamá al" */}
        <span className="block sm:inline">
          Ante una emergencia, llamá al <b className="text-ink">911</b> o al <b className="text-ink">107</b>.
        </span>
      </p>
      {/* Same on phones: the link on its own line instead of splitting "Sobre / AuxiliAR" */}
      <p className="m-0">
        Información verificada de fuentes oficiales
        <span className="hidden sm:inline"> · </span>
        <Link to={PATHS.about} className="block font-bold sm:inline">
          Sobre AuxiliAR
        </Link>
      </p>
    </div>
  </footer>
)
