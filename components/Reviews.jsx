'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader for the Slider
const SkeletonReview = () => (
  <div className="bg-surface p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-border shadow-sm flex flex-col min-h-[280px] md:min-h-[320px] w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 animate-pulse">
    <div className="flex gap-1 mb-6">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 sm:w-5 h-4 sm:h-5 bg-foreground/5 rounded-full"></div>)}
    </div>
    <div className="w-full h-3 sm:h-4 bg-foreground/5 rounded-md mb-3"></div>
    <div className="w-3/4 h-3 sm:h-4 bg-foreground/5 rounded-md mb-8"></div>
    <div className="flex items-center space-x-4 mt-auto">
      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-foreground/5"></div>
      <div>
        <div className="w-20 sm:w-24 h-3 sm:h-4 bg-foreground/5 rounded-md mb-2"></div>
        <div className="w-14 sm:w-16 h-2 sm:h-3 bg-foreground/5 rounded-md"></div>
      </div>
    </div>
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const formattedReviews = data.map((review, idx) => ({
              id: review._id || idx,
              text: review.comment || review.text || review.message || "",
              author: review.name || (review.email && review.email.split('@')[0]) || "User",
              role: "Community Member",
              rating: review.rating || 5,
              photoURL: review.user?.photoURL || review.photoURL
            }));
            setReviews(formattedReviews);
            return;
          }
        }
        throw new Error('API down or no data');
      } catch (error) {
        setReviews([
          { id: 1, text: "PromptNest transformed my workflow. Finding high-quality prompts is effortless now. Highly recommended!", author: "Sarah W.", role: "Marketer", rating: 5 },
          { id: 2, text: "The quality of AI art prompts here is unmatched. It's a literal goldmine for creators looking to scale.", author: "David L.", role: "Digital Artist", rating: 5 },
          { id: 3, text: "We integrated their prompt API into our internal tools and it saved us hundreds of hours.", author: "Elena R.", role: "CTO @ TechFlow", rating: 5 },
          { id: 4, text: "The community review system ensures I only use battle-tested prompts. Absolutely brilliant platform.", author: "Marcus T.", role: "Software Engineer", rating: 5 },
          { id: 5, text: "I've started monetizing my prompts and the revenue split is incredibly fair. A true creator-first platform.", author: "Sophie M.", role: "AI Researcher", rating: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // JS Auto-Scroll Logic with Infinite Loop
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || loading || reviews.length === 0) return;

    let animationFrameId;

    const autoScroll = () => {
      if (!isInteracting) {
        container.scrollLeft += 0.8; // স্পিড কন্ট্রোল (বাড়াতে চাইলে 1 বা 1.5 দিন)

        // ইনফিনিট লুপ তৈরি করার জন্য: কন্টেইনার অর্ধেক স্ক্রল হয়ে গেলে আবার 0 তে ব্যাক করবে
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, loading, reviews]);

  // ডাবল রিভিউ অ্যারে (যাতে লুপ করার সময় খালি জায়গা না থাকে)
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-16 md:py-24 w-full bg-background relative overflow-hidden">
      {/* CSS to hide scrollbar but keep swipe functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-14">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-4 md:mb-6">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-widest">Wall of Love</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Creators Worldwide</span>
          </h2>
          <p className="mt-4 text-text-secondary font-medium text-sm md:text-base">Tap and drag to explore reviews.</p>
        </motion.div>
      </div>

      {/* Auto-scroll + Swipeable Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_32px,black_calc(100%-32px),transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
        
        {loading ? (
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar px-4 sm:px-6 md:px-12 py-4">
            {[1, 2, 3, 4, 5].map(key => <SkeletonReview key={key} />)}
          </div>
        ) : (
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsInteracting(true)} // মাউস রাখলে থামবে
            onMouseLeave={() => setIsInteracting(false)} // মাউস সরালে চলবে
            onTouchStart={() => setIsInteracting(true)} // মোবাইলে টাচ করলে থামবে
            onTouchEnd={() => setIsInteracting(false)} // টাচ ছেড়ে দিলে চলবে
            className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar px-4 sm:px-6 md:px-12 py-6 cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }} // iOS এ স্মুথ সোয়াইপের জন্য
          >
            {duplicatedReviews.map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`} 
                className="bg-surface p-6 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] border border-border relative flex flex-col min-h-[280px] md:min-h-[320px] w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0 group hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none"
              >
                {/* Watermark Quote Icon */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-foreground/5 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none">
                  <Quote size={60} className="sm:w-20 sm:h-20 rotate-12" strokeWidth={1} />
                </div>

                {/* 5-Star Rating */}
                <div className="flex gap-1 mb-4 sm:mb-6 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      className={`sm:w-[18px] sm:h-[18px] ${star <= (review.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-foreground/10 text-foreground/10"}`} 
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[15px] sm:text-base md:text-lg text-text-secondary mb-6 sm:mb-8 italic relative z-10 leading-relaxed flex-grow select-none">
                  "{review.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 sm:space-x-4 relative z-10 mt-auto pt-5 sm:pt-6 border-t border-border/50">
                  {review.photoURL ? (
                    <img 
                      src={review.photoURL} 
                      alt={review.author} 
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover ring-1 ring-primary/20 shadow-inner flex-shrink-0 pointer-events-none"
                    />
                  ) : (
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold text-base sm:text-lg ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex-shrink-0 pointer-events-none">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-text-primary text-sm sm:text-base pointer-events-none">{review.author}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mt-0.5 sm:mt-1 pointer-events-none">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}