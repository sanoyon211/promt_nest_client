'use client';
import { ShieldCheck, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CreatorProfileSnippet({ creator }) {
  if (!creator) return null;

  return (
    <div className="bg-surface rounded-2xl p-5 md:p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mb-12 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      
      {/* Decorative Subtle Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-500 group-hover:bg-primary/10"></div>

      <div className="flex items-center gap-5 md:gap-6 z-10">
        {/* Avatar */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl md:text-3xl font-black text-primary flex-shrink-0 ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
          {creator.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        
        {/* Creator Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight truncate group-hover:text-primary transition-colors duration-300">
              {creator.name || 'Anonymous Creator'}
            </h3>
            {creator.isVerified && (
              <ShieldCheck size={20} className="text-accent drop-shadow-sm flex-shrink-0" title="Verified Creator" />
            )}
          </div>
          
          <p className="text-sm md:text-base text-text-secondary mb-3 font-medium line-clamp-1">
            {creator.bio || 'AI Prompt Engineer & Digital Creator'}
          </p>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
              <Star size={12} className="mr-1.5 fill-accent" />
              Top Creator
            </span>
          </div>
        </div>
      </div>
      
      {/* Right Side: Stats & Action Button */}
      <div className="flex items-center gap-6 sm:pl-6 sm:border-l sm:border-border z-10 w-full sm:w-auto justify-between sm:justify-start pt-5 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <div className="text-left sm:text-right">
          <div className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            {creator.totalPrompts || 0}
          </div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">
            Prompts
          </div>
        </div>

        {/* Action Button to View Profile */}
        <Link 
          href={`/creator/${creator._id || creator.id || '#'}`}
          className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 group/btn"
          title={`View ${creator.name}'s Profile`}
        >
          <ChevronRight size={22} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
    </div>
  );
}
