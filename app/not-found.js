import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <h1 className="text-9xl font-black tracking-tighter opacity-10">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-foreground/70 max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps never existed.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg"
      >
        Return to Home
      </Link>
    </div>
  );
}
