import Link from 'next/link';
import { Sparkles } from 'lucide-react'; // Github ar Linkedin shoriye deya hoyeche

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border pt-16 pb-8 mt-auto overflow-hidden relative">
      {/* Decorative background blurs (Premium Dual-tone glow) */}
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-[100%] blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-[500px] h-[250px] bg-accent/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-2 group mb-6 focus:outline-none rounded-lg p-1 -ml-1 w-fit">
              <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform duration-300 shadow-sm shadow-primary/10">
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                  <linearGradient id="footer-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="var(--color-primary)" offset="0%" />
                    <stop stopColor="var(--color-accent)" offset="100%" />
                  </linearGradient>
                </svg>
                <Sparkles size={20} strokeWidth={2.5} stroke="url(#footer-logo-gradient)" />
              </div>
              <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                PromptNest
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-sm">
              Your modern platform for sharing, discovering, and integrating the world's most powerful AI prompts securely.
            </p>
            <div className="flex space-x-3">
              {/* Official X (Twitter) Logo */}
              <a href="#" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 hover:shadow-sm hover:-translate-y-1 transition-all duration-300">
                <svg className="w-[16px] h-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.000 4.07H5.078z" />
                </svg>
              </a>
              {/* GitHub Logo */}
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 hover:shadow-sm hover:-translate-y-1 transition-all duration-300">
                <svg className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.38 6.52-1.6 6.52-7.03a5.12 5.12 0 0 0-1.3-3.34 4.7 4.7 0 0 0-.1-3.3s-1.04-.3-3.4 1.3a11.5 11.5 0 0 0-6 0c-2.36-1.6-3.4-1.3-3.4-1.3a4.7 4.7 0 0 0-.1 3.3 5.12 5.12 0 0 0-1.3 3.34c0 5.4 3.3 6.6 6.5 7a4.8 4.8 0 0 0-1 3.03v4"></path>
                  <path d="M9 20c-5 1.5-5-2.5-7-3"></path>
                </svg>
              </a>
              {/* LinkedIn Logo */}
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 hover:shadow-sm hover:-translate-y-1 transition-all duration-300">
                <svg className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:pl-8">
            <div>
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide text-sm uppercase">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="/all-prompts" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Explore Library</span></Link></li>
                <li><Link href="/demo" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Demo Accounts</span></Link></li>
                <li><Link href="/pricing" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Pricing</span></Link></li>
                <li><Link href="/register" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Sign Up Free</span></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide text-sm uppercase">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Prompt Guide</span></Link></li>
                <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">API Documentation</span></Link></li>
                <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Community Forum</span></Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-text-primary mb-6 tracking-wide text-sm uppercase">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span></Link></li>
                <li><Link href="/contact" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span></Link></li>
                <li><Link href="/privacy" className="text-sm font-medium text-text-secondary hover:text-primary transition-all duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span> <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span></Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary font-medium">
            © {new Date().getFullYear()} PromptNest. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Terms of Service</Link>
            <div className="w-1 h-1 rounded-full bg-border"></div>
            <Link href="/privacy" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Privacy</Link>
            <div className="w-1 h-1 rounded-full bg-border"></div>
            <Link href="/cookies" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}