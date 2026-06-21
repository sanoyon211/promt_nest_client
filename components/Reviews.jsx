'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Quote } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader for Reviews
const SkeletonReview = () => (
  <div className="bg-surface p-8 md:p-10 rounded-[32px] border border-border shadow-sm animate-pulse flex flex-col h-full">
    <div className="flex gap-1 mb-6">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-5 h-5 bg-foreground/5 rounded-full"></div>)}
    </div>
    <div className="w-full h-4 bg-foreground/5 rounded-md mb-3"></div>
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
          setReviews(data);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        // Updated Typo and added a 3rd dummy review for better grid balance
        setReviews([
          { id: 1, text: "PromptNest transformed my workflow. Finding high-quality prompts is effortless now. Highly recommended for any serious developer.", author: "Sarah W.", role: "Marketer" },
          { id: 2, text: "The quality of AI art prompts here is unmatched. It's a literal goldmine for creators looking to scale their production.", author: "David L.", role: "Digital Artist" },
          { id: 3, text: "We integrated their prompt API into our internal tools and it saved us hundreds of hours of prompt-engineering.", author: "Elena R.", role: "CTO @ TechFlow" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 w-full bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Wall of Love</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Users Say</span>
          </h2>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl mx-auto font-medium">
            Join thousands of creators who are already supercharging their work with our curated prompts.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map(key => <SkeletonReview key={key} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, idx) => (
              <motion.div 
                key={review.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface p-8 md:p-10 rounded-[32px] border border-border relative flex flex-col h-full group hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none"
              >
                {/* Watermark Quote Icon */}
                <div className="absolute top-6 right-6 text-foreground/5 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none">
                  <Quote size={80} strokeWidth={1} className="rotate-12" />
                </div>

                {/* 5-Star Rating */}
                <div className="flex gap-1 mb-6 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg text-text-secondary mb-10 italic relative z-10 leading-relaxed flex-grow">
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}