import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import RouteError from "@/components/errors/RouteError";
import { lazy } from "react";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireManager } from "@/features/auth/RequireManager";
import Kitchen from "@/pages/Kitchen";

const Home = lazy(() => import("@/pages/Home"));
const Venues = lazy(() => import("@/pages/Venues"));
const VenueDetail = lazy(() => import("@/pages/VenueDetail"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));
const ManageHome = lazy(() => import("@/pages/manage/ManageHome"));
const ManageNewVenue = lazy(() => import("@/pages/manage/ManageNewVenue"));
const ManageEditVenue = lazy(() => import("@/pages/manage/ManageEditVenue"));
const ManageDeleteVenue = lazy(
  () => import("@/pages/manage/ManageDeleteVenue"),
);
const ManageVenueBookings = lazy(
  () => import("@/pages/manage/ManageVenueBookings"),
);
const ManageVenueDetail = lazy(
  () => import("@/pages/manage/ManageVenueDetail"),
);
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

        // Signed-in only
        {
          element: <RequireAuth />,
          children: [
            { path: "profile", element: <Profile /> },

            // Manager-only
            {
              element: <RequireManager />,
              children: [
                { path: "manage", element: <ManageHome /> },
                { path: "manage/new", element: <ManageNewVenue /> },
                { path: "manage/:id/edit", element: <ManageEditVenue /> },
                { path: "manage/:id/delete", element: <ManageDeleteVenue /> },
                {
                  path: "manage/:id/bookings",
                  element: <ManageVenueBookings />,
                },
                { path: "manage/:id", element: <ManageVenueDetail /> },
              ],
            },
          ],
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
