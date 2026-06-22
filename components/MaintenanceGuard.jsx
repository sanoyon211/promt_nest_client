'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, LogIn } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MaintenanceGuard({ children }) {
  const { user, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/public`);
        if (res.ok) {
          const data = await res.json();
          setMaintenanceMode(data.maintenanceMode);
        }
      } catch (err) {
        console.error("Failed to check maintenance status", err);
      } finally {
        setChecking(false);
      }
    };
    fetchMaintenanceStatus();
    
    // Poll every 30 seconds to auto-recover if maintenance ends
    const interval = setInterval(fetchMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (checking || authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        {/* Minimal loading state while checking maintenance status */}
      </div>
    );
  }

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isLoginPage = pathname === '/login';

  // If maintenance is OFF, or user is Admin, or they are just trying to login
  if (!maintenanceMode || isAdmin || isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, they are locked out by Maintenance Mode
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-surface border border-border rounded-2xl p-6 md:p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-accent/20 shadow-inner">
          <ShieldAlert size={36} className="text-accent" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4 tracking-tight">Under Maintenance</h1>
        <p className="text-text-secondary text-[15px] leading-relaxed mb-10 max-w-md mx-auto">
          We are currently performing scheduled maintenance to improve PromptNest. The platform will be back online shortly. Thank you for your patience!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-background border border-border rounded-xl text-text-primary font-bold hover:bg-foreground/5 hover:border-primary/30 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </button>
          
          <Link 
            href="/login"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all active:scale-95"
          >
            <LogIn size={18} className="mr-2" />
            Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
