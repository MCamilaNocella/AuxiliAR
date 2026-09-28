import { Categories } from "@/components/home/Categories"

// The layout already provides the header, emergencies and navigation.
// Content placed here must use text-on-home (bg-home is dark in every theme).
export const Home = () => (
  <div className="min-h-(--content-min-h) bg-home text-on-home">
    <div className="mx-auto max-w-310 px-4 pt-6 pb-10 sm:px-6 sm:pt-8 lg:px-8">
      <Categories />
    </div>
  </div>
)
