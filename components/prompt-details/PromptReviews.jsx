import { Star, Lock } from 'lucide-react';

export default function PromptReviews({ reviews, isLocked }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 pt-10 border-t border-foreground/10">
        <h2 className="text-2xl font-bold text-foreground mb-6">User Reviews</h2>
        <p className="text-foreground/50 italic">No reviews yet for this prompt.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-10 border-t border-foreground/10">
      <h2 className="text-2xl font-bold text-foreground mb-8">User Reviews</h2>
      
      <div className="relative">
        <div className={`space-y-6 ${isLocked ? 'blur-sm select-none opacity-50' : ''}`}>
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-surface p-6 rounded-2xl border border-foreground/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-foreground/50">{new Date(review.date || Date.now()).toLocaleDateString()}</p>
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
