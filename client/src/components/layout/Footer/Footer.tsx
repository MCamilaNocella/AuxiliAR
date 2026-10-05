import { Link } from "react-router"
import { PATHS } from "@/router/paths"

export const Footer = () => (
  <footer className="border-t border-line bg-surface-alt">
    {/* Extra bottom padding so the floating help bot never covers the footer text */}
    <div className="mx-auto flex max-w-360 flex-col items-center gap-1 px-4 pt-6 pb-24 text-center text-sm text-muted sm:px-6 lg:px-8">
      <p className="m-0">
        <span className="font-display text-lg text-ink">AuxiliAR</span> · Recursos de salud gratuitos para Argentina
      </p>
      <p className="m-0 text-pretty">
        AuxiliAR no reemplaza la atención médica ni psicológica profesional. Ante una emergencia, llamá al{" "}
        <b className="text-ink">911</b> o al <b className="text-ink">107</b>.
      </p>
      <p className="m-0">
        Información verificada de fuentes oficiales ·{" "}
        <Link to={PATHS.about} className="font-bold">
          Sobre AuxiliAR
        </Link>
      </p>
    </div>
  </footer>
)
