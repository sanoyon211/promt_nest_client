'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, BarChart, Plus, FolderKanban, PenTool } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MyPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/prompts/my-prompts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleDeleteClick = (id) => {
    setPromptToDelete(id);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    try {
      const token = localStorage.getItem('access-token');
      // Optimistic delete
      setPrompts(prompts.filter(p => p._id !== promptToDelete));
      
      await fetch(`${API_URL}/prompts/${promptToDelete}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Prompt deleted successfully', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to delete prompt', { position: "bottom-right" });
    } finally {
      setPromptToDelete(null);
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default: return 'bg-foreground/5 text-text-secondary border-border';
    }
  };

  // Premium Skeleton Table Loader
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full pb-10">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 mb-2 animate-pulse mr-4"></div>
            <div>
              <div className="w-48 h-8 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
              <div className="w-64 h-4 bg-foreground/5 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="w-32 h-10 bg-primary/20 rounded-xl animate-pulse"></div>
        </div>
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden p-5">
          <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full h-16 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
            <FolderKanban size={26} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">My Prompts</h1>
            <p className="text-text-secondary font-medium mt-1">Manage and track the performance of your published workflows.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/add-prompt" 
          className="flex items-center px-6 py-3.5 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] whitespace-nowrap"
        >
          <Plus size={18} className="mr-2" />
          Create New
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          
          {prompts.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <PenTool size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No prompts created</h3>
              <p className="text-text-secondary font-medium max-w-sm mb-8">
                You haven't published any prompts yet. Create your first workflow and share it with the community.
              </p>
              <Link 
                href="/dashboard/add-prompt"
                className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                Create First Prompt
              </Link>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Title</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Copies</th>
                  <th className="p-5">Date Published</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {prompts.map((prompt, idx) => (
                    <motion.tr 
                      key={prompt._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="truncate max-w-[200px] sm:max-w-[250px] group-hover:text-primary transition-colors">
                          {prompt.title}
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {prompt.category}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black border ${getStatusStyle(prompt.status)} uppercase tracking-widest shadow-sm`}>
                          {prompt.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-text-secondary font-bold">
                        {prompt.copyCount || 0}
                      </td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">
                        {new Date(prompt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end space-x-2 transition-opacity duration-300">
                          <Link 
                            href={user?.role?.toLowerCase() === 'creator' ? '/dashboard/creator' : '/dashboard'}
                            title="View Analytics" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all active:scale-95 shadow-sm inline-flex"
                          >
                            <BarChart size={16} />
                          </Link>
                          <Link 
                            href={`/dashboard/prompts/${prompt._id}/edit`} 
                            title="Edit Prompt" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                          >
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(prompt._id)} 
                            title="Delete Prompt" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!promptToDelete}
        title="Delete Prompt?"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPromptToDelete(null)}
        confirmText="Delete Prompt"
      />

      {/* Global Style for Horizontal Scrollbar in Table */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.2); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.4); 
        }
      `}} />
    </div>
  );
}
