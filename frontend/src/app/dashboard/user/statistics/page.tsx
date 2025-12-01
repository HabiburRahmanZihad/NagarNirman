'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

const StatisticsAccessDenied = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      toast.error('Statistics page is only available for Problem Solvers');
      const timer = setTimeout(() => {
        router.push('/dashboard/user');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router, user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-red-50/30 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Statistics page is only available for Problem Solvers.
            Redirecting to your dashboard...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsAccessDenied;
