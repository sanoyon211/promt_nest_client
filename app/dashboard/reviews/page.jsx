'use client';
import { useState, useEffect } from 'react';
import { Star, Trash2, ExternalLink, MessageSquare, Compass } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/user/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const token = localStorage.getItem('access-token');
      // Optimistic delete with animation
      setReviews(reviews.filter(r => r._id !== reviewToDelete));
      
      await fetch(`${API_URL}/reviews/${reviewToDelete}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Review deleted successfully', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to delete review', { position: "bottom-right" });
    } finally {
      setReviewToDelete(null);
    }
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
          <MessageSquare size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">My Reviews</h1>
          <p className="text-text-secondary font-medium mt-1">Manage the feedback and ratings you've left on prompts.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          
          {reviews.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <Star size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No reviews yet</h3>
              <p className="text-text-secondary font-medium max-w-sm mb-8">
                You haven't left feedback on any prompts. Explore the library and share your thoughts with creators!
              </p>
              <Link 
                href="/all-prompts"
                className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]"
              >
                <Compass size={18} className="mr-2" />
                Explore Prompts
              </Link>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Prompt Title</th>
                  <th className="p-5">Rating</th>
                  <th className="p-5 min-w-[250px]">Your Comment</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {reviews.map((review, idx) => (
                    <motion.tr 
                      key={review._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="truncate max-w-[150px] sm:max-w-[200px] group-hover:text-primary transition-colors">
                          {review.prompt?.title || 'Unknown Prompt'}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-text-secondary/30'} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        <div className="truncate max-w-[250px] sm:max-w-xs italic text-[13px] bg-background/50 px-3 py-1.5 rounded-lg border border-border/50 inline-block" title={review.text}>
                          "{review.text}"
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/prompt/${review.prompt?._id}`} 
                            title="View Prompt" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all active:scale-95 shadow-sm"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(review._id)} 
                            title="Delete Review" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 shadow-sm"
                          >
                            <Trash2 size={16} />
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

      <ConfirmModal 
        isOpen={!!reviewToDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setReviewToDelete(null)}
        confirmText="Delete Review"
      />

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