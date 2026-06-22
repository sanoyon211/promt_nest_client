'use client';
import { Star, Lock, Send, Loader2, MessageSquare, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function PromptReviews({ reviews, isLocked, promptId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts/${promptId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setLocalReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, [promptId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access-token');
      await fetch(`${API_URL}/prompts/${promptId}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment, name: user.name })
      });
      
      toast.success('Review submitted successfully!', { position: "bottom-right", theme: "dark" });
      
      // Optimistic update
      setLocalReviews([
        { name: user.name, email: user.email, rating, comment, date: new Date().toISOString(), user: { photoURL: user.photoURL, name: user.name } },
        ...localReviews
      ]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={24} className="text-primary" />
        <h2 className="text-2xl font-bold text-text-primary">User Reviews</h2>
        <span className="bg-foreground/5 text-text-secondary px-3 py-1 rounded-full text-sm font-bold ml-2">
          {localReviews.length}
        </span>
      </div>
      
      <div className="relative">
        <div className={`transition-all duration-500 ${isLocked ? 'blur-[8px] select-none opacity-40 pointer-events-none' : ''}`}>
          
          {/* Review Submission Form / Login Prompt */}
          {!isLocked && (
            <div className="mb-10">
              {user ? (
                <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden">
                  <h3 className="font-bold text-text-primary mb-4 text-lg">Leave a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    
                    {/* Interactive Star Rating */}
                    <div className="flex items-center mb-6 space-x-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button 
                          key={star} 
                          type="button" 
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none p-1"
                        >
                          <Star 
                            size={28} 
                            className={`transition-colors duration-200 ${
                              star <= (hoverRating || rating) 
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                                : 'fill-transparent text-text-secondary/30'
                            }`} 
                          />
                        </motion.button>
                      ))}
                    </div>

                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How did this prompt work for you? Did you change any variables?"
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 min-h-[120px] focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-text-primary text-[15px] mb-5 resize-none transition-all placeholder:text-text-secondary/50"
                      required
                    />
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-text-secondary hidden sm:block">
                        Your review helps other creators.
                      </p>
                      <button 
                        type="submit"
                        disabled={isSubmitting || !comment.trim()}
                        className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Send size={16} className="mr-2" />
                            Post Review
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Not Logged In Call-to-Action
                <div className="bg-gradient-to-r from-surface to-background p-5 md:p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-text-primary text-lg mb-1">Join the conversation</h3>
                    <p className="text-sm font-medium text-text-secondary">Log in to leave a review, bookmark, and copy prompts.</p>
                  </div>
                  <Link 
                    href={`/login?redirect=/prompt/${promptId}`}
                    className="flex items-center px-6 py-3 bg-surface border border-border text-text-primary font-bold rounded-xl hover:bg-foreground/5 hover:border-text-secondary transition-all active:scale-95 w-full sm:w-auto justify-center whitespace-nowrap"
                  >
                    <LogIn size={16} className="mr-2" />
                    Log In to Review
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Review List */}
          {localReviews.length === 0 ? (
            <div className="text-center py-10 bg-surface/50 border border-dashed border-border rounded-2xl">
              <MessageSquare size={32} className="mx-auto text-text-secondary/50 mb-3" />
              <p className="text-text-primary font-bold text-lg mb-1">No reviews yet</p>
              <p className="text-text-secondary font-medium text-sm">Be the first to share your experience with this prompt.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {localReviews.map((review, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start sm:items-center justify-between mb-4 flex-col sm:flex-row gap-3">
                      <div className="flex items-center space-x-4">
                        {review.user?.photoURL ? (
                          <img 
                            src={review.user.photoURL} 
                            alt={review.name || review.user.name || 'User'} 
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-primary/20 shadow-inner flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-black text-lg ring-1 ring-primary/20 shadow-inner flex-shrink-0">
                            {(review.name || review.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-text-primary text-base leading-tight">
                            {review.name || review.user?.name || 'Anonymous User'}
                          </p>
                          <p className="text-[12px] font-medium text-text-secondary mt-0.5">
                            {new Date(review.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                          </p>
                        </div>
                      </div>
                      
                      {/* Read-only Stars */}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-text-secondary/30'} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-text-secondary leading-relaxed text-[15px] font-medium pl-0 sm:pl-16">
                      {review.comment || review.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Premium Overlay */}
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/30 backdrop-blur-md rounded-2xl border border-white/5"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-lg">
              <Lock size={28} className="text-accent" />
            </div>
            <p className="font-bold text-text-primary text-xl md:text-2xl text-center px-4 max-w-md mb-6">
              Subscribe to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Premium</span> to view and write reviews.
            </p>
            <Link 
              href="/pricing"
              className="px-6 py-3 bg-text-primary text-background font-bold rounded-xl active:scale-95 transition-transform"
            >
              Upgrade Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
