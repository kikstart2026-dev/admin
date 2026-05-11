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

import ChildrenProfile from "./Pages/ChildrenProfile/ChildrenProfile";

// ================= CHILD FORM FLOW =================
import ChildrenDetails from "./Pages/FormDetails/ChildrenDetails/ChildrenDetails";
import ChildrenEdit from "./Pages/ChildrenProfileEdit/ChildrenProfileEdit";


import SchoolDetails from "./Pages/FormDetails/SchoolDetails/SchoolDetails";

import WaiverAcceptance from "./Pages/FormDetails/WaiverAcceptance/WaiverAcceptance";

import ProgramDetailss from "./Pages/FormDetails/ProgramDetailss/ProgramDetailss";

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
            path="/contact-control"
            element={
              <AdminProtectedRoute>
                <Contact />
              </AdminProtectedRoute>
            }
          />


          {/* ================= CHILDREN PROFILE ================= */}

          <Route
            path="/children-profile/:id?"
            element={
              <AdminProtectedRoute>
                <ChildrenProfile />
              </AdminProtectedRoute>
            }
          />


          {/* ================= CHILD FORM FLOW ================= */}

          <Route
            path="/children-details"
            element={
              <AdminProtectedRoute>
                <ChildrenDetails />
              </AdminProtectedRoute>
            }
          />

          <Route
  path="/children-edit/:id"
  element={
    <AdminProtectedRoute>
      <ChildrenEdit />
    </AdminProtectedRoute>
  }
/>

          <Route
            path="/Schooldetails"
            element={
              <AdminProtectedRoute>
                <SchoolDetails />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/WaiverAcceptance"
            element={
              <AdminProtectedRoute>
                <WaiverAcceptance />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/ProgramDetailss"
            element={
              <AdminProtectedRoute>
                <ProgramDetailss />
              </AdminProtectedRoute>
            }
          />


          {/* 🔥 ONLY ADMIN */}

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
      </div>
    </>
  );
}


// ================= APP =================
function App() {

  return (
    <div className="App">

      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">

        <Router>

          <ToastContainer position="top-center" />

          <Layout />

        </Router>

      </GoogleOAuthProvider>

    </div>
  );
}

export default App;