import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight } from 'lucide-react';

interface CatalogSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    key: 'electronics',
    subcategories: ['smartphones', 'laptops', 'tablets', 'accessories']
  },
  {
    key: 'clothing',
    subcategories: ['men', 'women', 'children', 'shoes']
  },
  {
    key: 'home',
    subcategories: ['furniture', 'kitchen', 'garden', 'decor']
  },
  {
    key: 'sports',
    subcategories: ['fitness', 'outdoor', 'team-sports', 'water-sports']
  },
  {
    key: 'books',
    subcategories: ['fiction', 'non-fiction', 'educational', 'children']
  },
  {
    key: 'beauty',
    subcategories: ['skincare', 'makeup', 'haircare', 'fragrances']
  },
];

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('header.catalog')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={t('common.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {categories.map((category) => (
              <div key={category.key} className="mb-4">
                <button className="w-full flex items-center justify-between p-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="font-medium">
                    {t(`categories.${category.key}`)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <div className="ml-4 mt-2 space-y-1">
                  {category.subcategories.map((sub) => (
                    <a
                      key={sub}
                      href={`/?category=${category.key}&subcategory=${sub}`}
                      onClick={onClose}
                      className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {t(`subcategories.${sub}`, sub.charAt(0).toUpperCase() + sub.slice(1))}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatalogSidebar;
