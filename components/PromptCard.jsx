import Link from 'next/link';
import { Copy, Sparkles, ArrowUpRight, Crown } from 'lucide-react';

export default function PromptCard({ prompt }) {
  // Check if the prompt is premium/pro
  const isPro = prompt.level?.toLowerCase() === 'pro' || prompt.tag?.toLowerCase() === 'pro' || prompt.level?.toLowerCase() === 'premium';

  // Premium subtle badge styling
  const getBadgeStyle = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pro':
      case 'premium':
        return 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/30 shadow-[inset_0_0_10px_rgba(79,70,229,0.05)]';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'public':
      default:
        return 'bg-background border-border text-text-secondary';
    }
  };

  const badgeClass = getBadgeStyle(prompt.level || prompt.tag);

  return (
    <div className="group relative h-full rounded-[24px] transition-all duration-500 hover:-translate-y-2">
      
      {/* Premium Ambient Glow on Hover */}
      <div className="absolute -inset-[1.5px] bg-gradient-to-br from-primary/40 via-transparent to-accent/40 rounded-[26px] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500 pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="relative bg-surface rounded-[24px] p-5 lg:p-6 border border-border flex flex-col h-full overflow-hidden shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 z-10">
        
        {/* Subtle inner top glare for 3D depth */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Thumbnail Image */}
        {prompt.thumbnailImage && (
          <div className="w-full h-44 mb-5 rounded-[16px] overflow-hidden flex-shrink-0 relative border border-border/50 bg-background/50 group-hover:border-primary/20 transition-colors duration-500">
            {/* Soft gradient overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none"></div>
            <img 
              src={prompt.thumbnailImage} 
              alt={prompt.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Absolute Pro Badge on Image */}
            {isPro && (
              <div className="absolute top-3 right-3 z-20 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-primary/20 flex items-center shadow-lg">
                <Crown size={12} className="text-accent mr-1.5" />
                <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-widest">Premium</span>
              </div>
            )}
          </div>
        )}
        
        {/* Tags Row */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center ${badgeClass}`}>
            {!prompt.thumbnailImage && isPro && <Crown size={12} className="mr-1.5 text-accent" />}
            {prompt.level || prompt.tag || 'Public'}
          </span>
          
          {prompt.aiTool && (
            <span className="flex items-center text-[11px] font-bold tracking-wide text-text-secondary bg-background border border-border px-3 py-1.5 rounded-lg shadow-sm group-hover:border-primary/30 transition-colors duration-300">
              <Sparkles size={12} className="mr-1.5 text-primary" />
              {prompt.aiTool}
            </span>
          )}
        </div>
        
        {/* Title & Description */}
        <h3 className="text-[19px] font-black text-text-primary mb-2.5 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300 tracking-tight leading-snug">
          {prompt.title}
        </h3>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3 font-medium">
          {prompt.description}
        </p>
        
        {/* Category & Stats */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-border/70 group-hover:border-border transition-colors duration-300">
          <span className="text-[11px] font-black text-text-secondary/70 uppercase tracking-widest bg-background/60 px-3 py-1.5 rounded-lg border border-border/50">
            {prompt.category || 'General'}
          </span>
          <div className="flex items-center bg-background/60 px-3 py-1.5 rounded-lg border border-border/50 text-text-secondary text-[12px] font-bold transition-colors group-hover:text-primary group-hover:border-primary/20" title="Total Copies">
            <Copy size={14} className="mr-1.5" />
            {prompt.copyCount || 0}
          </div>
        </div>

        {/* Footer: Author & Action Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-sm font-black text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {prompt.author?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary/80 font-bold uppercase tracking-widest mb-0.5">Creator</span>
              <span className="text-[13px] text-text-primary font-black truncate max-w-[120px] tracking-tight">
                {prompt.author?.name || 'Anonymous'}
              </span>
            </div>
          </div>

          <Link 
            href={`/prompt/${prompt.id || prompt._id || '#'}`} 
            className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-background border border-border text-text-secondary group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm group-hover:shadow-[0_8px_20px_-4px_rgba(79,70,229,0.5)]"
            title="View Details"
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}