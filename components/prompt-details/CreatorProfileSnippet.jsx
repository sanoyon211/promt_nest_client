import { ShieldCheck, Star } from 'lucide-react';

export default function CreatorProfileSnippet({ creator }) {
  if (!creator) return null;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-foreground/10 flex items-center space-x-6 shadow-sm mb-10 group hover:border-primary/30 transition-colors">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
        {creator.name?.charAt(0) || 'U'}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-xl font-bold text-foreground mr-2">{creator.name}</h3>
          {creator.isVerified && (
            <ShieldCheck size={18} className="text-accent" />
          )}
        </div>
        <p className="text-sm text-foreground/60 mt-1 mb-2 font-medium">{creator.bio || 'AI Prompter'}</p>
        
        <div className="flex items-center text-xs font-bold text-primary bg-[#ECEBF3] dark:bg-[#232040] dark:text-[#818CF8] px-3 py-1 rounded-full w-max">
          <Star size={12} className="mr-1 fill-current" />
          Top Creator
        </div>
      </div>
      
      <div className="hidden sm:block text-right">
        <div className="text-2xl font-black text-foreground">{creator.totalPrompts || 0}</div>
        <div className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Prompts</div>
      </div>
    </div>
  );
}
