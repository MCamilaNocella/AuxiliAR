import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { Category } from "@/screens/RenderCategory";
import { Home } from "@/screens/Home";
import { MyHealth } from "@/screens/MyHealth";
import { NotFound } from "@/screens/NotFound";
import { RedirectToHealthGeneral } from "./RedirectToHealthGeneral";
import { LEGACY_PHYSICAL_HEALTH_SLUG, PATHS } from "./paths";

/**
 * Prototype screens (the Auxi models comparison, the peer chat sketch, the empty login): registered only in development, so the
 * demo and production builds answer them with the 404. Their code is kept, and loaded only when one of them is opened.
 */
const PROTOTYPES_ENABLED = import.meta.env.DEV

const prototypeRoutes: RouteObject[] = PROTOTYPES_ENABLED
  ? [
      { path: PATHS.auxiModels, lazy: async () => ({ Component: (await import("@/screens/AuxiModels")).AuxiModels }) },
      { path: PATHS.peerChatSketch, lazy: async () => ({ Component: (await import("@/screens/PeerChatSketch")).PeerChatSketch }) },
    ]
  : []

const loginRoutes: RouteObject[] = PROTOTYPES_ENABLED ? [{ path: PATHS.login, lazy: async () => ({ Component: (await import("@/screens/Login")).Login }) }] : []

// Local design pages in src/sandbox (git-ignored): each folder's route.tsx exports `sandboxRoute`.
// In a clone without that folder the glob is empty and nothing changes.
const sandboxRoutes = Object.values(
  import.meta.glob<{ sandboxRoute: RouteObject }>("../sandbox/*/route.tsx", { eager: true }),
).map(({ sandboxRoute }) => sandboxRoute);

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
          { path: PATHS.topic(":slug"), element: <Category/> },
          { path: PATHS.resources, element: <Category/> },
          { path: PATHS.centers, element: <Category/> },
          { path: PATHS.myHealth, element: <MyHealth/> },
          { path: PATHS.firstAid, element: <Category/> },
          {
            path: PATHS.firstAidGuide(":slug"),
            // Downloaded when a guide is opened: the guides are not part of the first load
            lazy: async () => ({ Component: (await import("@/screens/FirstAidGuide")).FirstAidGuideScreen }),
          },
          { path: PATHS.about, element: <Category/> },
          ...prototypeRoutes,
          ...sandboxRoutes,
          // Last: any other address
          { path: "*", element: <NotFound/> },
        ],
      },
      ...loginRoutes,
    ],
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
)
