'use client';
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PrivateRoute from '@/components/PrivateRoute';
import { motion } from 'framer-motion';

export default function DashboardLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background flex text-text-primary font-sans w-full selection:bg-primary/20 selection:text-primary relative overflow-hidden">
        
        {/* Subtle Workspace Dot Pattern */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }}
        ></div>

        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col md:ml-64 w-full min-w-0 relative z-10 transition-all duration-300">
          <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Page Transition Wrapper & Ultra-wide container */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}