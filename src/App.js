import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./Shared/Header/Header";
import Sidebar from "./Shared/Sidebar/Sidebar";

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

import User from "./Pages/User/User";
import SubscriptionManagementPage from "./Pages/SubscriptionManagementPage/SubscriptionManagementPage";
import RevenueManagement from "./Pages/ReveueManagement/ReveueManagement";
import CoachManagementPage from "./Pages/CoachManagementPage/CoachManagementPage";
import Children from "./Pages/Childen/Children";

// ================= 🔐 ADMIN PROTECTED ROUTE =================
function AdminProtectedRoute({ children, blockSubadmin = false }) {

  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem("adminUser"));
  const role = user?.role;

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

  const hideRoutes = [
    "/login",
    "/admin-otp",
    "/admin-forgot",
    "/admin-reset",
  ];

  const isAuthPage = hideRoutes.includes(location.pathname);

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
        .replace("/", "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {/* HEADER + SIDEBAR */}
      {!isAuthPage && (
        <>
          <Header title={title} />
          <Sidebar />
        </>
      )}

      {/* MAIN CONTENT */}
      <div className={!isAuthPage ? "mainContent" : ""}>

        <Routes>

          {/* ================= AUTH ================= */}

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


          {/* ================= DASHBOARD ================= */}

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
            path="/user-control"
            element={
              <AdminProtectedRoute>
                <User />
              </AdminProtectedRoute>
            }
          />




          {/* 🔥 ONLY ADMIN */}


          <Route
            path="/coach-management"
            element={
              <AdminProtectedRoute blockSubadmin={true}>
                <CoachManagementPage />
              </AdminProtectedRoute>
            }
          />
           <Route
            path="/children-management"
            element={
              <AdminProtectedRoute blockSubadmin={true}>
                <Children />
              </AdminProtectedRoute>
            }
          />
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
          <Route
            path="/subscription-management"
            element={
              <AdminProtectedRoute blockSubadmin={true}>
                <SubscriptionManagementPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/revenue-management"
            element={
              <AdminProtectedRoute blockSubadmin={true}>
                <RevenueManagement />
              </AdminProtectedRoute>
            }
          />

        </Routes>
      </div>
    </>
  );
}


// ================= APP =================
function App() {

  return (
    <div className="App">

      <GoogleOAuthProvider clientId="377086841705-i670mebv74mj7kjusc7rle7kvp2hpmse.apps.googleusercontent.com">

        <Router>

          <ToastContainer position="top-center" />

          <Layout />

        </Router>

      </GoogleOAuthProvider>

    </div>
  );
}

export default App;