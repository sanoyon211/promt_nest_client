'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader for the Slider
const SkeletonReview = () => (
  <div className="bg-surface p-8 rounded-[32px] border border-border shadow-sm flex flex-col h-[300px] w-[350px] md:w-[400px] flex-shrink-0 animate-pulse">
    <div className="flex gap-1 mb-6">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-5 h-5 bg-foreground/5 rounded-full"></div>)}
    </div>
    <div className="w-full h-4 bg-foreground/5 rounded-md mb-3"></div>
    <div className="w-3/4 h-4 bg-foreground/5 rounded-md mb-8"></div>
    <div className="flex items-center space-x-4 mt-auto">
      <div className="w-12 h-12 rounded-full bg-foreground/5"></div>
      <div>
        <div className="w-24 h-4 bg-foreground/5 rounded-md mb-2"></div>
        <div className="w-16 h-3 bg-foreground/5 rounded-md"></div>
      </div>
    </div>
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Map backend fields to frontend expected fields
            const formattedReviews = data.map((review, idx) => ({
              id: review._id || idx,
              text: review.comment,
              author: review.name || review.email.split('@')[0],
              role: "Community Member", // Default role since role isn't in DB
              rating: review.rating || 5
            }));
            setReviews(formattedReviews);
            return; // Successful fetch
          }
        }
        throw new Error('API down or no data');
      } catch (error) {
        // Fallback dummy data if API fails or is empty
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

  // Duplicate the reviews array to create an infinite loop effect seamlessly
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 w-full bg-background relative overflow-hidden">
      {/* Inline CSS for the infinite marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Wall of Love</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Creators Worldwide</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Slider Container with Fade Edges */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        
        {loading ? (
          <div className="flex gap-6 md:gap-8 w-max px-4">
            {[1, 2, 3, 4, 5].map(key => <SkeletonReview key={key} />)}
          </div>
        ) : (
          <div className="flex gap-6 md:gap-8 w-max animate-marquee hover:[animation-play-state:paused] py-4">
            {duplicatedReviews.map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`} 
                className="bg-surface p-8 md:p-10 rounded-[32px] border border-border relative flex flex-col h-[320px] w-[350px] md:w-[420px] flex-shrink-0 group hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none"
              >
                {/* Watermark Quote Icon */}
                <div className="absolute top-6 right-6 text-foreground/5 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none">
                  <Quote size={80} strokeWidth={1} className="rotate-12" />
                </div>

                {/* 5-Star Rating (Dynamic) */}
                <div className="flex gap-1 mb-6 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={star <= (review.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-foreground/10 text-foreground/10"} 
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base md:text-lg text-text-secondary mb-8 italic relative z-10 leading-relaxed flex-grow">
                  "{review.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 relative z-10 mt-auto pt-6 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold text-lg ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{review.author}</p>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">{review.role}</p>
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