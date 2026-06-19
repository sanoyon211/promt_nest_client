import { Star, Lock, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';

export default function PromptReviews({ reviews, isLocked, promptId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/prompts/${promptId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text: comment })
      });
      
      toast.success('Review submitted successfully!');
      
      // Optimistic update
      setLocalReviews([
        { user: { name: user.name, email: user.email }, rating, text: comment, date: new Date().toISOString() },
        ...localReviews
      ]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-foreground/10">
      <h2 className="text-2xl font-bold text-foreground mb-8">User Reviews</h2>
      
      <div className="relative">
        <div className={`${isLocked ? 'blur-sm select-none opacity-50' : ''}`}>
          
          {/* Review Submission Form */}
          {user && !isLocked && (
            <div className="bg-surface p-6 rounded-2xl border border-primary/20 shadow-sm mb-8">
              <h3 className="font-bold text-foreground mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-center mb-4 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={24} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/20'} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of this prompt?"
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:border-primary text-foreground mb-4 resize-none"
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Send size={16} className="mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Review List */}
          {localReviews.length === 0 ? (
            <p className="text-foreground/50 italic">No reviews yet for this prompt.</p>
          ) : (
            <div className="space-y-6">
              {localReviews.map((review, idx) => (
                <div key={idx} className="bg-surface p-6 rounded-2xl border border-foreground/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-foreground/50">
                          {new Date(review.date || Date.now()).toLocaleDateString()} 
                          {review.user?.email && ` • ${review.user.email}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < (review.rating || 5) ? 'fill-current' : 'text-foreground/20'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/30 backdrop-blur-[1px] rounded-2xl">
             <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
              <Lock size={24} className="text-accent" />
            </div>
             <p className="font-bold text-foreground text-lg">Subscribe to Premium to view and write reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
}
