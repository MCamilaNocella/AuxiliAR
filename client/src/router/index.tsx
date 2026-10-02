import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuxiModels } from "@/screens/AuxiModels";
import { Category } from "@/screens/RenderCategory";
import { Home } from "@/screens/Home";
import { Login } from "@/screens/Login";
import { PeerChatSketch } from "@/screens/PeerChatSketch";
import { Placeholder } from "@/screens/Placeholder";
import { SearchResults } from "@/screens/SearchResults";
import { PATHS } from "./paths";

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
          { path: PATHS.myHealth, element: <Placeholder title="Mi Salud"/> },
          { path: PATHS.firstAid, element: <Category/> },
          { path: PATHS.firstAidGuide(":slug"), element: <Placeholder title="Guía de primeros auxilios"/> },
          { path: PATHS.search, element: <SearchResults/> },
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
