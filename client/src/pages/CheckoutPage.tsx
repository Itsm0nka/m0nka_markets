import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkoutService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await checkoutService.createOrder(items);
      setOrderId(response.data.data.orderId);
      setOrderCompleted(true);
      clearCart();
      toast.success(t('checkout.orderPlaced'));
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderCompleted) {
    navigate('/cart');
    return null;
  }

  if (orderCompleted) {
    return (
      <>
        <Helmet>
          <title>{t('checkout.orderPlaced')}</title>
        </Helmet>
        <div className="max-w-container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-green-500 mb-6"
            >
              <CheckCircle className="h-24 w-24 mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('checkout.orderPlaced')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('checkout.thankYou')}</p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID: <span className="font-mono font-medium text-gray-900 dark:text-white">{orderId}</span>
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to home page in a few seconds...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('checkout.title')} - MarketPlace</title>
      </Helmet>
      <div className="max-w-container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('checkout.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Items ({itemCount})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.product.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString()} {t('common.currency')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-32">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>
                    {total.toLocaleString()} {t('common.currency')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>
                    {Math.round(total * 0.12).toLocaleString()} {t('common.currency')}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>{t('cart.total')}</span>
                    <span>
                      {Math.round(total * 1.12).toLocaleString()} {t('common.currency')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing...
                  </>
                ) : (
                  t('checkout.placeOrder')
                )}
              </button>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                By placing this order, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
