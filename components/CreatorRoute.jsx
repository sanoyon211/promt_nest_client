'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function CreatorRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'Creator' && user.role !== 'Admin') {
        router.replace('/'); // Redirect unauthorized users to home
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'Creator' && user.role !== 'Admin')) {
    return null;
  }

  return <>{children}</>;
}
