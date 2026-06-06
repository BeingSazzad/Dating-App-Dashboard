import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout";
import { PrivateRoute } from "@/router/PrivateRoute";
import { PublicRoute } from "@/router/PublicRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { UsersPage } from "@/pages/dashboard/UsersPage";
import { UserDetailsPage } from "@/pages/dashboard/UserDetailsPage";
import { SubscriptionsPage } from "@/pages/dashboard/SubscriptionsPage";
import { ReportsPage } from "@/pages/dashboard/ReportsPage";
import { ReportDetailsPage } from "@/pages/dashboard/ReportDetailsPage";
import { CmsPage } from "@/pages/dashboard/CmsPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/users/:id", element: <UserDetailsPage /> },
          { path: "/subscriptions", element: <SubscriptionsPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/reports/:id", element: <ReportDetailsPage /> },
          { path: "/cms", element: <CmsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
