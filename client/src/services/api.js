import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically handle expired or invalid JWT tokens
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Clear the expired session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Notify AuthContext
      window.dispatchEvent(
        new Event("auth:expired")
      );

      // Redirect protected admin pages to login
      const currentPath = window.location.pathname;

      if (
        currentPath.startsWith("/admin") &&
        currentPath !== "/admin/login"
      ) {
        window.location.assign("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// PUBLIC HOMEPAGE
// =====================================================

export const getHomepageFeatures = async () => {
  const response = await api.get("/homepage/features");

  return response.data;
};

// =====================================================
// ADMIN HOMEPAGE FEATURES
// =====================================================

export const getAdminHomepageFeatures = async () => {
  const response = await api.get("/admin/homepage/features");

  return response.data;
};

export const createHomepageFeature = async (data) => {
  const response = await api.post(
    "/admin/homepage/features",
    data
  );

  return response.data;
};

export const updateHomepageFeature = async (id, data) => {
  const response = await api.put(
    `/admin/homepage/features/${id}`,
    data
  );

  return response.data;
};

export const deleteHomepageFeature = async (id) => {
  const response = await api.delete(
    `/admin/homepage/features/${id}`
  );

  return response.data;
};

export const getAdminDashboardStats = async () => {
  const response = await api.get(
    "/admin/dashboard/stats"
  );

  return response.data;
};

export const getAdminHomepageHero = async () => {
  const response = await api.get(
    "/homepage/admin/hero"
  );

  return response.data;
};

export const getHomepageHero = async () => {
  const response = await api.get(
    "/homepage/hero"
  );

  return response.data;
};

export const updateHomepageHero = async (data) => {
  const response = await api.put(
    "/homepage/admin/hero",
    data
  );

  return response.data;
};

// =====================================================
// HOMEPAGE PROMO BANNER
// =====================================================

export const getHomepagePromo = async () => {
  const response = await api.get(
    "/homepage/promo"
  );

  return response.data;
};

export const getAdminHomepagePromo = async () => {
  const response = await api.get(
    "/homepage/admin/promo"
  );

  return response.data;
};

export const updateHomepagePromo = async (data) => {
  const response = await api.put(
    "/homepage/admin/promo",
    data
  );

  return response.data;
};

// =====================================================
// PUBLIC CATEGORIES
// =====================================================

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
export default api;
