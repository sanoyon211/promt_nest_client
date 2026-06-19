'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
        <AlertTriangle size={48} className="text-red-500 relative z-10" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Something went wrong!</h1>
      <p className="text-lg text-foreground/60 max-w-lg mb-8">
        We encountered an unexpected error while trying to load this page. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center shadow-md shadow-primary/20"
        >
          <RefreshCcw size={18} className="mr-2" /> Try Again
        </button>
        <Link 
          href="/"
          className="px-8 py-3 bg-surface border border-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/5 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
