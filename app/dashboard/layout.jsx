'use client';
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PrivateRoute from '@/components/PrivateRoute';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background flex text-foreground font-sans w-full">
        <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col md:ml-64 w-full min-w-0">
          <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
