import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import RouteError from "@/components/errors/RouteError";
import { lazy } from "react";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireManager } from "@/features/auth/RequireManager";
import { routes } from "./routes";

const Home = lazy(() => import("@/pages/Home"));
const Venues = lazy(() => import("@/pages/Venues"));
const About = lazy(() => import("@/pages/About"));
const VenueDetail = lazy(() => import("@/pages/VenueDetail"));
const Login = lazy(() => import("@/pages/auth/Login"));
const RegisterCustomer = lazy(() => import("@/pages/auth/RegisterCustomer"));
const RegisterManager = lazy(() => import("@/pages/auth/RegisterManager"));
const Profile = lazy(() => import("@/pages/Profile"));
const ManageHome = lazy(() => import("@/pages/manage/ManageHome"));
const ManageNewVenue = lazy(() => import("@/pages/manage/ManageNewVenue"));
const ManageEditVenue = lazy(() => import("@/pages/manage/ManageEditVenue"));
const ManageVenueBookings = lazy(
  () => import("@/pages/manage/ManageVenueBookings"),
);
const ManageVenueDetail = lazy(
  () => import("@/pages/manage/ManageVenueDetail"),
);
const NotFound = lazy(() => import("@/pages/NotFound"));

const toRelative = (path: string) => path.replace(/^\//, "");

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <Home /> },
        { path: toRelative(routes.venues), element: <Venues /> },
        { path: toRelative(routes.about), element: <About /> },
        { path: toRelative(routes.venue()), element: <VenueDetail /> },
        { path: toRelative(routes.auth.login), element: <Login /> },
        {
          path: toRelative(routes.auth.register),
          element: <RegisterCustomer />,
        },
        {
          path: toRelative(routes.auth.registerManager),
          element: <RegisterManager />,
        },

        // Signed-in only
        {
          element: <RequireAuth />,
          children: [
            { path: toRelative(routes.profile), element: <Profile /> },

            // Manager-only
            {
              element: <RequireManager />,
              children: [
                { path: "manage", element: <ManageHome /> },
                { path: "manage/new", element: <ManageNewVenue /> },
                { path: "manage/:id/edit", element: <ManageEditVenue /> },
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
