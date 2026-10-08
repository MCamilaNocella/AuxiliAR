import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuxiModels } from "@/screens/AuxiModels";
import { Category } from "@/screens/RenderCategory";
import { Home } from "@/screens/Home";
import { Login } from "@/screens/Login";
import { MyHealth } from "@/screens/MyHealth";
import { PeerChatSketch } from "@/screens/PeerChatSketch";
import { Placeholder } from "@/screens/Placeholder";
import { PATHS } from "./paths";

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
          { path: PATHS.topics, element: <Placeholder title="Temas"/> },
          { path: PATHS.topic(":slug"), element: <Category/> },
          { path: PATHS.resources, element: <Category/> },
          { path: PATHS.centers, element: <Category/> },
          { path: PATHS.myHealth, element: <MyHealth/> },
          { path: PATHS.firstAid, element: <Category/> },
          { path: PATHS.firstAidGuide(":slug"), element: <Placeholder title="Guía de primeros auxilios"/> },
          { path: PATHS.about, element: <Category/> },
          { path: PATHS.auxiModels, element: <AuxiModels/> },
          { path: PATHS.peerChatSketch, element: <PeerChatSketch/> },
          ...sandboxRoutes,
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
