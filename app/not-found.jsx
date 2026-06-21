'use client';

import Link from 'next/link';
import { SearchX, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      
      {/* Background 404 text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[12rem] md:text-[18rem] font-black text-text-primary/5 leading-none absolute select-none pointer-events-none -z-10 tracking-tighter"
      >
        404
      </motion.div>
      
      {/* Search Icon with Glow */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
        className="w-24 h-24 bg-surface border border-border rounded-[24px] flex items-center justify-center mb-8 relative shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none"
      >
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
        <SearchX size={48} className="text-primary relative z-10" strokeWidth={1.5} />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight"
      >
        Page Not Found
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-lg text-text-secondary max-w-lg mb-10 font-medium leading-relaxed"
      >
        Oops! The page or prompt you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link 
          href="/"
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}