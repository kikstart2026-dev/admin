import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./Shared/Header/Header";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HomePage from "./Pages/Home/HomePage";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import WhyUsPage from "./Pages/WhyUs/WhyUsPage";
import FaqPage from "./Pages/FaqPage/FaqPage";
import InterestedSchoolsPage from "./Pages/InteretedSchools/InterestedSchoolsPage";

import AdminLogin from "./Pages/Authentication/AdminLogin/AdminLogin";
import AdminOtpVerify from "./Pages/Authentication/AdminOtpVerify/AdminOtpVerify";
import AdminForgotPass from "./Pages/Authentication/AdminForgotPass/AdminForgotPass";
import AdminResetPass from "./Pages/Authentication/AdminResetPass/AdminResetPass";

import Cookies from "js-cookie";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

// ================= 🔐 ADMIN PROTECTED ROUTE =================
function AdminProtectedRoute({ children }) {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ================= 🔁 AUTH ROUTE =================
function AdminAuthRoute({ children }) {
  const token = Cookies.get("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ================= LAYOUT =================
function Layout() {
  const location = useLocation();

  // 🔥 সব auth page e header hide
  const hideHeaderRoutes = [
    "/login",
    "/admin-otp",
    "/admin-forgot",
    "/admin-reset",
  ];

  const isAuthPage = hideHeaderRoutes.includes(location.pathname);

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
          .replace("/", "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {!isAuthPage && <Header title={title} />}

      <Routes>

        {/* ================= ADMIN AUTH ================= */}

        <Route
          path="/login"
          element={
            <AdminAuthRoute>
              <AdminLogin />
            </AdminAuthRoute>
          }
        />

        <Route path="/admin-otp" element={<AdminOtpVerify />} />

        <Route path="/admin-forgot" element={<AdminForgotPass />} />

        <Route path="/admin-reset" element={<AdminResetPass />} />

        {/* ================= PROTECTED ADMIN ROUTES ================= */}

        <Route
          path="/"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/home-page"
          element={
            <AdminProtectedRoute>
              <HomePage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/about-control"
          element={
            <AdminProtectedRoute>
              <About />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/contact-control"
          element={
            <AdminProtectedRoute>
              <Contact />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/why-us"
          element={
            <AdminProtectedRoute>
              <WhyUsPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/faq-page"
          element={
            <AdminProtectedRoute>
              <FaqPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/interested-schools"
          element={
            <AdminProtectedRoute>
              <InterestedSchoolsPage />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

// ================= APP =================
function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="377086841705-5qap8i7ifjqmr9hu09emtonof1qo2mnb.apps.googleusercontent.com">
        <Router>
          <ToastContainer
            position="top-center"
            toastClassName="center-toast"
            bodyClassName="center-toast-body"
            closeOnClick={false}
            draggable={false}
          />

          <Layout />
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;