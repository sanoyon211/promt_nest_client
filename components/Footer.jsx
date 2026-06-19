import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-foreground/10 py-12 mt-auto bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-bold text-2xl tracking-tight text-foreground">
              PromtNest
            </Link>
            <p className="mt-4 text-sm text-foreground/70 max-w-sm">
              Your modern platform for sharing, discovering, and integrating the world's most powerful AI prompts securely.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/prompts" className="text-sm text-foreground/70 hover:text-primary transition-colors">Explore Prompts</Link></li>
              <li><Link href="/creators" className="text-sm text-foreground/70 hover:text-primary transition-colors">Top Creators</Link></li>
              <li><Link href="/pricing" className="text-sm text-foreground/70 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} PromtNest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"></span>
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"></span>
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
