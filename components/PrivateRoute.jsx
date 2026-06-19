'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // CRUCIAL: Do not redirect if we are still verifying the session via the HttpOnly cookie
    if (!isLoading && !user) {
      router.replace(`/login?callbackUrl=${pathname}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
        <p className="text-foreground/60 font-bold animate-pulse">Verifying Secure Session...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will cleanly redirect in useEffect
  }

  return <>{children}</>;
}
