import Link from 'next/link';
import { Copy, Sparkles, ChevronRight } from 'lucide-react';

export default function PromptCard({ prompt }) {
  // Premium subtle badge styling
  const getBadgeStyle = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20';
      case 'pro':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'public':
      default:
        return 'bg-foreground/5 text-text-secondary border border-border';
    }
  };

  const badgeClass = getBadgeStyle(prompt.level || prompt.tag);

  return (
    <div className="relative h-full rounded-[24px] transition-all duration-500 hover:-translate-y-1 group">
      {/* Animated Gradient Border on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 via-accent/50 to-primary/50 opacity-0 blur-sm rounded-[26px] group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      {/* Card Content with Glassmorphism */}
      <div className="bg-surface/80 backdrop-blur-md rounded-[24px] p-6 border border-border group-hover:border-transparent transition-colors shadow-lg shadow-foreground/5 flex flex-col h-full relative overflow-hidden">
        
        {/* Subtle Inner Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0"></div>

        {prompt.thumbnailImage && (
          <div className="w-full h-40 mb-5 rounded-xl overflow-hidden flex-shrink-0 relative border border-border z-10">
            <img src={prompt.thumbnailImage} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4 z-10">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${badgeClass}`}>
            {prompt.level || prompt.tag || 'Public'}
          </span>
          
          {prompt.aiTool && (
            <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-surface border border-border px-2.5 py-1 rounded-md shadow-sm">
              <Sparkles size={10} className="mr-1.5 text-primary" />
              {prompt.aiTool}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all z-10">{prompt.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3 z-10">{prompt.description}</p>
        
        {/* Category & Copy Count */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-border z-10">
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {prompt.category || 'General'}
          </span>
          <div className="flex items-center text-text-secondary text-xs font-bold bg-foreground/5 px-2.5 py-1.5 rounded-md border border-border/50">
            <Copy size={12} className="mr-1.5" />
            {prompt.copyCount || 0}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shadow-inner">
              {prompt.author?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm text-text-primary font-semibold">{prompt.author?.name || 'Unknown'}</span>
          </div>
          <Link 
            href={`/prompt/${prompt.id || '#'}`} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary text-text-secondary hover:text-white transition-all group/btn"
          >
            <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
