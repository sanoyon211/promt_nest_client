'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TRENDING_TAGS = ['#ChatGPT', '#Midjourney', '#Coding', '#Copywriting', '#SEO', '#Marketing'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Typically router.push(`/prompts?q=${searchQuery}`)
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto z-10"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Unlock the Power of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI Creativity</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Discover, share, and organize the world's most effective AI prompts. Elevate your workflows and unleash your imagination with PromtNest.
        </motion.p>

        {/* Animated Search Bar */}
        <motion.form 
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div 
            className="relative flex items-center group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="absolute left-6 text-foreground/40 group-focus-within:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'Python debugging' or 'SEO blog'..."
              className="w-full pl-16 pr-32 py-5 bg-surface border-2 border-foreground/10 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-foreground text-lg shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-8 py-3 bg-foreground text-background font-medium rounded-full hover:scale-105 transition-transform active:scale-95"
            >
              Search
            </button>
          </motion.div>
        </motion.form>

        {/* Trending Tags */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span className="text-sm font-medium text-foreground/50 mr-2 hidden sm:inline-block">Trending:</span>
          {TRENDING_TAGS.map((tag, index) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--primary)', color: '#ffffff', borderColor: 'transparent' }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 text-sm font-medium text-foreground/70 bg-surface border border-foreground/10 rounded-full transition-colors shadow-sm"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-xl shadow-accent/20 active:scale-95 text-center"
          >
            Start Creating for Free
          </Link>
          <Link 
            href="/prompts" 
            className="w-full sm:w-auto px-8 py-4 bg-surface text-foreground font-bold text-lg rounded-full border-2 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/5 transition-all text-center"
          >
            Explore Library
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
