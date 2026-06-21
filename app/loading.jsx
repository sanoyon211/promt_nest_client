'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center w-full px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center relative"
      >
        {/* Premium Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -z-10 pointer-events-none"></div>
        
        {/* Floating Spinner Box */}
        <div className="w-16 h-16 bg-surface border border-border rounded-[20px] flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
          <Loader2 size={28} className="text-primary animate-spin relative z-10" strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-black text-text-primary tracking-tight mb-2 flex items-center">
          Loading PromptNest
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="ml-1"
          >
            ...
          </motion.span>
        </h2>
        <p className="text-[14px] text-text-secondary font-medium">Preparing your AI workspace</p>
      </motion.div>
    </div>
  );
}