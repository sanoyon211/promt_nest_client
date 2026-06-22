'use client';
import { useState, useEffect } from 'react';
import { ExternalLink, Copy, Compass } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CopiedPromptsPage() {
  const { user } = useAuth();
  const [copiedPrompts, setCopiedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCopied = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/user/copied`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCopiedPrompts(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setCopiedPrompts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCopied();
  }, []);

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
          <Copy size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Copied Prompts</h1>
          <p className="text-text-secondary font-medium mt-1">A history of all the workflows you've copied for quick access.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">

          {copiedPrompts.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <Copy size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No history found</h3>
              <p className="text-text-secondary font-medium max-w-sm mb-8">
                You haven't copied any prompts yet. Head over to the library and find your first workflow.
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
                  <th className="p-5">Date Copied</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {copiedPrompts.map((item, idx) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="truncate max-w-[200px] sm:max-w-xs group-hover:text-primary transition-colors">
                          {item.prompt?.title || 'Unknown Prompt'}
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {item.prompt?.creator?.name || item.prompt?.author?.name || item.prompt?.creator?.username || item.prompt?.author?.username || 'Unknown'}
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {item.prompt?.category || 'General'}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black border ${getTierStyle(item.prompt?.tier)} uppercase tracking-widest shadow-sm`}>
                          {item.prompt?.tier || 'Public'}
                        </span>
                      </td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">
                        {new Date(item.copiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/prompt/${item.prompt?._id}`}
                            title="View Details"
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all active:scale-95 shadow-sm"
                          >
                            <ExternalLink size={16} />
                          </Link>
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
      <style dangerouslySetInnerHTML={{
        __html: `
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