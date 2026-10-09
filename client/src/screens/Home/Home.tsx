import { Categories } from "@/components/home/Categories"
import { FirstAidBand } from "@/components/home/FirstAidBand"

// The layout already provides the header, emergencies and navigation.
// Content placed here must use text-on-home (bg-home is dark in every theme).
export const Home = () => (
  <div className="min-h-(--content-min-h) bg-home text-on-home">
    <div className="page-container pt-6 pb-10 sm:pt-8">
      <FirstAidBand />
      <Categories />
    </div>
  </div>
)
