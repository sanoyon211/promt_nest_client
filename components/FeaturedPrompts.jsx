'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Library } from 'lucide-react';
import PromptCard from './PromptCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader Component
const SkeletonCard = () => (
  <div className="w-full h-[320px] bg-surface rounded-2xl border border-border p-6 flex flex-col animate-pulse shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="w-24 h-6 bg-foreground/5 rounded-full"></div>
      <div className="w-8 h-8 bg-foreground/5 rounded-full"></div>
    </div>
    <div className="w-full h-8 bg-foreground/5 rounded-lg mb-3"></div>
    <div className="w-3/4 h-8 bg-foreground/5 rounded-lg mb-6"></div>
    <div className="w-full h-16 bg-foreground/5 rounded-xl mb-auto"></div>
    <div className="flex justify-between items-center mt-6 pt-5 border-t border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-foreground/5 rounded-full"></div>
        <div className="w-20 h-4 bg-foreground/5 rounded-md"></div>
      </div>
      <div className="w-16 h-6 bg-foreground/5 rounded-md"></div>
    </div>
  </div>
);

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts?limit=6`);
        if (res.ok) {
          const json = await res.json();
          const fetchedPrompts = json.data || json;
          
          if (fetchedPrompts && fetchedPrompts.length > 0) {
            setPrompts(fetchedPrompts.slice(0, 6));
          } else {
            setPrompts([]);
          }
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <section className="py-24 w-full max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10 shadow-sm">
          <Sparkles size={14} className="text-primary" />
          Handpicked
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Prompts</span>
        </h2>
        <p className="text-text-secondary mt-5 text-lg md:text-xl max-w-2xl font-medium">
          Discover the most popular and highly-rated community creations to supercharge your workflow.
        </p>
      </motion.div>
      
      {loading ? (
        // Premium Skeleton Grid Setup
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <SkeletonCard key={key} />
          ))}
        </div>
      ) : prompts.length > 0 ? (
        // Actual Prompts Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          {prompts.map((prompt, idx) => (
            <motion.div
              key={prompt._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full flex"
            >
              <div className="w-full hover:-translate-y-1 transition-transform duration-300">
                <PromptCard prompt={prompt} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty State Handler
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-3xl mx-4 sm:mx-6 lg:mx-8 bg-surface/50"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Library size={32} />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">No Prompts Found</h3>
          <p className="text-text-secondary max-w-md">
            Looks like the database is empty right now. Be the first to share an amazing prompt!
          </p>
        </motion.div>
      )}
    </section>
  );
}