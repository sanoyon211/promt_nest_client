'use client';
import { useEffect, useState } from 'react';
import PromptCard from './PromptCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts/featured`);
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        // Fallback mock data if backend isn't connected yet
        setPrompts([
          { id: 1, title: 'SEO Optimized Blog Generator', description: 'Create a comprehensive, keyword-rich blog post outline and intro in seconds.', tag: 'Marketing', isPro: false, author: { name: 'Alice' } },
          { id: 2, title: 'Python Code Architect', description: 'Describe your application and let this prompt build the perfect Python class structure.', tag: 'Coding', isPro: true, author: { name: 'Bob' } },
          { id: 3, title: 'Midjourney Cinematic Portrait', description: 'Generates extremely detailed photorealistic portrait prompts with lighting cues.', tag: 'AI Art', isPro: false, author: { name: 'Charlie' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <section className="py-20 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Prompts</h2>
          <p className="text-foreground/60 mt-2">Discover the most popular community creations.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          {prompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </section>
  );
}
