import { GuideCards } from "@/components/firstAid/GuideCards"

/**
 * Primeros auxilios · Guías de primeros auxilios: the page of the category. It holds no instructions of its own: the
 * cards open the guides of src/content/firstAid. It has no notice about the emergency numbers: they are always in the bar at the top.
 */
export default function Section3Content() {
  return (
    <div className="mt-2 max-w-4xl">
      <GuideCards headingLevel="h3" />
    </div>
  )
}
