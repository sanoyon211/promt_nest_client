'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  User, Bookmark, Copy, 
  PenTool, PlusCircle, DollarSign, 
  Users, Settings, BarChart2,
  X, Sparkles, LogOut, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = {
  user: [
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
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
    { label: 'Overview', href: '/dashboard', icon: BarChart2 },
    { label: 'Prompt Moderation', href: '/dashboard/admin/prompts', icon: PenTool },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { label: 'System Settings', href: '/dashboard/settings', icon: Settings },
  ]
};

export default function DashboardSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Default to user if no role is found
  const role = user?.role || 'user';
  const links = NAV_LINKS[role] || NAV_LINKS.user;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-surface border-r border-foreground/10 w-64 pt-6 pb-4">
      {/* Brand */}
      <div className="px-6 mb-8 flex justify-between items-center">
        <Link href="/" className="flex items-center text-2xl font-black group">
          <Sparkles className="w-6 h-6 mr-2 text-accent group-hover:scale-110 transition-transform" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            PromtNest
          </span>
        </Link>
        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="md:hidden text-foreground/50 hover:text-foreground">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-bold text-foreground/40 uppercase tracking-wider mb-4 mt-4">
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
              className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <Icon size={20} className="mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 mt-auto border-t border-foreground/10 pt-4">
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </button>
      </div>
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
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
