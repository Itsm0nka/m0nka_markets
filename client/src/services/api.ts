import axios from "axios";
import { User, Product, CartItem, Favorite } from "../types";

const API_BASE_URL = "http://localhost:3001";

// ================== BASE API ==================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ================== AUTH TOKEN ==================
let authToken: string | null = localStorage.getItem("token");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// ================== INTERCEPTORS ==================
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "Unknown error";
    return Promise.reject(new Error(message));
  }
);

// ================== SERVICES ==================

// Auth
export const authService = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/api/auth/register", { name, email, password }),
};

// Products
export const productService = {
  getProducts: (params?: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => api.get("/api/products", { params }),
  getProduct: (id: string) => api.get(`/api/products/${id}`),
};

// Cart
export const cartService = {
  getCart: () => api.get("/api/cart"),
  addToCart: (productId: string, quantity: number) =>
    api.post("/api/cart", { productId, quantity }),
  updateQuantity: (itemId: string, quantity: number) =>
    api.patch(`/api/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => api.delete(`/api/cart/${itemId}`),
};

// Favorites
export const favoritesService = {
  getFavorites: () => api.get("/api/favorites"),
  addToFavorites: (productId: string) =>
    api.post("/api/favorites", { productId }),
  removeFromFavorites: (favoriteId: string) =>
    api.delete(`/api/favorites/${favoriteId}`),
};

// Checkout
export const checkoutService = {
  createOrder: (
    cartItems: CartItem[],
    extra?: { address?: string; payment?: string }
  ) => api.post("/api/checkout", { items: cartItems, ...extra }),
};

export default api;
