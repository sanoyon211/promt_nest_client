'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, ChevronRight, Sparkles, LogOut } from 'lucide-react';

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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    if (path === '/dashboard') return pathname.startsWith('/dashboard');
    return pathname.startsWith(path);
  };

  const getAuthHref = (basePath) => {
    if (pathname.startsWith('/pricing') || pathname.startsWith('/prompt') || pathname.startsWith('/all-prompts')) {
      return `${basePath}?redirect=${encodeURIComponent(pathname)}`;
    }
    return basePath;
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
        className="p-2 rounded-full bg-transparent hover:bg-foreground/5 transition-all duration-300 text-text-secondary hover:text-text-primary flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Toggle Dark Mode"
      >
        {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ease-in-out ${scrolled
          ? 'bg-background/70 backdrop-blur-lg border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-transparent'
        }`}
    >
      {/* Navbar Height ekhane adjust kora hoyeche: h-14 md:h-16 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none rounded-lg focus:ring-2 focus:ring-primary/20 p-1 -ml-1">
          <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-primary/10">
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop stopColor="var(--color-primary)" offset="0%" />
                <stop stopColor="var(--color-accent)" offset="100%" />
              </linearGradient>
            </svg>
            <Sparkles size={18} strokeWidth={2.5} stroke="url(#logo-gradient)" />
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            PromptNest
          </span>
        </Link>

        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isActive(link.href)
                      ? 'text-primary bg-primary/10 shadow-inner'
                      : 'text-text-secondary hover:text-text-primary hover:bg-foreground/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="w-[1px] h-5 bg-border mx-2"></div>

            {isLoading ? (
              <div className="w-32 h-8 bg-foreground/5 animate-pulse rounded-full ml-4"></div>
            ) : user ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="flex items-center space-x-2 bg-surface/50 border border-border pl-1.5 pr-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      width={24}
                      height={24}
                      className="rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-text-primary max-w-[100px] truncate hidden lg:block">
                    {user.displayName || "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-text-secondary hover:text-accent rounded-full hover:bg-accent/10 transition-all focus:outline-none focus:ring-2 focus:ring-accent/20"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={getAuthHref('/login')}
                  className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-border rounded-full"
                >
                  Log in
                </Link>
                <Link
                  href={getAuthHref('/register')}
                  className="group flex items-center gap-1 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  Get Started
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                </Link>
              </div>
            )}
          </nav>

          <div className="ml-2 md:ml-4 flex items-center md:border-l md:border-border md:pl-4">
            {renderThemeToggle()}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-2 p-2 text-text-secondary hover:text-text-primary hover:bg-foreground/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-border"
            onClick={toggleMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-border shadow-2xl transition-all duration-300 origin-top overflow-hidden ${mobileMenuOpen ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
          }`}
      >
        <div className="px-4 py-6 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleMenu}
              className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-foreground/5'
                }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-[1px] bg-border my-4 mx-4"></div>

          {isLoading ? (
            <div className="w-32 h-10 bg-foreground/5 animate-pulse rounded-full mx-4"></div>
          ) : user ? (
            <div className="flex flex-col space-y-4 px-2">
              <div className="flex items-center space-x-3 px-2">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-base font-semibold text-text-primary">
                  {user.displayName || "User"}
                </span>
              </div>
              <button
                onClick={() => { logout(); toggleMenu(); }}
                className="flex items-center gap-2 px-4 py-3 text-left rounded-xl text-base font-semibold text-accent hover:bg-accent/10 transition-colors w-full"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-2 px-2">
              <Link
                href={getAuthHref('/login')}
                onClick={toggleMenu}
                className="w-full py-3 text-center rounded-xl text-base font-semibold text-text-primary border border-border hover:bg-foreground/5 transition-colors focus:outline-none focus:ring-2 focus:ring-border"
              >
                Log in
              </Link>
              <Link
                href={getAuthHref('/register')}
                onClick={toggleMenu}
                className="w-full py-3 text-center rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
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
