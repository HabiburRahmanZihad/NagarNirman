"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { isValidEmail } from "@/utils/helpers";
import { getRoleDashboardPath } from "@/hooks/useRoleProtection";
import Lottie from "lottie-react";
import loginAnimation from "../../../../public/assets/lottie/login.json";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Get redirect_to from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect_to");
    if (redirectParam) {
      setRedirectTo(decodeURIComponent(redirectParam));
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = redirectTo || getRoleDashboardPath(user.role);
      router.push(destination);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };


  // FORM VALIDATION
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // FORM SUBMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await login(formData);

      if (result.success && result.user) {
        // Redirect to requested page or role-specific dashboard
        const destination =
          redirectTo || getRoleDashboardPath(result.user.role);
        router.push(destination);
      } else {
        setApiError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F3F4F6] px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* LOTTIE ANIMATION */}
          <div className="w-64 md:w-6xl flex justify-center">
            <Lottie animationData={loginAnimation} loop />
          </div>

          {/* LOGIN CARD */}
          <Card className="w-full md:w-5xl px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#002E2E] mb-2">
                Welcome Back
              </h1>
              <p className="text-[#6B7280]">
                Login to your NagarNirman account
              </p>
            </div>

            {/* DEMO CREDENTIAL BUTTONS */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 text-center">
                Quick Login — Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "User", email: "dhaka@example.com", password: "Pa$$w0rd!", color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" },
                  { label: "Problem Solver", email: "gazipur.solver@nagar.com", password: "Pa$$w0rd!", color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200" },
                  { label: "Authority", email: "faridpur.authority@nagar.com", password: "Pa$$w0rd!", color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200" },
                  { label: "Super Admin", email: "habib@zihad.com", password: "Pa$$w0rd!", color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" },
                ].map(({ label, email, password, color }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setFormData({ email, password });
                      setErrors({});
                      setApiError("");
                    }}
                    className={`px-3 py-2 text-xs font-medium border rounded-lg transition-colors cursor-pointer ${color}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-">
              {/* EMAIL FIELD */}
              {/* EMAIL FIELD */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#002E2E] mb-2"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  suppressHydrationWarning
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg
      ${errors.email ? "border-red-500" : ""}
      focus:outline-none focus:ring-0 focus:border-[#002E2E]`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#002E2E] mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    suppressHydrationWarning
                    className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg
                  ${errors.password ? "border-red-500" : ""}
                  focus:outline-none focus:ring-0 focus:border-[#002E2E]`}
                  />

                  {/* SHOW/HIDE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Login
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#6B7280]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#004540] hover:underline font-semibold"
                >
                  Register here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
