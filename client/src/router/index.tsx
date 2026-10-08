import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuxiModels } from "@/screens/AuxiModels";
import { Category } from "@/screens/RenderCategory";
import { Home } from "@/screens/Home";
import { Login } from "@/screens/Login";
import { PeerChatSketch } from "@/screens/PeerChatSketch";
import { HealthGeneralRoute } from "./HealthGeneralRoute";
import { RedirectToHealthGeneral } from "./RedirectToHealthGeneral";
import { HEALTH_GENERAL_SLUG, LEGACY_PHYSICAL_HEALTH_SLUG, PATHS } from "./paths";

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        element: <AppLayout/>,
        children: [
          { path: PATHS.home, element: <Home/> },
          // Addresses whose pages are still empty (and not in the navigation) send people to the home instead of to a blank page; their code is kept
          { path: PATHS.topics, element: <Navigate to={PATHS.home} replace/> },
          // Salud física was renamed Salud general: the old address redirects (before the generic :slug route)
          { path: PATHS.topic(LEGACY_PHYSICAL_HEALTH_SLUG), element: <RedirectToHealthGeneral/> },
          // Salud general no longer has Primeros auxilios: its old section address redirects to /primeros-auxilios
          { path: PATHS.topic(HEALTH_GENERAL_SLUG), element: <HealthGeneralRoute/> },
          { path: PATHS.topic(":slug"), element: <Category/> },
          { path: PATHS.resources, element: <Navigate to={PATHS.home} replace/> },
          { path: PATHS.centers, element: <Category/> },
          { path: PATHS.myHealth, element: <Navigate to={PATHS.home} replace/> },
          { path: PATHS.firstAid, element: <Category/> },
          {
            path: PATHS.firstAidGuide(":slug"),
            // Downloaded when a guide is opened: the guides are not part of the first load
            lazy: async () => ({ Component: (await import("@/screens/FirstAidGuide")).FirstAidGuideScreen }),
          },
          { path: PATHS.about, element: <Category/> },
          { path: PATHS.auxiModels, element: <AuxiModels/> },
          { path: PATHS.peerChatSketch, element: <PeerChatSketch/> },
        ],
      },
      {
        path: PATHS.login,
        element: <Login/>,
      },
    ],
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
)
