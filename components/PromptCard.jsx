import Link from 'next/link';
import { Copy, Sparkles } from 'lucide-react';

export default function PromptCard({ prompt }) {
  // Strict badge styling rules for dynamic light/dark shade matching without using #000 or #FFF
  const getBadgeStyle = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-[#DCFCE7] text-[#14291C] dark:bg-[#14291C] dark:text-[#DCFCE7]';
      case 'pro':
        return 'bg-[#FCE7F3] text-[#3D1530] dark:bg-[#3D1530] dark:text-[#FCE7F3]';
      case 'public':
      default:
        return 'bg-[#ECEBF3] text-[#232040] dark:bg-[#232040] dark:text-[#ECEBF3]';
    }
  };

  const badgeClass = getBadgeStyle(prompt.level || prompt.tag);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-foreground/10 hover:border-primary/50 transition-colors shadow-sm flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClass}`}>
          {prompt.level || prompt.tag || 'Public'}
        </span>
        
        {prompt.aiTool && (
          <span className="flex items-center text-xs font-medium text-foreground/60 bg-foreground/5 px-2 py-1 rounded-full border border-foreground/10">
            <Sparkles size={12} className="mr-1 text-primary" />
            {prompt.aiTool}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{prompt.title}</h3>
      <p className="text-sm text-foreground/70 mb-4 flex-1 line-clamp-3">{prompt.description}</p>
      
      {/* Category & Copy Count */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-foreground/5">
        <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
          {prompt.category || 'General'}
        </span>
        <div className="flex items-center text-foreground/50 text-xs font-medium bg-foreground/5 px-2 py-1 rounded-md">
          <Copy size={14} className="mr-1" />
          {prompt.copyCount || 0}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {prompt.author?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-foreground/60 font-medium">{prompt.author?.name || 'Unknown'}</span>
        </div>
        <Link 
          href={`/prompt/${prompt.id || '#'}`} 
          className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
