
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

// Footer Pages
import AboutUs from "../pages/footer/AboutUs";
import OurStory from "../pages/footer/OurStory";
import ShippingPolicy from "../pages/footer/ShippingPolicy";
import ReturnsRefunds from "../pages/footer/ReturnsRefunds";
import FAQs from "../pages/footer/FAQs";
import ContactUs from "../pages/footer/ContactUs";
import PrivacyPolicy from "../pages/footer/PrivacyPolicy";
import TermsOfService from "../pages/footer/TermsOfService";
import CookiePolicy from "../pages/footer/CookiePolicy";
import Disclaimer from "../pages/footer/Disclaimer";

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
  // Footer Pages
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/our-story",
    element: <OurStory />,
  },
  {
    path: "/shipping-policy",
    element: <ShippingPolicy />,
  },
  {
    path: "/returns-refunds",
    element: <ReturnsRefunds />,
  },
  {
    path: "/faqs",
    element: <FAQs />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
  },
  {
    path: "/disclaimer",
    element: <Disclaimer />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
