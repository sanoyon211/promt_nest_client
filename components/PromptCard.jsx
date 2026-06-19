import Link from 'next/link';

export default function PromptCard({ prompt }) {
  // Strict badge styling rules: 
  // - Public/Normal tag uses darker shade on light mode, lighter on dark mode
  // - Pro CTA uses strict accent
  return (
    <div className="bg-surface rounded-2xl p-6 border border-foreground/10 hover:border-primary/50 transition-colors shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#ECEBF3] text-primary dark:bg-[#232040] dark:text-[#818CF8]">
          {prompt.tag || 'Public'}
        </span>
        {prompt.isPro && (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-accent/10 text-accent border border-accent/20">
            PRO
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{prompt.title}</h3>
      <p className="text-sm text-foreground/70 mb-6 flex-1 line-clamp-3">{prompt.description}</p>
      <div className="flex items-center justify-between border-t border-foreground/5 pt-4 mt-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {prompt.author?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-foreground/60 font-medium">{prompt.author?.name || 'Unknown'}</span>
        </div>
        <Link href={`/prompt/${prompt.id}`} className="text-sm font-semibold text-primary hover:underline">
          View
        </Link>
      </div>
    </div>
  );
}
