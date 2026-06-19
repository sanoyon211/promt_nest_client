import { Sparkles, Copy, Calendar, Tag } from 'lucide-react';

export default function PromptHeader({ prompt }) {
  const getBadgeStyle = (type, value) => {
    const val = value?.toLowerCase();
    if (type === 'tier') {
      if (val === 'premium') return 'bg-[#CFFAFE] text-cyan-900 dark:bg-cyan-900 dark:text-[#CFFAFE]';
      if (val === 'private') return 'bg-[#E5E3F0] text-[#1E1B2E] dark:bg-[#18162B] dark:text-[#E5E3F0]';
    }
    if (type === 'level') {
      if (val === 'beginner') return 'bg-[#DCFCE7] text-[#14291C] dark:bg-[#14291C] dark:text-[#DCFCE7]';
      if (val === 'pro') return 'bg-[#FCE7F3] text-[#3D1530] dark:bg-[#3D1530] dark:text-[#FCE7F3]';
    }
    return 'bg-[#ECEBF3] text-[#232040] dark:bg-[#232040] dark:text-[#ECEBF3]'; // Public/Default
  };

  return (
    <div className="mb-10 border-b border-foreground/10 pb-10">
      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tier && (
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getBadgeStyle('tier', prompt.tier)} uppercase tracking-wider`}>
            {prompt.tier}
          </span>
        )}
        {prompt.level && (
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getBadgeStyle('level', prompt.level)} uppercase tracking-wider`}>
            {prompt.level}
          </span>
        )}
        <span className="flex items-center px-3 py-1 text-xs font-bold rounded-full bg-surface border border-foreground/10 text-foreground/80 uppercase tracking-wider">
          <Tag size={12} className="mr-1" />
          {prompt.category || 'General'}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
        {prompt.title}
      </h1>
      
      <p className="text-xl text-foreground/70 mb-8 leading-relaxed max-w-4xl">
        {prompt.description}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/60">
        <div className="flex items-center bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10">
          <Sparkles size={16} className="mr-2" />
          Optimized for: <strong className="ml-1">{prompt.aiTool || 'Any'}</strong>
        </div>
        <div className="flex items-center">
          <Copy size={16} className="mr-2 text-foreground/40" />
          {prompt.copyCount || 0} Copies
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-foreground/40" />
          Updated {new Date(prompt.updatedAt || Date.now()).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
