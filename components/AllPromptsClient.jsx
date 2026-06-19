'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import PromptCard from '@/components/PromptCard';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All', 'Marketing', 'Coding', 'AI Art', 'Sales', 'Web Dev', 'Worldbuilding'];
const AI_TOOLS = ['All', 'ChatGPT', 'Claude 3.5 Sonnet', 'Midjourney v6'];
const LEVELS = ['All', 'Beginner', 'Pro', 'Public'];
const SORTS = ['Latest', 'Most Popular', 'Most Copied'];

export default function AllPromptsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state strictly from URL params on mount
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialTool = searchParams.get('tool') || 'All';
  const initialLevel = searchParams.get('level') || 'All';
  const initialSort = searchParams.get('sort') || 'Latest';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [tool, setTool] = useState(initialTool);
  const [level, setLevel] = useState(initialLevel);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [prompts, setPrompts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Debounce Search Logic (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page to 1 if any filter (besides page) changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, tool, level, sort]);

  // Sync state to Next.js URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category !== 'All') params.set('category', category);
    if (tool !== 'All') params.set('tool', tool);
    if (level !== 'All') params.set('level', level);
    if (sort !== 'Latest') params.set('sort', sort);
    if (page > 1) params.set('page', page);

    const newUrl = `${pathname}?${params.toString()}`;
    // Use replace to avoid stacking infinite history states when typing search
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, category, tool, level, sort, page, pathname, router]);

  // Trigger URL sync whenever state changes
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Fetch Data tracking searchParams (Server-side mapping)
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams.toString());
        // Call Express Backend with full query string map
        const res = await fetch(`${API_URL}/prompts?${queryParams.toString()}`);
        
        if (res.ok) {
          const data = await res.json();
          // Map backend format safely
          setPrompts(data.data || data);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
        // Fallback to empty state if backend is down or empty
        setPrompts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-3">All Prompts</h1>
          <p className="text-lg text-foreground/60">Explore our extensive library of high-quality AI prompts.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search titles, tools, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-foreground/10 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground shadow-sm"
          />
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter and Sort UI */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10 bg-surface p-5 rounded-2xl border border-foreground/5 shadow-sm">
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="bg-background text-foreground border border-foreground/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={tool} 
          onChange={(e) => setTool(e.target.value)}
          className="bg-background text-foreground border border-foreground/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium w-full sm:w-auto"
        >
          <option value="All">All AI Tools</option>
          {AI_TOOLS.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select 
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
          className="bg-background text-foreground border border-foreground/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium w-full sm:w-auto"
        >
          <option value="All">All Difficulties</option>
          {LEVELS.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="bg-background text-foreground border border-foreground/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium w-full sm:w-auto sm:ml-auto"
        >
          {SORTS.map(s => <option key={s} value={s}>Sort: {s}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[400px]">
            {prompts.map((prompt, idx) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="h-full"
              >
                <PromptCard prompt={prompt} />
              </motion.div>
            ))}
            {prompts.length === 0 && (
              <div className="col-span-full py-20 text-center text-foreground/50 text-lg flex flex-col items-center">
                <svg className="w-16 h-16 mb-4 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No prompts found matching your exact criteria.
              </div>
            )}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8 pt-8 border-t border-foreground/5">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-xl border border-foreground/10 bg-surface text-foreground font-medium disabled:opacity-50 hover:bg-foreground/5 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-2 mx-4 overflow-x-auto px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all flex-shrink-0 ${
                      page === p 
                        ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-surface text-foreground border border-foreground/10 hover:bg-foreground/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-5 py-2.5 rounded-xl border border-foreground/10 bg-surface text-foreground font-medium disabled:opacity-50 hover:bg-foreground/5 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
