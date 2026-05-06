import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 🔹 Shared
import Header from "./Shared/Header/Header";
import Sidebar from "./Shared/Sidebar/Sidebar";

// 🔹 Pages
import Dashboard from "./Pages/Dashboard/Dashboard";
import HomePage from "./Pages/Home/HomePage";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import RoleManagementPage from "./Pages/RoleManagementPage/RoleManagementPage";
import PermissionManagementPage from "./Pages/PermissionManagementPage/PermissionManagementPage";
// ⚠️ যদি থাকে
// import UserControlPage from "./Pages/UserControl/UserControlPage";

// 🔹 Auth Pages
import AdminLogin from "./Pages/Authentication/AdminLogin/AdminLogin";
import AdminOtpVerify from "./Pages/Authentication/AdminOtpVerify/AdminOtpVerify";
import AdminForgotPass from "./Pages/Authentication/AdminForgotPass/AdminForgotPass";
import AdminResetPass from "./Pages/Authentication/AdminResetPass/AdminResetPass";


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


// ================= 🧱 LAYOUT =================
function Layout() {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/login",
    "/admin-otp",
    "/admin-forgot",
    "/admin-reset",
  ];

  const isAuthPage = hideLayoutRoutes.includes(location.pathname);

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
          .replace("/", "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {/* HEADER */}
      {!isAuthPage && <Header title={title} />}

      {/* SIDEBAR */}
      {!isAuthPage && <Sidebar />}
      

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: !isAuthPage ? "20%" : "0",
          marginTop: !isAuthPage ? "100px" : "0",
          padding: "20px",
        }}
      >
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

          {/* ================= PROTECTED ================= */}

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

          {/* 🔥 ADMIN ONLY */}

          <Route
            path="/role-management"
            element={
              <AdminProtectedRoute blockSubadmin>
                <RoleManagementPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/permission-management"
            element={
              <AdminProtectedRoute blockSubadmin>
                <PermissionManagementPage />
              </AdminProtectedRoute>
            }
          />

          {/* ⚠️ যদি User Control থাকে */}
          {/*
          <Route
            path="/user-control"
            element={
              <AdminProtectedRoute>
                <UserControlPage />
              </AdminProtectedRoute>
            }
          />
          */}

        </Routes>
      </div>
    </>
  );
}


// ================= 🚀 APP =================
function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <Router>
          <ToastContainer
            position="top-center"
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