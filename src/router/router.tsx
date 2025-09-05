import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import Venues from "@/pages/Venues";
import VenueDetail from "@/pages/VenueDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { routes } from "./routes";

export const router = createBrowserRouter(
  [
    {
      path: routes.home,
      element: <RootLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: routes.venues, element: <Venues /> },
        { path: routes.venue(), element: <VenueDetail /> },
        { path: routes.profile, element: <Profile /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  // TODO: set basename for GH Pages
);
