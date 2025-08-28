import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingCart, Heart, User, Package, LogOut } from "lucide-react";
import img from "../../assets/img.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import CatalogSidebar from "./CatalogSidebar";
import AuthModal from "./AuthModal";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../../png.png";
import Dark from "../Dark";
import Swiper from './Swiper'

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      navigate(`/?q=${encodeURIComponent(debouncedSearch)}`);
    }
  };

  return (
    <>
      <header className=" top-0 left-0 right-0 z-9999 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <a href="max-w-[1800px">
          {" "}
          <img src={img} alt="" />{" "}
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

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
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
          </form>

          <div className="flex items-center gap-4">
            <Dark />
            <LanguageSwitcher />
            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              aria-label={t("header.orders")}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs hidden sm:block">
                {t("header.orders")}
              </span>
            </Link>
            <Link
              to="/favorites"
              className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              aria-label={t("header.favorites")}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs hidden sm:block">
                {t("header.favorites")}
              </span>
            </Link>
            <Link
              to="/cart"
              className="relative flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              aria-label={t("header.cart")}
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
