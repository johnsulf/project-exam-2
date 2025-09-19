import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import RouteError from "@/components/errors/RouteError";
import { lazy } from "react";
import { RequireAuth } from "@/features/auth/RequireAuth";
import Kitchen from "@/pages/Kitchen";

const Home = lazy(() => import("@/pages/Home"));
const Venues = lazy(() => import("@/pages/Venues"));
const VenueDetail = lazy(() => import("@/pages/VenueDetail"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Home /> },
        { path: "venues", element: <Venues /> },
        { path: "venues/:id", element: <VenueDetail /> },
        { path: "_kitchen", element: <Kitchen /> },
        { path: "login", element: <Login /> },

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
