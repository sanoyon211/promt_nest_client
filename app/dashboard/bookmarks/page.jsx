'use client';
import { useState, useEffect } from 'react';
import { BookmarkMinus, ExternalLink, Bookmark, Compass } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/user/bookmarks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (bookmarkId, promptId) => {
    try {
      const token = localStorage.getItem('access-token');
      // Optimistic update with animation
      setBookmarks(bookmarks.filter(b => b._id !== bookmarkId));
      
      await fetch(`${API_URL}/prompts/${promptId}/bookmark`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.info('Bookmark removed from your library', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to remove bookmark', { position: "bottom-right" });
    }
  };

  const getTierStyle = (tier) => {
    const val = tier?.toLowerCase();
    if (val === 'private' || val === 'premium') return 'bg-accent/10 text-accent border-accent/20';
    return 'bg-foreground/5 text-text-secondary border-border';
  };

  // Premium Skeleton Table Loader
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full pb-10">
        <div className="mb-10 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 mb-2 animate-pulse mr-4"></div>
          <div>
            <div className="w-48 h-8 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
            <div className="w-64 h-4 bg-foreground/5 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-[24px] shadow-sm overflow-hidden p-6">
          <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full h-16 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <Bookmark size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Saved Prompts</h1>
          <p className="text-text-secondary font-medium mt-1">Your personal library of bookmarked AI workflows.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          
          {bookmarks.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <Bookmark size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No bookmarks yet</h3>
              <p className="text-text-secondary font-medium max-w-sm mb-8">
                You haven't saved any prompts to your library. Explore the community to find workflows that inspire you.
              </p>
              <Link 
                href="/all-prompts"
                className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]"
              >
                <Compass size={18} className="mr-2" />
                Explore Library
              </Link>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Prompt Title</th>
                  <th className="p-5">Creator</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Tier</th>
                  <th className="p-5">Date Saved</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {bookmarks.map((bookmark, idx) => (
                    <motion.tr 
                      key={bookmark._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="truncate max-w-[200px] sm:max-w-xs group-hover:text-primary transition-colors">
                          {bookmark.prompt?.title || 'Unknown Prompt'}
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {bookmark.prompt?.creator?.name || bookmark.prompt?.author?.name || bookmark.prompt?.creator?.username || bookmark.prompt?.author?.username || 'Unknown'}
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {bookmark.prompt?.category || 'General'}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black border ${getTierStyle(bookmark.prompt?.tier)} uppercase tracking-widest shadow-sm`}>
                          {bookmark.prompt?.tier || 'Public'}
                        </span>
                      </td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">
                        {new Date(bookmark.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/prompt/${bookmark.prompt?._id}`} 
                            title="View Details" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all active:scale-95 shadow-sm"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button 
                            onClick={() => handleRemove(bookmark._id, bookmark.prompt?._id)} 
                            title="Remove Bookmark" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 shadow-sm"
                          >
                            <BookmarkMinus size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Global Style for Horizontal Scrollbar in Table */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.2); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.4); 
        }
      `}} />
    </div>
  );
}