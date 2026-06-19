'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch(`${API_URL}/creators/top`);
        if (res.ok) {
          const data = await res.json();
          setCreators(data);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        setCreators([
          { id: 1, name: 'Alice Smith', role: 'Pro Creator', prompts: 120 },
          { id: 2, name: 'Bob Jones', role: 'Creator', prompts: 85 },
          { id: 3, name: 'Charlie Day', role: 'Creator', prompts: 42 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section className="py-24 bg-foreground/5 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-16">Top Creators</h2>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator, idx) => (
              <motion.div 
                key={creator.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-surface rounded-3xl p-6 border border-foreground/10 flex items-center space-x-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
                  {creator.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{creator.name}</h3>
                  {creator.role === 'Pro Creator' ? (
                     <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Pro Creator</span>
                  ) : (
                     <span className="text-xs font-bold text-primary bg-[#ECEBF3] dark:bg-[#232040] dark:text-[#818CF8] px-3 py-1 rounded-full">Creator</span>
                  )}
                  <p className="text-sm text-foreground/60 mt-2 font-medium">{creator.prompts} Prompts</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
