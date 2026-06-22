'use client';
import { Sparkles, Copy, Calendar, Tag, Bookmark, Flag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function PromptHeader({ prompt, promptId, onReportClick }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const token = localStorage.getItem('access-token');
      if (!user || !token) return;
      try {
        const res = await fetch(`${API_URL}/prompts/${promptId}/bookmark-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookmarkStatus();
  }, [user, promptId, API_URL]);

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please log in to bookmark this prompt', { position: "bottom-right" });
      return;
    }
    
    try {
      const token = localStorage.getItem('access-token');
      // Simulate optimistic UI update
      setBookmarked(!bookmarked);
      if (!bookmarked) {
        toast.success('Prompt bookmarked successfully!', { position: "bottom-right" });
      } else {
        toast.info('Prompt removed from bookmarks.', { position: "bottom-right" });
      }

      const res = await fetch(`${API_URL}/prompts/${promptId}/bookmark`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update bookmark.', { position: "bottom-right" });
      setBookmarked(prev => !prev); // revert on error
    }
  };

  const getBadgeStyle = (type, value) => {
    const val = value?.toLowerCase();
    if (type === 'tier') {
      if (val === 'premium') return 'bg-accent/10 text-accent border-accent/20';
      if (val === 'private') return 'bg-foreground/5 text-text-primary border-border';
    }
    if (type === 'level') {
      if (val === 'beginner') return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      if (val === 'intermediate') return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      if (val === 'pro') return 'bg-primary/10 text-primary border-primary/20';
    }
    return 'bg-foreground/5 text-text-secondary border-border'; // Public/Default
  };

  return (
    <div className="mb-12 border-b border-border/60 pb-12">
      {/* Top Meta Row & Actions */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2">
          {prompt.tier && (
            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getBadgeStyle('tier', prompt.tier)} uppercase tracking-widest shadow-sm`}>
              {prompt.tier}
            </span>
          )}
          {prompt.level && (
            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getBadgeStyle('level', prompt.level)} uppercase tracking-widest shadow-sm`}>
              {prompt.level}
            </span>
          )}
          <span className="flex items-center px-3 py-1 text-[11px] font-bold rounded-full bg-surface border border-border text-text-secondary uppercase tracking-widest shadow-sm">
            <Tag size={12} className="mr-1.5" />
            {prompt.category || 'General'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 shadow-sm border ${bookmarked
              ? 'bg-primary/10 border-primary/20 text-primary'
              : 'bg-surface border-border text-text-secondary hover:bg-foreground/5 hover:border-primary/30 hover:text-primary'
              }`}
            title={bookmarked ? "Remove Bookmark" : "Bookmark Prompt"}
          >
            <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onReportClick}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-surface border border-border text-text-secondary shadow-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all duration-300"
            title="Report Prompt"
          >
            <Flag size={18} />
          </motion.button>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-5 leading-tight tracking-tight pb-2">
        {prompt.title}
      </h1>

      <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-3xl font-medium">
        {prompt.description}
      </p>

      {/* Thumbnail Image */}
      {prompt.thumbnailImage && (
        <div className="w-full h-64 sm:h-[400px] mb-10 rounded-2xl overflow-hidden relative border border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none bg-foreground/5 group">
          {/* Black Overlay: Hover korle halka clear hobe */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-700 z-10 pointer-events-none"></div>

          <img
            src={prompt.thumbnailImage}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      {/* Bottom Meta Stats */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-semibold text-text-secondary">
        <div className="flex items-center bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2.5 rounded-xl border border-primary/20 shadow-sm">
          <Sparkles size={16} className="mr-2" />
          Optimized for: <strong className="ml-1.5 text-text-primary">{prompt.aiTool || 'Any Model'}</strong>
        </div>

        <div className="flex items-center bg-surface px-4 py-2.5 rounded-xl border border-border shadow-sm">
          <Copy size={16} className="mr-2 text-text-secondary/70" />
          <span className="text-text-primary mr-1">{prompt.copyCount || 0}</span> Copies
        </div>

        <div className="flex items-center bg-surface px-4 py-2.5 rounded-xl border border-border shadow-sm">
          <Calendar size={16} className="mr-2 text-text-secondary/70" />
          Updated <span className="text-text-primary ml-1.5">{new Date(prompt.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
