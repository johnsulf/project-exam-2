import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import Venues from "@/pages/Venues";
import VenueDetail from "@/pages/VenueDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { RequireAuth } from "@/features/auth/RequireAuth";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "venues", element: <Venues /> },
        { path: "venues/:id", element: <VenueDetail /> },

        {
          element: <RequireAuth />,
          children: [{ path: "profile", element: <Profile /> }],
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
