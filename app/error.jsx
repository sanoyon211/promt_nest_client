'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      
      {/* Subtle background red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none -z-10 dark:mix-blend-lighten"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-[24px] flex items-center justify-center mb-8 relative ring-1 ring-red-500/20 shadow-inner mx-auto rotate-3"
      >
        <div className="absolute inset-0 bg-red-500/20 blur-[20px] rounded-[24px] animate-pulse"></div>
        <AlertTriangle size={40} className="text-red-500 relative z-10 -rotate-3" strokeWidth={2.5} />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight"
      >
        Oops! Something broke.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-lg text-text-secondary font-medium max-w-lg mb-10 mx-auto leading-relaxed"
      >
        We encountered an unexpected error while trying to load this page. Don't worry, our engineering team has been notified.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => reset()}
          className="px-8 py-3.5 bg-text-primary text-background font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg"
        >
          <RefreshCcw size={18} className="mr-2" /> Try Again
        </button>
        <Link 
          href="/"
          className="px-8 py-3.5 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-foreground/5 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        >
          <Home size={18} className="mr-2 text-text-secondary" /> Return Home
        </Link>
      </motion.div>
    </div>
  );
}