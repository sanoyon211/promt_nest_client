'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Layers, Award, Medal, Copy } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader for Creators
const SkeletonCreator = () => (
  <div className="bg-surface rounded-3xl p-6 border border-border flex items-center space-x-5 shadow-sm animate-pulse">
    <div className="w-16 h-16 rounded-full bg-foreground/5 flex-shrink-0"></div>
    <div className="flex-1">
      <div className="w-32 h-6 bg-foreground/5 rounded-md mb-3"></div>
      <div className="w-24 h-5 bg-foreground/5 rounded-full mb-3"></div>
      <div className="w-20 h-4 bg-foreground/5 rounded-md"></div>
    </div>
  </div>
);

export default function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch(`${API_URL}/creators/top`);
        if (res.ok) {
          const data = await res.json();
          // Assuming we want top 6 for a balanced grid
          setCreators(data.slice(0, 6));
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        // Fallback dummy data if API is not ready
        setCreators([
          { id: 1, name: 'Alice Smith', role: 'Pro Creator', prompts: 120, totalCopies: 450 },
          { id: 2, name: 'David Chen', role: 'Pro Creator', prompts: 95, totalCopies: 320 },
          { id: 3, name: 'Sarah Wilson', role: 'Creator', prompts: 85, totalCopies: 210 },
          { id: 4, name: 'Bob Jones', role: 'Creator', prompts: 64, totalCopies: 150 },
          { id: 5, name: 'Emma Davis', role: 'Creator', prompts: 42, totalCopies: 95 },
          { id: 6, name: 'Charlie Day', role: 'Creator', prompts: 38, totalCopies: 70 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  // Function to render rank medals for top 3
  const renderRank = (index) => {
    switch(index) {
      case 0: return <Trophy size={18} className="text-yellow-500 absolute -top-2 -right-2 bg-yellow-500/10 p-1 rounded-full box-content" />;
      case 1: return <Medal size={18} className="text-gray-400 absolute -top-2 -right-2 bg-gray-400/10 p-1 rounded-full box-content" />;
      case 2: return <Award size={18} className="text-amber-700 dark:text-amber-600 absolute -top-2 -right-2 bg-amber-700/10 p-1 rounded-full box-content" />;
      default: return null;
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background w-full relative">
      {/* Subtle background separation */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

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
            <Trophy size={14} className="text-accent" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Hall of Fame</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Creators</span>
          </h2>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl mx-auto font-medium">
            Meet the masterminds behind the most effective and popular AI prompts in our community.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((key) => <SkeletonCreator key={key} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {creators.map((creator, idx) => (
              <motion.div 
                key={creator.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface rounded-3xl p-6 border border-border flex items-center space-x-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative"
              >
                {/* Avatar with Rank */}
                <div className="relative">
                  {creator.photoURL || creator.image ? (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300 relative overflow-hidden">
                      <Image 
                        src={creator.photoURL || creator.image} 
                        alt={creator.name || "Creator"} 
                        fill
                        sizes="(max-width: 64px) 100vw, 64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-2 ring-transparent group-hover:ring-primary/20">
                      {creator.name ? creator.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  {renderRank(idx)}
                </div>

                {/* Creator Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text-primary mb-1 truncate group-hover:text-primary transition-colors">
                    {creator.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {creator.role === 'Pro Creator' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20 uppercase tracking-wider">
                        <Crown size={10} strokeWidth={3} />
                        Pro
                      </span>
                    ) : (
                      <span className="inline-flex text-[10px] font-bold text-text-secondary bg-foreground/5 px-2.5 py-1 rounded-md border border-border uppercase tracking-wider">
                        Creator
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-text-secondary font-semibold flex items-center gap-1">
                      <Layers size={12} />
                      {creator.prompts} Prompts
                    </p>
                    <div className="w-1 h-1 rounded-full bg-border"></div>
                    <p className="text-xs text-text-secondary font-semibold flex items-center gap-1">
                      <Copy size={12} />
                      {creator.totalCopies || 0} Copied
                    </p>
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