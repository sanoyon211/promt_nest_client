'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 min-h-[60vh] animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-foreground/70 max-w-md mb-8">
        An unexpected error has occurred. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
}
