import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";
import { Axios } from "../middlewares/Axios";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;

  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string> = {};
        if (searchQuery) params.q = searchQuery;
        if (category) params.category = category;

        const response = await Axios.get("/products", { params });
        setProducts(response.data.data || []);
      } catch (err: any) {
        setError(err.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };

    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);

    debounceTimer.current = window.setTimeout(() => {
      loadProducts();
    }, 500);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, category]);

  console.log(products);
  

  return (
    <>
      <Helmet>
        <title>
          YandexMarket - {t("common.search")}{" "}
          {searchQuery ? `"${searchQuery}"` : t("categories.all", "All Products")}
        </title>
      </Helmet>

      <div className="max-w-container mx-auto px-4 py-8">
        {searchQuery && <h1>{t("search.results", `Search results for "${searchQuery}"`)}</h1>}
        {category && !searchQuery && <h1>{t(`categories.${category}`, category)}</h1>}

        {loading && <p>{t("common.loading", "Loading...")}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))
            ) : (
              <p>{t("common.noResults", "No products found")}</p>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default HomePage;
