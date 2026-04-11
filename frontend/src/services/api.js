import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
};

export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
};

export const reviewAPI = {
  create: (reviewData) => api.post("/reviews", reviewData),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
