
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import SignIn from "../pages/auth/signin/page";
import SignUp from "../pages/auth/signup/page";
import ForgotPassword from "../pages/auth/forgot-password/page";
import ResetPassword from "../pages/auth/reset-password/page";
import AdminDashboard from "../pages/admin/page";
import UserDashboard from "../pages/dashboard/page";
import CheckoutPage from "../pages/checkout/page";
import ProtectedRoute from "./ProtectedRoute";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["user", "admin"]}>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute roles={["user", "admin"]}>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
