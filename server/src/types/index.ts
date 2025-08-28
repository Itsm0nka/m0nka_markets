export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specifications: Record<string, string>;
  installmentMonths?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Favorite {
  id: string;
  productId: string;
  product: Product;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
