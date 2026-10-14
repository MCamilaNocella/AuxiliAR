import { MapPin, Siren } from "lucide-react"
import { ModelLink } from "@/components/sectionBlocks/ModelLink"
import { SectionBody } from "@/components/sectionBlocks/SectionBody"
import { SideCallout } from "@/components/sectionBlocks/SideCallout"
import { WideKey } from "@/components/sectionBlocks/WideKey"
import { PATHS } from "@/router/paths"
import { blockIcon } from "@/utils/blockIcons"
import { PH_WHERE } from "../../PhysicalHealth.model"

/** Salud general · Dónde atenderme, as the chosen model: the three places, when it's an emergency and the map */
export default function Section1Content() {
  return (
    <SectionBody>
      <WideKey cards={PH_WHERE.places.map((place) => ({ ...place, icon: blockIcon(place.icon), examples: [...place.examples] }))} />
      <SideCallout title="¿Es una emergencia?" icon={Siren}>
        <p className="m-0">{PH_WHERE.emergency}</p>
      </SideCallout>
      <div>
        <ModelLink to={PATHS.centers} icon={MapPin}>
          {PH_WHERE.mapLabel}
        </ModelLink>
      </div>
    </SectionBody>
  )
}
