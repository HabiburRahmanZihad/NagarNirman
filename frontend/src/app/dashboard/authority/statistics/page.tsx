'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { FullPageError } from '@/components/common';
import { Lock } from 'lucide-react';

const StatisticsAccessDenied = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      toast.error('Statistics page is only available for NGO and Problem Solvers');
      const timer = setTimeout(() => {
        router.push('/dashboard/authority');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router, user]);

  return (
    <FullPageError
      errorCode={403}
      title="Access Denied"
      message="Statistics page is only available for NGO and Problem Solvers. Redirecting to your dashboard..."
      icon={<Lock className="w-24 h-24 text-red-500" />}
      showHomeButton={false}
      showBackButton={false}
    />
  );
};

export default StatisticsAccessDenied;
