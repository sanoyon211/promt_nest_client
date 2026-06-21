import Link from 'next/link';
import { Copy, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PromptCard({ prompt }) {
  // Premium subtle badge styling
  const getBadgeStyle = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'pro':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'intermediate':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'public':
      default:
        return 'bg-foreground/5 text-text-secondary border-border';
    }
  };

  const badgeClass = getBadgeStyle(prompt.level || prompt.tag);

  return (
    <div className="group h-full">
      {/* Clean Card Container with Soft Float Effect */}
      <div className="bg-surface rounded-[24px] p-5 border border-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.02)] flex flex-col h-full relative overflow-hidden">
        
        {/* Thumbnail Image */}
        {prompt.thumbnailImage && (
          <div className="w-full h-44 mb-5 rounded-[16px] overflow-hidden flex-shrink-0 relative border border-border/50 bg-foreground/5">
            <img 
              src={prompt.thumbnailImage} 
              alt={prompt.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        )}
        
        {/* Tags Row */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${badgeClass}`}>
            {prompt.level || prompt.tag || 'Public'}
          </span>
          
          {prompt.aiTool && (
            <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-surface border border-border px-2.5 py-1 rounded-md shadow-sm">
              <Sparkles size={10} className="mr-1.5 text-primary" />
              {prompt.aiTool}
            </span>
          )}
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
          {prompt.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3">
          {prompt.description}
        </p>
        
        {/* Category & Copy Count */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-border/70">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider bg-foreground/5 px-2.5 py-1 rounded-md">
            {prompt.category || 'General'}
          </span>
          <div className="flex items-center text-text-secondary text-xs font-bold" title="Total Copies">
            <Copy size={14} className="mr-1.5" />
            {prompt.copyCount || 0}
          </div>
        </div>

        {/* Footer: Author & Action Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-sm font-bold text-text-primary border border-border/50">
              {prompt.author?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Creator</span>
              <span className="text-sm text-text-primary font-semibold truncate max-w-[100px]">
                {prompt.author?.name || 'Anonymous'}
              </span>
            </div>
          </div>

          <Link 
            href={`/prompt/${prompt.id || prompt._id || '#'}`} 
            className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/5 text-text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            title="View Details"
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}