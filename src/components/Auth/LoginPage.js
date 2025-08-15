import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import {
  login,
  checkJwtExistsAndExpired,
  notifyUserInfoChange,
} from "../../services/AuthService";
import logo from "../../images/logo.png";
import { Box } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (checkJwtExistsAndExpired()) {
      navigate("/");
    }
  }, [navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email =
        t("auth.usernameLabel") +
        " " +
        t("vocabulary.fieldRequired").toLowerCase();
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("errors.validationError");
    }

    if (!formData.password) {
      newErrors.password =
        t("auth.passwordLabel") +
        " " +
        t("vocabulary.fieldRequired").toLowerCase();
    } else if (formData.password.length < 6) {
      newErrors.password =
        t("auth.passwordLabel") + " must have at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);

      // Save token and user info
      if (response.token) {
        localStorage.setItem("jwt", JSON.stringify({ token: response.token }));
      }

      if (response.username) {
        localStorage.setItem(
          "user",
          JSON.stringify({ fullName: response.username, email: response.email })
        );
      }

      // Notify other components that user info has changed
      notifyUserInfoChange();

      toast.success(t("auth.loginSuccess"));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || t("auth.loginError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="relative w-full max-w-md">
        {/* Main login card */}
        <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl border-white/20">
          {/* Header */}
          <div className="mb-8 text-center">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              <img
                src={logo}
                alt="10SAT Logo"
                style={{
                  height: "25px",
                  width: "auto",
                }}
              />
            </Box>
            <h1 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              {t("auth.welcomeBack")}
            </h1>
            <p className="text-gray-600">{t("auth.loginTitle")}</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.usernameLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("auth.usernameLabel")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("auth.passwordLabel")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("auth.passwordLabel")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  {t("common.loading")}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  {t("auth.loginButton")}
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
