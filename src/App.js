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

import AdminLogin from "./Pages/Authentication/AdminLogin/AdminLogin";
import AdminOtpVerify from "./Pages/Authentication/AdminOtpVerify/AdminOtpVerify";
import AdminForgotPass from "./Pages/Authentication/AdminForgotPass/AdminForgotPass";
import AdminResetPass from "./Pages/Authentication/AdminResetPass/AdminResetPass";

import Cookies from "js-cookie";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import RoleManagementPage from "./Pages/RoleManagementPage/RoleManagementPage";
import PermissionManagementPage from "./Pages/PermissionManagementPage/PermissionManagementPage";

// ================= 🔐 ADMIN PROTECTED ROUTE =================
function AdminProtectedRoute({ children, blockSubadmin = false }) {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem("adminUser"));
  const role = user?.role;

  // 🔥 subadmin block
  if (blockSubadmin && role === "subadmin") {
    return <Navigate to="/" replace />;
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

        {/* 🔥 ONLY ADMIN ACCESS */}

        <Route
          path="/role-management"
          element={
            <AdminProtectedRoute blockSubadmin={true}>
              <RoleManagementPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/permission-management"
          element={
            <AdminProtectedRoute blockSubadmin={true}>
              <PermissionManagementPage />
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