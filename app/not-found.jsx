import Link from 'next/link';
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-[12rem] font-black text-foreground/5 leading-none absolute select-none pointer-events-none">
        404
      </div>
      
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative z-10">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
        <SearchX size={48} className="text-primary relative z-10" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 relative z-10">Page Not Found</h1>
      <p className="text-lg text-foreground/60 max-w-lg mb-8 relative z-10">
        Oops! The page or prompt you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      
      <Link 
        href="/"
        className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center shadow-xl shadow-primary/20 relative z-10"
      >
        <Home size={20} className="mr-2" /> Back to Homepage
      </Link>
    </div>
  );
}
