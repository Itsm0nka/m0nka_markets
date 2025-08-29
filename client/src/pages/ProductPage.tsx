import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Tag,
} from "lucide-react";
import { productService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../hooks/useFavorites";
import LoadingSpinner from "../components/LoadingSpinner";
import AuthModal from "../components/AuthModal";

interface Product {
  _id: string; // ✅ исправил на _id
  title: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  installmentMonths?: number;
  inStock: boolean;
  specifications?: Record<string, string>;
}

export const BASE_API_URL = "http://localhost:3000";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProduct(productId);
      const data = response.data?.data;
      if (data) {
        setProduct(data);
        setSelectedImageIndex(0);
      } else {
        setError("No product data received");
      }
    } catch (err: any) {
      setError(err?.message || "Product not found");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id, loadProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!product) return;

    try {
      addToCart(product); // ✅ передаем целый объект product
      alert(t("product.addedToCart", "Added to cart!"));
    } catch {
      alert(t("common.errorOccurred", "An error occurred."));
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!product) return;

    try {
      if (isFavorite(product._id)) {
        removeFromFavorites(product._id); // ✅ удаляем по _id
        alert(t("product.removedFromFavorites", "Removed from favorites."));
      } else {
        addToFavorites(product); // ✅ добавляем весь product
        alert(t("product.addedToFavorites", "Added to favorites."));
      }
    } catch {
      alert(t("common.errorOccurred", "An error occurred."));
    }
  };

  const nextImage = () =>
    product &&
    selectedImageIndex < product.images.length - 1 &&
    setSelectedImageIndex((i) => i + 1);

  const prevImage = () =>
    selectedImageIndex > 0 && setSelectedImageIndex((i) => i - 1);

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-8 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4 text-6xl">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {t("common.error")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || t("product.notFound", "Product not found.")}
        </p>
        <Link
          to="/"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t("common.backToHome", "Back to Home")}
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const currentPrice = product.discountPrice || product.price;

  return (
    <>
      <div className="max-w-container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left column: image */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                key={selectedImageIndex}
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="object-contain w-full h-full"
              />
              {selectedImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full p-2 shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {selectedImageIndex < product.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full p-2 shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* thumbnails */}
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-md overflow-hidden border ${
                    idx === selectedImageIndex
                      ? "border-primary-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right column: info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {product.rating}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount} {t("product.reviews")})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary-600">
                {currentPrice.toLocaleString()} {t("common.currency")}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-lg line-through text-gray-400">
                    {product.price.toLocaleString()} {t("common.currency")}
                  </span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Tag className="w-4 h-4" />-{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-900 dark:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-gray-900 dark:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-[#fce000] text-gray-800 px-6 py-3 rounded-lg hover:bg-[#fcdb02] flex items-center gap-2 shadow"
              >
                <ShoppingCart className="w-5 h-5" />
                {t("product.addToCart")}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-lg border ${
                  isFavorite(product._id)
                    ? " text-red-600 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <Heart
                  className={`w-5 h-5 cursor-pointer ${
                    isFavorite(product._id)
                      ? "text-red-600 dark:text-red-500"
                      : "text-gray-400 dark:text-gray-300 hover:text-red-500"
                  }`}
                  fill={isFavorite(product._id) ? "currentColor" : "none"}
                  onClick={() => toggleFavorite(product._id)}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default ProductPage;
