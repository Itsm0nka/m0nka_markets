import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("cart.empty")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t("cart.addSomeProducts")}
          </p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
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
          {items.map((item) => {
            const product = item.product;
            const price = product.price ?? 0;
            const discountPrice = product.discountPrice ?? null;
            const image = product.images?.[0] ?? "/placeholder.png";

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-4">
                  <Link to={`/product/${product._id}`} className="flex-shrink-0">
                    <img
                      src={image}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {product.description}
                    </p>

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
                        {/* Счётчик */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(product._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4 text-black dark:text-white" />
                          </button>
                          <span className="px-4 py-2 min-w-12 text-center text-black dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(product._id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Plus className="h-4 w-4 text-black dark:text-white" />
                          </button>
                        </div>

                        {/* Удаление */}
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {t("common.total")}: {(discountPrice ?? price) * item.quantity}{" "}
                      {t("common.currency")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-32">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("cart.orderSummary")}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>
                  {total.toLocaleString()} {t("common.currency")}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>{t("cart.total")}</span>
                  <span>
                    {total.toLocaleString()} {t("common.currency")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700"
            >
              {t("cart.checkout")}
            </button>
            <Link
              to="/"
              className="w-full mt-3 block text-center text-gray-600 dark:text-gray-400 hover:text-primary-600"
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
