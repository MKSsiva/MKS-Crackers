import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomepageFeatures from "./pages/admin/HomepageFeatures";
import HomepageHero from "./pages/admin/HomepageHero";

const App = () => {
  return (
    <Routes>
      {/* =========================
          Customer Website
      ========================== */}
      <Route path="/" element={<Home />} />

      {/* =========================
          Admin Login
      ========================== */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =========================
          Protected Admin Routes
      ========================== */}
      <Route
        element={<ProtectedRoute adminOnly={true} />}
      >
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />
          {/* Homepagehero */}
          <Route
            path="homepage/hero"
            element={<HomepageHero />}
          />
          {/* Homepage */}
          <Route
            path="homepage/features"
            element={<HomepageFeatures />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;