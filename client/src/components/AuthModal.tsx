import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    reset: resetLogin,
  } = useForm<LoginForm>();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: signupSubmitting },
    reset: resetSignup,
    watch,
  } = useForm<SignupForm>();

  const passwordValue = watch("password");

  // ------------------ HANDLERS ------------------
  const handleLoginFormSubmit = (data: LoginForm) => {
    login(data.email, data.password)
      .then(() => {
        resetLogin();
        onClose();
      })
      .catch(() => {});
  };

  const handleSignupFormSubmit = (data: SignupForm) => {
    if (data.password !== data.confirmPassword) return;

    signup(data.name, data.email, data.password)
      .then(() => {
        resetSignup();
        onClose();
      })
      .catch(() => {
        
      });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetLogin();
    resetSignup();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                {isLogin ? t("auth.login") : t("auth.signup")}
              </h2>
            </div>

            {/* Forms */}
            {isLogin ? (
              <form
                onSubmit={handleLoginSubmit(handleLoginFormSubmit)}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="email-login"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email-login"
                      {...loginRegister("email", {
                        required:
                          t("auth.emailRequired") || "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message:
                            t("auth.invalidEmail") || "Invalid email address",
                        },
                      })}
                      type="email"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password-login"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password-login"
                      {...loginRegister("password", {
                        required:
                          t("auth.passwordRequired") || "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            t("auth.passwordMinLength") ||
                            "Password must be at least 6 characters",
                        },
                      })}
                      type="password"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginSubmitting}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loginSubmitting
                    ? t("common.loading")
                    : t("auth.loginButton")}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSignupSubmit(handleSignupFormSubmit)}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="name-signup"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name-signup"
                      {...signupRegister("name", {
                        required: t("auth.nameRequired") || "Name is required",
                        minLength: {
                          value: 2,
                          message:
                            t("auth.nameMinLength") ||
                            "Name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t("auth.name")}
                      autoComplete="name"
                    />
                  </div>
                  {signupErrors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email-signup"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email-signup"
                      {...signupRegister("email", {
                        required:
                          t("auth.emailRequired") || "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message:
                            t("auth.invalidEmail") || "Invalid email address",
                        },
                      })}
                      type="email"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  {signupErrors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password-signup"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password-signup"
                      {...signupRegister("password", {
                        required:
                          t("auth.passwordRequired") || "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            t("auth.passwordMinLength") ||
                            "Password must be at least 6 characters",
                        },
                      })}
                      type="password"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  {signupErrors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword-signup"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t("auth.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword-signup"
                      {...signupRegister("confirmPassword", {
                        required:
                          t("auth.confirmPasswordRequired") ||
                          "Please confirm your password",
                        validate: (value) =>
                          value === passwordValue ||
                          t("auth.passwordsMustMatch") ||
                          "Passwords do not match",
                      })}
                      type="password"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  {signupErrors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {signupErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={signupSubmitting}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {signupSubmitting
                    ? t("common.loading")
                    : t("auth.signupButton")}
                </button>
              </form>
            )}

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={switchMode}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {isLogin ? t("auth.switchToSignup") : t("auth.switchToLogin")}
              </button>
            </div>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                <strong>Demo:</strong> demo@marketplace.com / demo123
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
