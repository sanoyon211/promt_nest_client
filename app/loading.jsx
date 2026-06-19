import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
        <Loader2 size={48} className="text-primary animate-spin relative z-10" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-foreground animate-pulse">Loading PromptVerse...</h2>
      <p className="text-foreground/60 text-sm mt-2">Just a moment while we fetch the data.</p>
    </div>
  );
}
