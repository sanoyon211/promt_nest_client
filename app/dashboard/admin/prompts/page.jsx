'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Check, X, Trash2, Star, Eye, ShieldCheck, SearchX, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function PromptsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [prompts, setPrompts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: initialPage, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectPromptId, setRejectPromptId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion Modal State
  const [promptToDelete, setPromptToDelete] = useState(null);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    fetchPrompts(page);
  }, [searchParams]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access-token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchPrompts = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/prompts?page=${page}&limit=10`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.data || []);
        setPagination({ currentPage: data.page || 1, totalPages: data.totalPages || 1 });
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      setPrompts([]);
      setPagination({ currentPage: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateStatus = async (id, status) => {
    try {
      setPrompts(prompts.map(p => p._id === id ? { ...p, status } : p));
      await fetch(`${API_URL}/admin/prompts/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      toast.success(`Prompt marked as ${status.toUpperCase()}`, { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to update status', { position: "bottom-right" });
    }
  };

  const openRejectModal = (id) => {
    setRejectPromptId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      toast.error('Feedback reason is required', { position: "bottom-right" });
      return;
    }
    setIsSubmitting(true);
    try {
      setPrompts(prompts.map(p => p._id === rejectPromptId ? { ...p, status: 'rejected' } : p));
      await fetch(`${API_URL}/admin/prompts/${rejectPromptId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'rejected', feedback: rejectReason })
      });
      toast.success('Prompt rejected with feedback', { position: "bottom-right", theme: "dark" });
      setRejectModalOpen(false);
    } catch (err) {
      toast.error('Failed to reject prompt', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = async (id, currentFeatured) => {
    const newFeatured = !currentFeatured;
    try {
      const res = await fetch(`${API_URL}/admin/prompts/${id}/feature`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ featured: newFeatured })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update feature status');
      }

      setPrompts(prompts.map(p => p._id === id ? { ...p, isFeatured: newFeatured } : p));
      toast.success(newFeatured ? 'Prompt featured!' : 'Prompt unfeatured', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error(err.message || 'Failed to update feature status', { position: "bottom-right" });
    }
  };

  const handleDeleteClick = (id) => {
    setPromptToDelete(id);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;
    try {
      setPrompts(prompts.filter(p => p._id !== promptToDelete));
      await fetch(`${API_URL}/admin/prompts/${promptToDelete}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      toast.success('Prompt deleted permanently', { position: "bottom-right", theme: "dark" });
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
  if (loading && prompts.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden p-5 mb-6">
        <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-full h-16 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden mb-8 relative min-h-[400px]">
        
        {/* Loading Overlay for pagination */}
        {loading && prompts.length > 0 && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          {prompts.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <SearchX size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No prompts found</h3>
              <p className="text-text-secondary font-medium max-w-sm">
                There are no prompts matching the current criteria in the moderation queue.
              </p>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Title</th>
                  <th className="p-5">Creator</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">Featured</th>
                  <th className="p-5 pr-8 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {prompts.map((p, idx) => (
                    <motion.tr 
                      key={p._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="truncate max-w-[150px] sm:max-w-[250px] group-hover:text-primary transition-colors">{p.title}</div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">{p.creator?.name || p.author?.name || p.creator?.username || p.author?.username || <span className="italic opacity-50">Unknown</span>}</td>
                      <td className="p-5 text-text-secondary font-medium">{p.category}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusStyle(p.status)}`}>
                          {p.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => toggleFeature(p._id, p.isFeatured)}
                          className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 mx-auto flex shadow-sm ${p.isFeatured ? 'bg-amber-400/10 text-amber-500 border border-amber-400/30' : 'bg-background border border-border text-text-secondary/40 hover:text-amber-500 hover:border-amber-500/30'}`}
                          title={p.isFeatured ? "Remove Feature Status" : "Mark as Featured"}
                        >
                          <Star size={16} className={p.isFeatured ? "fill-current" : ""} />
                        </button>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/prompt/${p._id}`} 
                            title="View Prompt" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
                          >
                            <Eye size={16} />
                          </Link>
                          {p.status !== 'approved' && (
                            <button 
                              onClick={() => updateStatus(p._id, 'approved')} 
                              title="Approve Prompt" 
                              className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-green-500 hover:border-green-500/30 hover:bg-green-500/5 transition-all active:scale-95 shadow-sm"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {p.status !== 'rejected' && (
                            <button 
                              onClick={() => openRejectModal(p._id)} 
                              title="Reject Prompt" 
                              className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all active:scale-95 shadow-sm"
                            >
                              <X size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteClick(p._id)} 
                            title="Delete Permanently" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all active:scale-95 shadow-sm"
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

      {/* Modern Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-surface border border-border p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="px-6 py-3 rounded-xl font-bold border border-border text-text-secondary hover:text-text-primary hover:bg-foreground/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2 text-[13px] font-bold text-text-secondary uppercase tracking-widest">
            <span>Page</span>
            <span className="px-4 py-1.5 bg-background border border-border rounded-lg text-text-primary shadow-inner">{pagination.currentPage}</span>
            <span>of {pagination.totalPages}</span>
          </div>

          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
          >
            Next
          </button>
        </div>
      )}

      {/* Rejection Modal (Framer Motion) */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>

              <button 
                onClick={() => setRejectModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary bg-background border border-border rounded-full transition-colors hover:bg-foreground/5 active:scale-95"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center mb-2">
                <AlertCircle className="text-orange-500 mr-2" size={24} />
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Reject Prompt</h2>
              </div>
              <p className="text-[14px] text-text-secondary font-medium mb-6">Please provide feedback to the creator explaining why this prompt is being rejected.</p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Violates community guidelines, low quality, plagiarized..."
                className="w-full bg-background border border-border rounded-2xl p-5 text-[14px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 min-h-[140px] mb-8 resize-none transition-all placeholder:text-text-secondary/40"
              ></textarea>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setRejectModalOpen(false)}
                  className="px-6 py-3.5 text-[14px] font-bold text-text-secondary hover:text-text-primary hover:bg-foreground/5 rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitRejection}
                  disabled={!rejectReason.trim() || isSubmitting}
                  className="flex items-center px-6 py-3.5 bg-orange-500 text-white text-[14px] font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] active:scale-95 disabled:shadow-none"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                  Submit Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!promptToDelete}
        title="Delete Prompt?"
        message="CRITICAL WARNING: Are you sure you want to permanently delete this prompt? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPromptToDelete(null)}
        confirmText="Delete Prompt"
      />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.02); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.2); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.4); }
      `}} />
    </>
  );
}

export default function AdminPromptsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <ShieldCheck size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Prompt Moderation</h1>
          <p className="text-text-secondary font-medium mt-1">Review submissions, enforce guidelines, and curate the Featured list.</p>
        </div>
      </div>
      
      {/* React Suspense Boundary required for useSearchParams */}
      <Suspense fallback={
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden p-5 mb-6">
          <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-16 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>)}
        </div>
      }>
        <PromptsTable />
      </Suspense>
    </div>
  );
}
