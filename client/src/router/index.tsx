import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { Category } from "@/screens/RenderCategory";
import { Home } from "@/screens/Home";
import { MyHealth } from "@/screens/MyHealth";
import { NotFound } from "@/screens/NotFound";
import { RedirectToHealthGeneral } from "./RedirectToHealthGeneral";
import { LEGACY_PHYSICAL_HEALTH_SLUG, PATHS } from "./paths";

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        element: <AppLayout/>,
        children: [
          { path: PATHS.home, element: <Home/> },
          // /temas alone has no page (each category is /temas/<slug>): it sends people to the home
          { path: PATHS.topics, element: <Navigate to={PATHS.home} replace/> },
          // Salud física was renamed Salud general: the old address redirects (before the generic :slug route)
          { path: PATHS.topic(LEGACY_PHYSICAL_HEALTH_SLUG), element: <RedirectToHealthGeneral/> },
          { path: PATHS.topic(":slug"), element: <Category/> },
          { path: PATHS.resources, element: <Category/> },
          { path: PATHS.centers, element: <Category/> },
          { path: PATHS.myHealth, element: <MyHealth/> },
          { path: PATHS.firstAid, element: <Category/> },
          {
            path: PATHS.firstAidQuiz,
            lazy: async () => ({ Component: (await import("@/screens/FirstAidQuiz")).FirstAidQuizScreen }),
          },
          {
            path: PATHS.firstAidGuide(":slug"),
            // Downloaded when a guide is opened: the guides are not part of the first load
            lazy: async () => ({ Component: (await import("@/screens/FirstAidGuide")).FirstAidGuideScreen }),
          },
          { path: PATHS.about, element: <Category/> },
          // Last: any other address
          { path: "*", element: <NotFound/> },
        ],
      },
    ],
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
)
