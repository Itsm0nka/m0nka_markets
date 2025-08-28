import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, removeFromFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <>
        <div className="max-w-container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <Heart className="h-24 w-24 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('favorites.empty', 'No favorites yet')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('favorites.addPrompt', 'Add products to favorites to see them here')}
            </p>
            <Link
              to="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              {t('favorites.continueShopping', 'Continue Shopping')}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('favorites.title', 'Favorites')} ({favorites.length})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav, index) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <Link to={`/product/${fav.product._id}`} className="block mb-4">
                <img
                  src={fav.product.images[0]}
                  alt={fav.product.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </Link>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {fav.product.title}
              </h2>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {(fav.product.discountPrice || fav.product.price).toLocaleString()} {t('common.currency')}
                </span>
                <button
                  onClick={() => removeFromFavorites(fav.productId)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
