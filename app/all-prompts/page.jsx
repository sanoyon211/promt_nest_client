'use client';
import { useState, useEffect } from 'react';
import PromptCard from '@/components/PromptCard';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AllPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllPrompts = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts`);
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        // High-quality mock data covering all required fields (Category, Tool, Copy Count, Name, Badges)
        setPrompts([
          { id: 1, title: 'SEO Optimized Blog Generator', description: 'Create a comprehensive, keyword-rich blog post outline and intro in seconds.', level: 'Beginner', category: 'Marketing', aiTool: 'ChatGPT', copyCount: 1250, author: { name: 'Alice' } },
          { id: 2, title: 'Python Code Architect', description: 'Describe your application and let this prompt build the perfect Python class structure.', level: 'Pro', category: 'Coding', aiTool: 'Claude 3.5 Sonnet', copyCount: 840, author: { name: 'Bob' } },
          { id: 3, title: 'Cinematic Portrait Prompt', description: 'Generates extremely detailed photorealistic portrait prompts with lighting cues.', level: 'Public', category: 'AI Art', aiTool: 'Midjourney v6', copyCount: 3200, author: { name: 'Charlie' } },
          { id: 4, title: 'Cold Email Outreach', description: 'Write a high-converting cold email tailored to B2B SaaS decision makers.', level: 'Beginner', category: 'Sales', aiTool: 'ChatGPT', copyCount: 410, author: { name: 'Diana' } },
          { id: 5, title: 'React Performance Audit', description: 'Paste your React component and get a detailed performance and render cycle audit.', level: 'Pro', category: 'Web Dev', aiTool: 'Claude 3.5 Sonnet', copyCount: 150, author: { name: 'Evan' } },
          { id: 6, title: 'Fantasy World Map Generation', description: 'Strict parameters for generating cohesive fantasy maps with natural geography.', level: 'Public', category: 'Worldbuilding', aiTool: 'Midjourney v6', copyCount: 980, author: { name: 'Fiona' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrompts();
  }, []);

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-3">All Prompts</h1>
          <p className="text-lg text-foreground/60">Explore our extensive library of high-quality AI prompts.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search prompts or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-foreground/10 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground shadow-sm"
          />
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrompts.map((prompt, idx) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="h-full"
            >
              <PromptCard prompt={prompt} />
            </motion.div>
          ))}
          {filteredPrompts.length === 0 && (
            <div className="col-span-full py-20 text-center text-foreground/50 text-lg">
              No prompts found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
