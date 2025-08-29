import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingCart, Heart, User, Package, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import CatalogSidebar from "./CatalogSidebar";
import AuthModal from "./AuthModal";
import LanguageSwitcher from "./LanguageSwitcher";
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
          <img src="https://avatars.mds.yandex.net/get-market-adv/8282799/a464f4ff-1728-4fb5-a29e-188bd607beed/1000x56" alt="" />
        </a>
        <div className="max-w-[1440px] container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
            >
              <svg
                width="146"
                height="40"
                viewBox="0 0 146 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.8659 26.6542C9.54281 26.6542 3.58984 20.7023 3.58984 13.3511C3.58984 5.99987 9.54281 0 16.8659 0C24.1889 0 30.1419 5.99854 30.1419 13.3511C30.1419 20.7037 24.1902 26.6542 16.8659 26.6542Z"
                  fill="#FF4112"
                ></path>
                <path
                  d="M31.8651 20.6433L29.6506 16.949L26.317 17.7153L27.9911 10.6719L23.7136 7.79994L18.5692 14.2942L20.692 5.74623L14.8107 1.80273L0 25.0012H6.78935L14.9647 12.2219L12.7636 21.1031L17.7859 21.992L22.5028 16.0414L20.9243 22.737L31.8651 20.6433Z"
                  fill="#FFDD00"
                ></path>
                <path
                  d="M49.7745 4.95801L51.0609 15.1413L57.3737 4.95801H63.6599V21.7235H57.5635V12.6251L51.9066 21.7235H45.8116L44.6287 12.6091L40.152 21.7235H35.2319L43.487 4.95801H49.7745Z"
                  fill="black"
                ></path>
                <path
                  d="M89.8745 8.1674L90.2835 11.8177C91.5128 9.07365 93.6728 7.86621 96.2975 7.86621V13.0798C94.2463 12.8332 91.4039 13.217 90.3658 14.0953V21.7237H84.2163V8.1674H89.8745Z"
                  fill="black"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M120.679 13.5193C120.98 12.0373 121.936 10.9405 123.632 10.9405C125.327 10.9405 126.065 12.0093 126.092 13.5193H120.679ZM123.658 7.86595C117.835 7.86595 114.447 10.7473 114.447 14.9173C114.447 19.3353 117.618 22.0513 124.479 22.0513C127.649 22.0513 129.371 21.5849 130.929 20.8439V17.5774C129.399 18.0998 127.621 18.537 125.543 18.537C122.536 18.537 121.142 17.7693 120.704 16.1767H131.5C132.703 11.1018 129.423 7.86328 123.656 7.86328H123.657L123.658 7.86595Z"
                  fill="black"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M73.01 19.0076C74.5952 19.0076 75.6333 18.2959 76.2069 17.499V15.8797H74.8129C72.1338 15.8797 71.0956 16.2369 71.0956 17.471C71.0956 18.5411 71.9439 19.0076 73.0087 19.0076H73.01ZM74.1292 7.75684C79.4037 7.75684 82.3563 8.99226 82.3563 12.9984H82.3576V18.4319C82.3576 19.5567 82.3855 20.6548 82.4944 21.725H76.8361C76.6171 21.3132 76.3436 20.5722 76.2892 19.7499C75.1143 21.1506 73.5556 22.1381 70.4398 22.1381C66.9681 22.1381 64.9448 20.5469 64.9448 17.9121C64.9448 14.3711 67.9253 13.3835 74.785 13.3835H76.2069V13.081C76.2069 11.9016 75.3599 11.2699 72.7086 11.2699C70.0574 11.2699 67.6518 12.1215 66.2299 12.7798V9.10287C67.8151 8.52581 70.6309 7.75817 74.1305 7.75817L74.1292 7.75684Z"
                  fill="black"
                ></path>
                <path
                  d="M144.704 11.8721V8.44172H139.237V4.95801H133.088V16.51C133.088 20.2136 135.657 22.0527 140.222 22.0527C142.027 22.0527 143.831 21.7235 144.706 21.3677V18.0479C143.885 18.3771 143.01 18.5423 141.727 18.5423C140.169 18.5423 139.239 17.912 139.239 16.3207V11.8748H144.704V11.8721Z"
                  fill="black"
                ></path>
                <path
                  d="M109.636 8.16718H114.939L109.681 13.8392L116.196 21.7235H108.761L103.951 15.7423V21.7235H97.7993V4.95801H103.951V14.3136L109.636 8.16718Z"
                  fill="black"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M138.125 34.3428C137.015 36.5431 137.371 38.1423 139.22 38.1423C141.069 38.1423 143.005 36.5564 144.087 34.3428C145.197 32.0998 144.799 30.5152 143.006 30.5152C141.214 30.5152 139.207 32.1291 138.125 34.3428ZM142.778 32.2717C143.205 32.2717 143.119 33.1287 142.408 34.3294C141.711 35.4862 140.957 36.3725 140.487 36.3725C140.046 36.3725 140.131 35.5155 140.857 34.3294C141.554 33.158 142.308 32.2717 142.778 32.2717ZM136.502 32.2011C137.441 30.5152 137.64 28.816 136.915 28.816C135.977 28.816 134.368 30.5725 133.002 32.9581C131.65 35.329 131.309 37.0868 132.176 37.0868C132.897 37.0868 134.073 36.0566 135.217 34.3867H133.116L133.941 33.0434H138.139C135.934 37.1001 132.817 40.0001 129.602 40.0001C126.77 40.0001 126.514 36.8576 128.719 32.8008C130.824 28.9293 134.168 25.916 137.142 25.916C138.978 25.916 140.601 27.6725 138.466 32.2011H136.502ZM97.382 36.1419V33.002C97.382 32.1265 97.159 31.5081 96.7142 31.1469C96.2774 30.7857 95.6096 30.6045 94.7095 30.6045C94.1506 30.6045 93.6528 30.6765 93.216 30.8191C92.7898 30.9617 92.4486 31.1096 92.1924 31.2615V32.6742C92.3437 32.5596 92.5429 32.4503 92.7898 32.3463C93.046 32.2317 93.3262 32.1411 93.6289 32.0745C93.9316 31.9985 94.2263 31.9599 94.5104 31.9599C94.918 31.9599 95.2167 32.0412 95.4065 32.2024C95.5964 32.3543 95.6906 32.6262 95.6906 33.0167V33.4165H95.4198C94.1307 33.4165 93.1828 33.6218 92.5761 34.0309C91.9787 34.4307 91.6799 34.9971 91.6799 35.7301C91.6799 36.4631 91.8791 37.0148 92.2774 37.4146C92.6849 37.8051 93.216 37.9997 93.8705 37.9997C94.3723 37.9997 94.748 37.9331 94.9936 37.7998C95.2499 37.6572 95.4583 37.4999 95.6189 37.328H95.6906C95.7092 37.5373 95.7517 37.7278 95.8181 37.8984H97.467C97.4099 37.308 97.382 36.723 97.382 36.1432V36.1419ZM95.6893 34.6279V36.1832C95.5844 36.3352 95.4331 36.4684 95.2339 36.583C95.0348 36.6977 94.7839 36.755 94.4798 36.755C94.1294 36.755 93.8638 36.6643 93.6833 36.4831C93.5027 36.2925 93.4138 36.0446 93.4138 35.7408C93.4138 35.3316 93.5704 35.0464 93.8824 34.8838C94.205 34.7119 94.7268 34.6266 95.4463 34.6266H95.688L95.6893 34.6279ZM98.7614 37.8971V30.7178H100.41L100.453 31.3175H100.538C100.709 31.1456 100.951 30.9843 101.263 30.8324C101.576 30.6805 101.983 30.6045 102.485 30.6045C103.177 30.6045 103.675 30.7711 103.979 31.1043C104.283 31.4281 104.434 31.9465 104.434 32.6595V37.8984H102.742V32.8315C102.742 32.2984 102.452 32.0318 101.875 32.0318C101.572 32.0318 101.296 32.1038 101.05 32.2464C100.814 32.389 100.615 32.5556 100.453 32.7462V37.8984H98.76L98.7614 37.8971ZM106.325 37.0841C106.828 37.7212 107.477 38.041 108.272 38.041C109.068 38.041 109.722 37.6839 110.177 36.9709L110.262 37.8984H111.826V27.9791H110.135V31.5614C109.698 30.9044 109.102 30.5765 108.343 30.5765C107.528 30.5765 106.86 30.9097 106.338 31.576C105.826 32.2331 105.571 33.1606 105.571 34.3587C105.571 35.5569 105.822 36.4471 106.325 37.0855V37.0841ZM107.676 32.5023C107.923 32.1118 108.288 31.9172 108.771 31.9172C109.227 31.9172 109.568 32.1078 109.795 32.4876C110.023 32.8688 110.136 33.4725 110.136 34.3001C110.136 35.1277 110.013 35.7461 109.766 36.1272C109.528 36.5084 109.174 36.699 108.7 36.699C108.226 36.699 107.889 36.5137 107.662 36.1419C107.435 35.7608 107.32 35.1664 107.32 34.3574C107.32 33.5485 107.439 32.8914 107.676 32.5023ZM117.7 37.8544C118.098 37.7305 118.42 37.5826 118.666 37.412V36.0273C118.401 36.2085 118.065 36.3658 117.656 36.4991C117.258 36.6323 116.85 36.699 116.433 36.699C115.817 36.699 115.376 36.5511 115.111 36.2565C114.845 35.962 114.694 35.5142 114.655 34.9145H118.736V34.0149C118.736 33.178 118.622 32.5116 118.395 32.0172C118.168 31.5121 117.846 31.1469 117.429 30.9177C117.012 30.6898 116.519 30.5752 115.95 30.5752C115.267 30.5752 114.699 30.7364 114.244 31.0603C113.798 31.3841 113.462 31.8306 113.235 32.4023C113.017 32.9634 112.908 33.6058 112.908 34.3294C112.908 35.5755 113.202 36.5084 113.79 37.1268C114.378 37.7358 115.212 38.041 116.292 38.041C116.833 38.041 117.301 37.9797 117.7 37.8558V37.8544ZM114.657 33.6577C114.705 32.4969 115.127 31.9159 115.922 31.9159C116.339 31.9159 116.623 32.0731 116.776 32.3877C116.936 32.6915 117.017 33.0687 117.017 33.5151V33.6577H114.657ZM120.914 37.8971H119.193L121.439 34.1575L119.278 30.7178H121.183L122.548 32.8874L123.771 30.7178H125.463L123.444 34.2002L125.775 37.8971H123.87L122.349 35.4702L120.912 37.8971H120.914ZM87.4568 35.0571L84.2148 27.9777H86.0071L88.5375 33.5151C88.6982 33.867 88.8269 34.1668 88.9212 34.4147C89.0154 34.6533 89.0818 34.9052 89.1203 35.1717C89.1588 35.4382 89.1774 35.7861 89.1774 36.2139V37.8984H87.4568V35.0584V35.0571ZM90.6564 27.9457H92.4048L90.3006 32.7422H88.5521L90.6564 27.9457Z"
                  fill="black"
                ></path>
              </svg>
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
