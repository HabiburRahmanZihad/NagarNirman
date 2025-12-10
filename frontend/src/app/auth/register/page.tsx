'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { isValidEmail } from '@/utils/helpers';
import divisionsData from '@/data/divisionsData.json';
import { getRoleDashboardPath } from '@/hooks/useRoleProtection';
import Lottie from "lottie-react";
import registerAnimation from "@/../public/Register.json";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    division: '',
    district: '',
  });
  const [districts, setDistricts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Get redirect_to from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect_to');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDivision = e.target.value;
    setFormData(prev => ({ ...prev, division: selectedDivision, district: '' }));

    // Update districts based on selected division
    const divisionData = divisionsData.find(d => d.division === selectedDivision);
    if (divisionData) {
      setDistricts(divisionData.districts.map(d => d.name));
    } else {
      setDistricts([]);
    }

    if (errors.division) {
      setErrors(prev => ({ ...prev, division: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.division) {
      newErrors.division = 'Please select your division';
    }

    if (!formData.district) {
      newErrors.district = 'Please select your district';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);

      if (result.success && result.user) {
        // Redirect to requested page or role-specific dashboard
        const destination = redirectTo || getRoleDashboardPath(result.user.role);
        router.push(destination);
      } else {
        setApiError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F3F4F6] px-4 py-12">
  <div className="w-full max-w-3xl">
    
    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
      
      {/* LOTTIE ANIMATION */}
      <div className="w-56 h-60 md:w-96 md:h-96 flex justify-center">
        <Lottie 
          animationData={registerAnimation} 
          loop 
        />
      </div>

      {/* REGISTER CARD */}
      <Card className="w-full md:w-1/2 px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#002E2E] mb-2">Join NagarNirman</h1>
          <p className="text-[#6B7280]">Create your account to get started</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {apiError}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your.email@example.com"
            required
          />

          {/* Division */}
          <div>
            <label className="block text-sm font-medium text-[#002E2E] mb-2">Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleDivisionChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81d586] ${errors.division ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select your division</option>
              {divisionsData.map((division) => (
                <option key={division.division} value={division.division}>
                  {division.division}
                </option>
              ))}
            </select>
            {errors.division && <p className="mt-1 text-sm text-red-500">{errors.division}</p>}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-[#002E2E] mb-2">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={!formData.division}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81d586] disabled:bg-gray-100 ${errors.district ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select your district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#002E2E] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                👁
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#002E2E] mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81d586] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                👁
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#6B7280]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#81d586] hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>

  </div>
</div>

  );
}
