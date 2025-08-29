import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ShoppingCart,
  Heart,
  User,
  Package,
  LogOut,
} from "lucide-react";
import img from "../../assets/img.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import CatalogSidebar from "./CatalogSidebar";
import AuthModal from "./AuthModal";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../../png.png";
import Dark from "../Dark";
import Swiper from "./Swiper";
import { Axios } from "../middlewares/Axios"; 

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 🔥 подсказки теперь из API
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Если URL содержит ?q=..., записываем в инпут
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
  }, [location.search]);

  // загрузка подсказок с API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.trim().length > 0) {
        try {
          const res = await Axios.get("/products", {
            params: { q: debouncedSearch, limit: 5 },
          });
          setSuggestions(res.data?.data || []);
        } catch (err) {
          console.error("Ошибка загрузки подсказок:", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]); // закрываем подсказки
    }
  };

  const handleSuggestionClick = (value: string) => {
    setSearchQuery(value);
    navigate(`/?q=${encodeURIComponent(value)}`);
    setSuggestions([]);
  };

  return (
    <>
      <header className="top-0 left-0 right-0 z-9999 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <a href="max-w-[1800px">
          <img src={img} alt="" />
        </a>
        <div className="max-w-[1440px] container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
            >
              <img src={logo} alt="Logo" />
            </Link>
            <button
              onClick={() => setIsCatalogOpen(true)}
              className="font-[500] bg-yellow-300 duration-300 text-[17px] flex items-center px-5 gap-2 py-2 rounded-[5px] cursor-pointer"
              aria-label={t("header.catalog")}
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline">{t("header.catalog")}</span>
            </button>
          </div>

          {/* --- SEARCH WITH AUTOCOMPLETE --- */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <div className="flex border-2 h-11 border-yellow-300 rounded-[7px] overflow-hidden">
              <input
                type="text"
                placeholder={t("header.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 outline-none border-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="bg-yellow-300 px-6 font-medium hover:bg-yellow-400 active:scale-95 transition"
              >
                {t("Topish")}
              </button>
            </div>

            {/* --- DROPDOWN подсказки --- */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
                >
                  {suggestions.map((product) => (
                    <li
                      key={product._id}
                      onClick={() => handleSuggestionClick(product.title)}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {/* картинка */}
                      <img
                         src={product.images?.[0]}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      {/* инфо */}
                      <div className="flex flex-col">
                        <span className="font-medium">{product.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.price} $
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </form>

          {/* --- ICONS --- */}
          <div className="flex items-center gap-4">
            <Dark />
            <LanguageSwitcher />
            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <Package className="h-6 w-6" />
              <span className="text-xs hidden sm:block">
                {t("header.orders")}
              </span>
            </Link>
            <Link
              to="/favorites"
              className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs hidden sm:block">
                {t("header.favorites")}
              </span>
            </Link>
            <Link
              to="/cart"
              className="relative flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs hidden sm:block">
                {t("header.cart")}
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* --- USER MENU --- */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                    aria-label={t("header.profile")}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-xs hidden sm:block">
                      {t("header.profile")}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[12rem]"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("header.logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  aria-label={t("header.login")}
                >
                  <User className="h-6 w-6" />
                  <span className="text-xs hidden sm:block">
                    {t("header.login")}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- CATEGORIES --- */}
        <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="max-w-container mx-auto px-4 py-3">
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                "electronics",
                "clothing",
                "home",
                "sports",
                "books",
                "beauty",
              ].map((category) => (
                <Link
                  key={category}
                  to={`/?category=${category}`}
                  className="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                >
                  {t(`categories.${category}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      <AnimatePresence>
        {isCatalogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCatalogOpen(false)}
          />
        )}
      </AnimatePresence>

      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* MODALS */}
      <CatalogSidebar
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <Swiper />
    </>
  );
};

export default Header;
0