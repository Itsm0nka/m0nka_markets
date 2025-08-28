import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCard";
import { Axios } from "../middlewares/Axios";

export const BASE_API_URL = "http://localhost:3001/api";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();

  const [products, setProducts] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const requests = items.map((item) =>
          Axios.get(`/products/${item.product._id}`)
        );

        const responses = await Promise.all(requests);

        const productMap: Record<string, any> = {};
        responses.forEach((res, idx) => {
          productMap[items[idx].product._id] = res.data;
        });

        setProducts(productMap);
      } catch (err) {
        console.error("Ошибка при загрузке продуктов:", err);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    }
  }, [items]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-gray-400 mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("cart.empty")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some products to your cart to get started
          </p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("cart.title")} ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const product = products[item.product._id] || item.product;

            const price = product.price ?? 0;
            const discountPrice = product.discountPrice ?? null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors block truncate"
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              {discountPrice.toLocaleString()} {t("common.currency")}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {price.toLocaleString()} {t("common.currency")}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {price.toLocaleString()} {t("common.currency")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 text-white dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {t("common.total")}:{" "}
                      {((discountPrice ?? price) * item.quantity).toLocaleString()}{" "}
                      {t("common.currency")}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-32">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>
                  {(total ?? 0).toLocaleString()} {t("common.currency")}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>{t("cart.total")}</span>
                  <span>
                    {(total ?? 0).toLocaleString()} {t("common.currency")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {t("cart.checkout")}
            </button>

            <Link
              to="/"
              className="w-full mt-3 text-center text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors block py-2"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
