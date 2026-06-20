'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PromptCard from './PromptCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        // Fetching from the standard /prompts route since backend doesn't have /prompts/featured
        const res = await fetch(`${API_URL}/prompts?limit=6`);
        if (res.ok) {
          const json = await res.json();
          const fetchedPrompts = json.data || json;
          
          if (fetchedPrompts && fetchedPrompts.length > 0) {
            // Show real prompts from DB (up to 6)
            setPrompts(fetchedPrompts.slice(0, 6));
          } else {
            // Show dummy prompts ONLY if the database is currently empty
            throw new Error('No prompts yet');
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-end mb-12 px-4 sm:px-6 lg:px-8"
      >
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Featured Prompts</h2>
          <p className="text-foreground/60 mt-4 text-lg">Discover the most popular community creations.</p>
        </div>
      </motion.div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          {prompts.map((prompt, idx) => (
            <motion.div
              key={prompt._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full"
            >
              <PromptCard prompt={prompt} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
