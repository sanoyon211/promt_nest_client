'use client';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function DashboardHeader({ setIsSidebarOpen }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-foreground/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 text-foreground/60 hover:text-foreground mr-2"
        >
          <Menu size={24} />
        </button>
        
        {/* Optional Dashboard Search */}
        <div className="hidden sm:flex items-center bg-background border border-foreground/10 rounded-full px-4 py-2 ml-2">
          <Search size={18} className="text-foreground/40 mr-2" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none focus:outline-none text-sm text-foreground w-48 lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-foreground/60 hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-foreground/10 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider">{user?.role || 'user'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold border border-accent/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
