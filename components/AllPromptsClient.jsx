'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import PromptCard from './PromptCard';
import { motion } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal, Library, FileQuestion } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Pro'];
const SORTS = ['Latest', 'Most Popular', 'Most Copied'];

// Premium Skeleton Loader for Grid
const SkeletonCard = () => (
  <div className="w-full h-[320px] bg-surface rounded-2xl border border-border p-5 flex flex-col animate-pulse shadow-sm">
    <div className="w-full h-40 bg-foreground/5 rounded-[16px] mb-5"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="w-16 h-5 bg-foreground/5 rounded-md"></div>
      <div className="w-20 h-5 bg-foreground/5 rounded-md"></div>
    </div>
    <div className="w-3/4 h-6 bg-foreground/5 rounded-md mb-3"></div>
    <div className="w-full h-4 bg-foreground/5 rounded-md mb-2"></div>
    <div className="w-5/6 h-4 bg-foreground/5 rounded-md mb-auto"></div>
    <div className="flex justify-between items-center mt-5 pt-4 border-t border-border/50">
      <div className="w-24 h-8 bg-foreground/5 rounded-full"></div>
      <div className="w-9 h-9 bg-foreground/5 rounded-full"></div>
    </div>
  </div>
);

export default function AllPromptsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const [categories, setCategories] = useState(['All', 'Coding', 'Marketing', 'SEO', 'Copywriting', 'Design', 'Business']);
  const [aiTools, setAiTools] = useState(['All', 'ChatGPT', 'Claude 3.5 Sonnet', 'Midjourney', 'Gemini']);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts/filters`);
        if (res.ok) {
          const data = await res.json();
          const mergedCategories = Array.from(new Set(['All', 'Coding', 'Marketing', 'SEO', 'Copywriting', 'Design', 'Business', ...data.categories]));
          const mergedTools = Array.from(new Set(['All', 'ChatGPT', 'Claude 3.5 Sonnet', 'Midjourney', 'Gemini', ...data.aiTools]));
          
          setCategories(mergedCategories);
          setAiTools(mergedTools);
        }
      } catch (error) {
        console.error("Failed to fetch filters", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, tool, level, sort]);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category !== 'All') params.set('category', category);
    if (tool !== 'All') params.set('tool', tool);
    if (level !== 'All') params.set('level', level);
    if (sort !== 'Latest') params.set('sort', sort);
    if (page > 1) params.set('page', page);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, category, tool, level, sort, page, pathname, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams.toString());

        // 🚀 Adding Strict Limit of 12 items per page for the backend
        queryParams.set('limit', '12');

        const res = await fetch(`${API_URL}/prompts?${queryParams.toString()}`);

        if (res.ok) {
          const data = await res.json();
          setPrompts(data.data || data);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error('API down');
        }
      } catch (error) {
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
    <div className="w-full min-h-screen bg-background pb-20">

      {/* Page Header Area */}
      <div className="bg-surface border-b border-border pt-12 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Library size={14} />
                Explore Library
              </div>
              {/* 🎨 Updated Title with Gradient */}
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-3">
                All <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Prompts</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-xl font-medium">Discover, filter, and find the perfect AI prompts for your next big project.</p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-[400px] relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center bg-background border border-border rounded-2xl overflow-hidden shadow-sm transition-all focus-within:border-primary/50">
                <div className="pl-4 pr-2 text-text-secondary">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search titles, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-3.5 bg-transparent focus:outline-none text-text-primary text-base placeholder:text-text-secondary/50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Premium Filter and Sort UI */}
          <div className="flex flex-col lg:flex-row gap-4 items-center bg-background/50 p-2 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 px-3 text-text-secondary hidden lg:flex">
              <SlidersHorizontal size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
            </div>

            <div className="flex flex-wrap flex-1 gap-3 w-full">
              {/* Category Dropdown */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-surface text-text-primary border border-border rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold cursor-pointer hover:border-text-secondary/30 transition-colors"
                >
                  <option value="All">All Categories</option>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>

              {/* Tool Dropdown */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full appearance-none bg-surface text-text-primary border border-border rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold cursor-pointer hover:border-text-secondary/30 transition-colors"
                >
                  <option value="All">All AI Tools</option>
                  {aiTools.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>

              {/* Difficulty Dropdown */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full appearance-none bg-surface text-text-primary border border-border rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold cursor-pointer hover:border-text-secondary/30 transition-colors"
                >
                  <option value="All">All Difficulties</option>
                  {LEVELS.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-1 min-w-[140px] lg:ml-auto lg:flex-none lg:w-48">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-surface text-text-primary border border-border rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {SORTS.map(s => <option key={s} value={s}>Sort: {s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Show up to 12 Skeletons perfectly aligned */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(key => <SkeletonCard key={key} />)}
          </div>
        ) : (
          <>
            {prompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                {prompts.map((prompt, idx) => (
                  <motion.div
                    key={prompt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <PromptCard prompt={prompt} />
                  </motion.div>
                ))}
              </div>
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center bg-surface/50 border border-dashed border-border rounded-3xl"
              >
                <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 text-text-secondary">
                  <FileQuestion size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">No Prompts Found</h3>
                <p className="text-text-secondary max-w-md font-medium">
                  We couldn't find any prompts matching your exact filters. Try adjusting your search criteria or categories.
                </p>
                <button
                  onClick={() => {
                    setSearch(''); setCategory('All'); setTool('All'); setLevel('All');
                  }}
                  className="mt-6 px-6 py-2.5 bg-surface border border-border rounded-full text-sm font-bold text-text-primary hover:border-primary/50 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Premium Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-border">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-border bg-surface text-text-primary text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/5 transition-colors"
                >
                  Prev
                </button>

                <div className="flex gap-2 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${page === p
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-surface text-text-secondary border border-border hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-border bg-surface text-text-primary text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/5 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}