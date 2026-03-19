import { createBrowserRouter } from "react-router";
import { RootLayout, ScrollToTopLayout } from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import MyEvents from "./pages/MyEvents";
import EventDetail from "./pages/EventDetail";
import RecommendedEvents from "./pages/RecommendedEvents";
import RecommendedPeople from "./pages/RecommendedPeople";
import AllEvents from "./pages/AllEvents";
import ProfileDetail from "./pages/ProfileDetail";
import UserProfile from "./pages/UserProfile";
import DesignTile from "./pages/DesignTile";
import Chats from "./pages/Chats";
import Onboarding from "./pages/Onboarding";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // Public routes (no auth guard)
      {
        path: "/splash",
        Component: Splash,
      },
      {
        path: "/auth",
        Component: Auth,
      },
      {
        path: "/onboarding",
        Component: Onboarding,
      },
      // Protected app routes
      {
        Component: ScrollToTopLayout,
        children: [
          {
            path: "/",
            Component: Dashboard,
          },
          {
            path: "/calendar",
            Component: Calendar,
          },
          {
            path: "/my-events",
            Component: MyEvents,
          },
          {
            path: "/event/:id",
            Component: EventDetail,
          },
          {
            path: "/recommended-events",
            Component: RecommendedEvents,
          },
          {
            path: "/recommended-people",
            Component: RecommendedPeople,
          },
          {
            path: "/all-events",
            Component: AllEvents,
          },
          {
            path: "/profile/:id",
            Component: ProfileDetail,
          },
          {
            path: "/my-profile",
            Component: UserProfile,
          },
          {
            path: "/designtile",
            Component: DesignTile,
          },
          {
            path: "/chats",
            Component: Chats,
          },
        ],
      },
    ],
  },
]);
