'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const renderThemeToggle = () => {
    if (!mounted) return <div className="w-9 h-9 ml-4" />;
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return (
      <button
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground ml-2 md:ml-4"
        aria-label="Toggle Dark Mode"
      >
        {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    );
  };

  return (
    <header className="w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl tracking-tight text-foreground">
          PromtNest
        </Link>
        
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/prompts" className="text-sm font-medium hover:text-primary transition-colors">All Prompts</Link>
            
            {isLoading ? (
              <div className="w-20 h-6 bg-foreground/10 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-medium bg-accent text-white px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
          
          {renderThemeToggle()}

          {/* Mobile menu button */}
          <button className="md:hidden ml-4 opacity-80 hover:opacity-100 p-2" onClick={toggleMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-foreground/10 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <Link href="/" onClick={toggleMenu} className="text-base font-medium hover:text-primary">Home</Link>
            <Link href="/prompts" onClick={toggleMenu} className="text-base font-medium hover:text-primary">All Prompts</Link>
            
            {isLoading ? (
              <div className="w-20 h-6 bg-foreground/10 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link href="/dashboard" onClick={toggleMenu} className="text-base font-medium hover:text-primary">Dashboard</Link>
                <button 
                  onClick={() => { logout(); toggleMenu(); }}
                  className="text-base font-medium text-left hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-4 pt-2 border-t border-foreground/10">
                <Link href="/login" onClick={toggleMenu} className="text-base font-medium hover:text-primary">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={toggleMenu}
                  className="text-center text-base font-medium bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 shadow-lg shadow-accent/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
