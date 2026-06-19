'use client';
import { useEffect, useState } from 'react';

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
    <section className="py-20 bg-foreground/5 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Top Creators</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map(creator => (
              <div key={creator.id} className="bg-surface rounded-2xl p-6 border border-foreground/10 flex items-center space-x-4 shadow-sm hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                  {creator.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{creator.name}</h3>
                  {creator.role === 'Pro Creator' ? (
                     <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">Pro Creator</span>
                  ) : (
                     <span className="text-xs font-bold text-primary bg-[#ECEBF3] dark:bg-[#232040] dark:text-[#818CF8] px-2 py-0.5 rounded-full">Creator</span>
                  )}
                  <p className="text-sm text-foreground/60 mt-2">{creator.prompts} Prompts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
