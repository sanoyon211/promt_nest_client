'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // CRUCIAL: Do not redirect if we are still verifying the session via the HttpOnly cookie
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[75vh] w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center relative"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -z-10 pointer-events-none"></div>
          
          {/* Animated Shield Icon */}
          <div className="w-16 h-16 bg-surface border border-border rounded-[20px] flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            <Shield size={32} className="text-primary relative z-10" strokeWidth={2} />
          </div>

          <h2 className="text-xl font-black text-text-primary tracking-tight mb-2">Authenticating</h2>
          <div className="flex items-center text-text-secondary">
            <Loader2 size={14} className="animate-spin mr-2 text-primary" />
            <p className="text-[14px] font-medium tracking-wide">Verifying Secure Session...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Will cleanly redirect in useEffect
  }

  return <>{children}</>;
}