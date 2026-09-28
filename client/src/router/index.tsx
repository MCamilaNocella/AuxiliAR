import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { Home } from "@/screens/Home";
import { Login } from "@/screens/Login";
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
          { path: PATHS.centers, element: <Placeholder title="Centros cerca"/> },
          { path: PATHS.myHealth, element: <Placeholder title="Mi Salud"/> },
          { path: PATHS.firstAid, element: <Placeholder title="Primeros auxilios"/> },
          { path: PATHS.firstAidGuide(":slug"), element: <Placeholder title="Guía de primeros auxilios"/> },
          { path: PATHS.search, element: <SearchResults/> },
          { path: PATHS.about, element: <Placeholder title="Sobre AuxiliAR"/> },
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
