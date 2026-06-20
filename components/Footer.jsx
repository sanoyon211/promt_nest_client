import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-16 pb-8 mt-auto overflow-hidden relative">
      {/* Decorative background blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-[100%] blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <linearGradient id="footer-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="var(--color-primary)" offset="0%" />
                    <stop stopColor="var(--color-accent)" offset="100%" />
                  </linearGradient>
                </svg>
                <Sparkles size={20} strokeWidth={2.5} stroke="url(#footer-logo-gradient)" />
              </div>
              <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                PromtNest
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-xs">
              Your modern platform for sharing, discovering, and integrating the world's most powerful AI prompts securely.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="/all-prompts" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Explore Library</Link></li>
                <li><Link href="/demo" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Demo Accounts</Link></li>
                <li><Link href="/pricing" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Pricing</Link></li>
                <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Sign Up Free</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Prompt Guide</Link></li>
                <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> API Documentation</Link></li>
                <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Community Forum</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> About Us</Link></li>
                <li><Link href="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Contact</Link></li>
                <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary font-medium">
            © {new Date().getFullYear()} PromtNest. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-text-secondary hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <div className="w-1 h-1 rounded-full bg-border mx-1"></div>
            <span className="text-sm text-text-secondary hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <div className="w-1 h-1 rounded-full bg-border mx-1"></div>
            <span className="text-sm text-text-secondary hover:text-primary cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
