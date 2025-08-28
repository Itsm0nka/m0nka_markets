import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./i18n";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./context/FavoritesContext";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Header />
                      <main className="pt-32">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route
                            path="/product/:id"
                            element={<ProductPage />}
                          />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                          <Route
                            path="/favorites"
                            element={<FavoritesPage />}
                          />
                        </Routes>
                      </main>
                      <Footer />
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          duration: 4000,
                          style: {
                            background: "var(--toast-bg)",
                            color: "var(--toast-color)",
                          },
                        }}
                      />
                    </Suspense>
                  </div>
                </Router>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
