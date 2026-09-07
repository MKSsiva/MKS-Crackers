import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomepageFeatures from "./pages/admin/HomepageFeatures";
import HomepageHero from "./pages/admin/HomepageHero";
import HomepagePromo from "./pages/admin/HomepagePromo";
import Categories from "./pages/admin/Categories";
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
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* =========================
          Protected Admin Routes
      ========================== */}
      <Route element={<ProtectedRoute adminOnly={true} />} >
        <Route path="/admin" element={<AdminLayout />} >
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />
          {/* Homepagehero */}
          <Route path="homepage/hero" element={<HomepageHero />} />
          <Route path="homepage/promo" element={<HomepagePromo />} />
          {/* Homepage */}
          <Route path="homepage/features" element={<HomepageFeatures />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;