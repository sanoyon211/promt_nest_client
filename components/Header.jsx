'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, ChevronRight, Sparkles } from 'lucide-react';

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    if (path === '/dashboard') return pathname.startsWith('/dashboard');
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Library', href: '/all-prompts' },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', href: '/dashboard' });
  }

  const renderThemeToggle = () => {
    if (!mounted) return <div className="w-9 h-9 ml-2" />;
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return (
      <button
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-text-secondary hover:text-text-primary flex items-center justify-center"
        aria-label="Toggle Dark Mode"
      >
        {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  };

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="var(--color-primary)" offset="0%" />
                <stop stopColor="var(--color-accent)" offset="100%" />
              </linearGradient>
            </svg>
            <Sparkles size={20} strokeWidth={2.5} stroke="url(#logo-gradient)" />
          </div>
          <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            PromtNest
          </span>
        </Link>
        
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            
            {/* Grouped Nav Links */}
            <div className="flex items-center space-x-1 mr-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive(link.href) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-foreground/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-border mx-2"></div>

            {isLoading ? (
              <div className="w-32 h-8 bg-foreground/5 animate-pulse rounded-full ml-4"></div>
            ) : user ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3 bg-surface border border-border px-3 py-1.5 rounded-full shadow-sm">
                  {user.photoURL ? (
                    <Image 
                      src={user.photoURL} 
                      alt={user.displayName || "Profile"} 
                      width={28} 
                      height={28} 
                      className="rounded-full object-cover ring-2 ring-primary/20" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-text-primary max-w-[100px] truncate hidden lg:block">
                    {user.displayName || "User"}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent rounded-lg hover:bg-accent/5 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="group flex items-center gap-1 text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Get Started
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </nav>
          
          <div className="ml-4 flex items-center border-l border-border pl-4">
            {renderThemeToggle()}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden ml-4 p-2 text-text-secondary hover:text-text-primary bg-foreground/5 rounded-full transition-colors" onClick={toggleMenu}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-surface border-b border-border shadow-2xl transition-all duration-300 origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        <div className="px-4 py-6 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={toggleMenu} 
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-foreground/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-px bg-border my-2 mx-4"></div>

          {isLoading ? (
            <div className="w-32 h-8 bg-foreground/5 animate-pulse rounded-full ml-4"></div>
          ) : user ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 px-4 py-2">
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt={user.displayName || "Profile"} 
                    width={32} 
                    height={32} 
                    className="rounded-full object-cover ring-2 ring-primary/20" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-base font-semibold text-text-primary">
                  {user.displayName || "User"}
                </span>
              </div>
              <button 
                onClick={() => { logout(); toggleMenu(); }}
                className="px-4 py-3 text-left rounded-xl text-base font-medium text-accent hover:bg-accent/5 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-2 px-2">
              <Link href="/login" onClick={toggleMenu} className="w-full py-3 text-center rounded-xl text-base font-medium text-text-primary border border-border hover:bg-foreground/5 transition-colors">
                Log in
              </Link>
              <Link 
                href="/register" 
                onClick={toggleMenu}
                className="w-full py-3 text-center rounded-xl text-base font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
