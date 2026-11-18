import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import HomepageHero from "./pages/admin/HomepageHero";
import HomepagePromo from "./pages/admin/HomepagePromo";
import Categories from "./pages/admin/Categories";
import AdminProducts from "./pages/admin/Products";
import FeatureManagement from "./pages/admin/Homepage/FeatureManagement"; 
const App = () => {
  return (
    <Routes>
      {/* =========================
          Customer Website
      ========================== */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
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
           <Route path="homepage/features" element={<FeatureManagement />} />
          <Route path="categories" element={<Categories />} />
                   <Route path="products" element={<AdminProducts />} />
          
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
