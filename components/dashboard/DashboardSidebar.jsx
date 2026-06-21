'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  User, Bookmark, Copy, 
  PenTool, PlusCircle, DollarSign, 
  Users, Settings, BarChart2,
  X, Sparkles, LogOut, Star, ShieldAlert, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = {
  user: [
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
    { label: 'My Prompts', href: '/dashboard/prompts', icon: PenTool },
    { label: 'Create Prompt', href: '/dashboard/add-prompt', icon: PlusCircle },
    { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
    { label: 'Copied Prompts', href: '/dashboard/copied', icon: Copy },
    { label: 'My Reviews', href: '/dashboard/reviews', icon: Star },
  ],
  creator: [
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
    { label: 'My Prompts', href: '/dashboard/prompts', icon: PenTool },
    { label: 'Create Prompt', href: '/dashboard/add-prompt', icon: PlusCircle },
    { label: 'Analytics', href: '/dashboard/creator', icon: BarChart2 },
  ],
  admin: [
    { label: 'My Profile', href: '/dashboard/profile', icon: User }, // ✅ Profile link added here
    { label: 'Platform Analytics', href: '/dashboard/admin/analytics', icon: BarChart2 },
    { label: 'All Payments', href: '/dashboard/admin/payments', icon: CreditCard },
    { label: 'Prompt Moderation', href: '/dashboard/admin/prompts', icon: PenTool },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { label: 'Reported Content', href: '/dashboard/admin/reported', icon: ShieldAlert },
    { label: 'System Settings', href: '/dashboard/settings', icon: Settings },
  ]
};

export default function DashboardSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Default to user if no role is found, and ensure lowercase matching
  const role = user?.role?.toLowerCase() || 'user';
  const links = NAV_LINKS[role] || NAV_LINKS.user;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-surface border-r border-border/60 w-64 pt-6 pb-6 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
      
      {/* Brand */}
      <div className="px-6 mb-8 flex justify-between items-center relative">
        <Link href="/" className="flex items-center text-2xl font-black group relative z-10">
          <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Sparkles className="w-6 h-6 mr-2 text-accent group-hover:scale-110 transition-transform duration-300" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tight pb-1">
            PromptNest
          </span>
        </Link>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-foreground/5 hover:text-text-primary transition-colors focus:outline-none"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
        <p className="px-3 text-[10px] font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-4 mt-2">
          {role} Menu
        </p>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={`flex items-center px-3 py-3 rounded-xl font-bold transition-all duration-300 group relative ${
                isActive 
                  ? 'text-primary bg-gradient-to-r from-primary/10 to-transparent' 
                  : 'text-text-secondary hover:bg-foreground/5 hover:text-text-primary'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div 
                  layoutId="activeSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
              
              <Icon 
                size={20} 
                className={`mr-3 transition-transform duration-300 ${isActive ? 'text-primary' : 'text-text-secondary/70 group-hover:text-primary group-hover:scale-110'}`} 
              />
              <span className={`transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 mt-auto border-t border-border/60 pt-4">
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all duration-300 group active:scale-95"
        >
          <LogOut size={20} className="mr-3 text-red-500/70 group-hover:text-red-500 group-hover:-translate-x-1 transition-all duration-300" />
          Sign Out
        </button>
      </div>

      {/* Internal Style for Scrollbar Hiding */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Animated Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 z-[70] w-64 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}