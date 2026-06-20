'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Search } from 'lucide-react';

const TRENDING_TAGS = ['#ChatGPT', '#Midjourney', '#Coding', '#Copywriting', '#SEO', '#Marketing'];

export default function Banner() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Premium Decorative Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-accent/10 via-primary/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto z-10 w-full"
      >
        {/* Pill Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-border shadow-sm mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
            <Sparkles size={12} className="text-primary" />
          </span>
          <span className="text-xs font-semibold text-text-primary uppercase tracking-widest">PromtNest v2.0 is Live</span>
        </motion.div>

        {/* Huge Hero Typography */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-text-primary mb-6 leading-[1.1]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Master the art of <br className="hidden md:block" />
          <span className="relative">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
              AI Creativity
            </span>
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Discover, share, and organize the world's most effective AI prompts. Elevate your workflows and unleash your imagination instantly.
        </motion.p>

        {/* Mac-Style Command Palette Search Bar */}
        <motion.form 
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-10 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-surface/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden p-1.5">
            <div className="pl-5 pr-3 text-text-secondary">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'Python debugging' or 'SEO blog'..."
              className="w-full py-4 bg-transparent focus:outline-none text-text-primary text-lg font-medium placeholder-text-secondary/50"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-text-primary text-background font-bold rounded-xl hover:bg-text-secondary transition-colors"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Premium Trending Tags */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mr-2">Trending:</span>
          {TRENDING_TAGS.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-semibold text-text-primary bg-surface/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors shadow-sm"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Creating for Free <Sparkles size={18} />
            </span>
          </Link>
          <Link 
            href="/all-prompts" 
            className="w-full sm:w-auto px-8 py-4 bg-surface text-text-primary font-bold text-lg rounded-xl border border-border hover:bg-foreground/5 hover:-translate-y-0.5 transition-all text-center"
          >
            Explore Library
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
