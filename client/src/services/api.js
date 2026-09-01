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

export default api;