import { GuideCards } from "@/components/firstAid/GuideCards"
import { ActionLink } from "@/components/health/ActionLink"
import { revealEmergencies } from "@/utils/revealEmergencies"

/**
 * Salud general · Primeros auxilios: a door into the guides. It holds no instructions of its own: the cards open the
 * guides of src/content/firstAid (the same ones the Primeros auxilios category will use).
 */
export default function Section3Content() {
  return (
    <div className="mt-2 max-w-4xl">
      <h3 className="m-0 text-xl font-extrabold">¿Necesitás actuar ahora?</h3>
      <p className="m-0 mt-1">Si hay riesgo inmediato para la vida, pedí ayuda primero: llamá al número de emergencias de tu localidad.</p>
      <div className="mt-3">
        <ActionLink onClick={revealEmergencies} variant="primary">
          Ver números de emergencia
        </ActionLink>
      </div>

      <div className="mt-8">
        <GuideCards headingLevel="h3" />
      </div>
    </div>
  )
}
