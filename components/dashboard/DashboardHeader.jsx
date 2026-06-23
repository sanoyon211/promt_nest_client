'use client';
import Image from 'next/image';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

export default function DashboardHeader({ setIsSidebarOpen }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      
      {/* Left Area: Mobile Controls & Dashboard Search */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:bg-foreground/5 hover:text-text-primary transition-colors focus:outline-none"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
        
        {/* Sleek Command Center Search */}
        <div className="hidden sm:flex items-center bg-background border border-border rounded-xl px-4 py-2.5 transition-all duration-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 w-60 lg:w-72">
          <Search size={18} className="text-text-secondary/60 mr-2.5 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search workspace..." 
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-text-primary placeholder:text-text-secondary/40 w-full"
          />
        </div>
      </div>

      {/* Right Area: Actions & Identity Metadata */}
      <div className="flex items-center space-x-4">
        
        {/* Notification Hub Trigger */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:bg-foreground/5 hover:text-text-primary transition-all focus:outline-none"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full ring-2 ring-surface animate-pulse"></span>
        </motion.button>
        
        {/* Identity Context Segment */}
        <div className="flex items-center space-x-3.5 border-l border-border pl-4 h-8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-none truncate max-w-[120px]">
              {user?.name || 'User Member'}
            </p>
            <span className="inline-block text-[9px] font-black text-primary uppercase tracking-wider mt-1.5 bg-primary/10 px-1.5 py-0.5 rounded">
              {user?.role || 'User'}
            </span>
          </div>

          {/* User Display Picture Profile Link */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-black border border-primary/20 overflow-hidden shadow-inner flex-shrink-0">
            {(user?.photo || user?.photoURL) ? (
              <Image 
                src={user.photo || user.photoURL} 
                alt={user?.name || 'User Profile Image'} 
                width={40}
                height={40}
                className="w-full h-full object-cover" 
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
