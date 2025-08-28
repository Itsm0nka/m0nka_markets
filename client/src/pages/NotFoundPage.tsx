import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Page Not Found - MarketPlace</title>
      </Helmet>

      <div className="max-w-container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
            <Link
              to="/?q="
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
