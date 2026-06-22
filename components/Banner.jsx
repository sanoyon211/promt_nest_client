'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TRENDING_TAGS = ['#ChatGPT', '#Midjourney', '#Coding', '#Copywriting', '#SEO', '#Marketing'];

export default function Banner() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-prompts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      
      {/* Premium Decorative Backgrounds */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten opacity-70"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl mx-auto z-10 w-full"
      >
        {/* Pill Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 cursor-default"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
            <Sparkles size={12} className="text-primary" />
          </span>
          <span className="text-xs font-bold text-text-primary uppercase tracking-widest">PromptNest v2.0 is Live</span>
        </motion.div>

        {/* Hero Typography - Scaled Down */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight text-text-primary mb-5 leading-[1.1]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Master the art of <br className="hidden sm:block" />
          <span className="relative inline-block mt-1 sm:mt-0">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">
              AI Creativity
            </span>
          </span>
        </motion.h1>
        
        {/* Subtitle - Scaled Down */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          Discover, share, and organize the world's most effective AI prompts. Elevate your workflows and unleash your imagination instantly.
        </motion.p>

        {/* Search Bar - Height & Text adjusted */}
        <motion.form 
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-8 group px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-center bg-surface/90 backdrop-blur-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl overflow-hidden p-1.5 transition-all duration-300">
            <div className="pl-4 pr-3 text-text-secondary group-focus-within:text-primary transition-colors duration-300">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'Python debugging' or 'SEO blog'..."
              className="w-full py-3.5 bg-transparent focus:outline-none text-text-primary text-base sm:text-lg font-medium placeholder:text-text-secondary/50 placeholder:font-normal"
            />
            <button
              type="submit"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold text-base rounded-xl hover:bg-foreground/90 active:scale-[0.98] transition-all duration-200"
            >
              Search
              <ArrowRight size={18} strokeWidth={3} />
            </button>
            <button
              type="submit"
              className="sm:hidden flex items-center justify-center w-11 h-11 bg-foreground text-background rounded-xl active:scale-[0.98] transition-all duration-200"
            >
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>
        </motion.form>

        {/* Trending Tags */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-2 mb-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mr-1">Trending:</span>
          {TRENDING_TAGS.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery(tag.replace('#', ''))}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-text-secondary bg-surface border border-border rounded-full hover:border-primary/50 hover:text-primary hover:bg-primary/5 hover:shadow-sm transition-all duration-200"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Call to Action Buttons - Scaled Down */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white font-bold text-base rounded-xl hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-center flex items-center justify-center gap-2 group"
          >
            Start Creating for Free 
            <Sparkles size={16} className="group-hover:animate-pulse" />
          </Link>
          <Link 
            href="/all-prompts" 
            className="w-full sm:w-auto px-7 py-3.5 bg-surface text-text-primary font-bold text-base rounded-xl border-2 border-border hover:border-text-secondary hover:bg-foreground/5 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
          >
            Explore Library
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
