import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../hooks/useFavorites";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  onAuthRequired: () => void;
  user?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAuthRequired,
  user,
}) => {
  const { t } = useTranslation();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { items, addToCart } = useCart();

  const handleToggleFavorite = () => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
      toast.error(`${product.title} удалён(а) из избранного`);
    } else {
      addToFavorites(product);
      toast.success(`${product.title} добавлен(а) в избранное`);
    }
  };

  const handleAddToCart = () => {
    const alreadyInCart = items.some((i) => i.product._id === product._id);

    if (alreadyInCart) {
      toast.error(`${product.title} уже в корзине`);
    } else {
      addToCart(product);
      toast.success(`${product.title} добавлен(а) в корзину`);
    }
  };

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const formatPrice = (value: number) => value.toLocaleString("ru-RU");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white flex flex-col justify-around
  dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                {t("product.outOfStock")}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#f9bb04] transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              ({product.reviewCount} {t("product.reviews")})
            </span>
          </div>

          <div className="space-y-1 mb-3">
            {product.discountPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.discountPrice)} {t("common.currency")}
                  </span>
                </div>
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)} {t("common.currency")}
                </div>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)} {t("common.currency")}
              </span>
            )}
            {product.installmentMonths && (
              <div className="text-xs text-green-600">
                {t("common.from")}{" "}
                {formatPrice(
                  Math.round(
                    (product.discountPrice || product.price) /
                      product.installmentMonths
                  )
                )}{" "}
                {t("common.currency")}/мес
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite(product._id)
              ? "bg-red-500 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite(product._id) ? "fill-current" : ""
            }`}
          />
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 bg-[#fde047] text-gray-700 py-2 px-4 rounded-lg hover:bg-[#fbc80a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <ShoppingCart className="h-4 w-4 inline mr-2" />
          {t("product.addToCart")}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
