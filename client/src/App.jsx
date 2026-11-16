import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import HomepageHero from "./pages/admin/HomepageHero";
import HomepagePromo from "./pages/admin/HomepagePromo";
import Categories from "./pages/admin/Categories";
import FeatureManagement from "./pages/admin/Homepage/FeatureManagement"; 
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
          
          <Route path="categories" element={<Categories />} />
          <Route path="/admin/homepage/features"  element={<FeatureManagement />}
/>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
