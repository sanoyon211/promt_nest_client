'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Check, X, Trash2, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    fetchPrompts(page);
  }, [searchParams]);

  const fetchPrompts = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/prompts?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.prompts);
        setPagination({ currentPage: data.currentPage, totalPages: data.totalPages });
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      // Realistic Mock Data for Pagination testing
      const mockDB = Array.from({ length: 25 }).map((_, i) => ({
        _id: `p${i + 1}`,
        title: `Mock Moderation Prompt ${i + 1}`,
        category: i % 2 === 0 ? 'Coding' : 'Marketing',
        status: i % 3 === 0 ? 'pending' : (i % 3 === 1 ? 'approved' : 'rejected'),
        featured: i % 5 === 0,
        creator: { name: `Creator ${i % 4 + 1}` },
        createdAt: new Date().toISOString()
      }));
      
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const paginatedItems = mockDB.slice(startIndex, startIndex + limit);
      
      // Artificial delay to show loading state transitioning
      setTimeout(() => {
        setPrompts(paginatedItems);
        setPagination({ currentPage: page, totalPages: Math.ceil(mockDB.length / limit) });
        setLoading(false);
      }, 500);
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      toast.success(`Prompt marked as ${status.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openRejectModal = (id) => {
    setRejectPromptId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      toast.error('Feedback reason is required');
      return;
    }
    try {
      setPrompts(prompts.map(p => p._id === rejectPromptId ? { ...p, status: 'rejected' } : p));
      await fetch(`${API_URL}/admin/prompts/${rejectPromptId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', feedback: rejectReason })
      });
      toast.success('Prompt rejected with feedback');
      setRejectModalOpen(false);
    } catch (err) {
      toast.error('Failed to reject prompt');
    }
  };

  const toggleFeature = async (id, currentFeatured) => {
    const newFeatured = !currentFeatured;
    try {
      setPrompts(prompts.map(p => p._id === id ? { ...p, featured: newFeatured } : p));
      await fetch(`${API_URL}/admin/prompts/${id}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured })
      });
      toast.success(newFeatured ? 'Prompt featured!' : 'Prompt unfeatured');
    } catch (err) {
      toast.error('Failed to update feature status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('CRITICAL WARNING: Are you sure you want to permanently delete this prompt?')) return;
    try {
      setPrompts(prompts.filter(p => p._id !== id));
      await fetch(`${API_URL}/admin/prompts/${id}`, { method: 'DELETE' });
      toast.success('Prompt deleted permanently');
    } catch (err) {
      toast.error('Failed to delete prompt');
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default: return 'bg-foreground/10 text-foreground border border-foreground/20';
    }
  };

  if (loading && prompts.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <>
      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden mb-6 relative min-h-[400px]">
        {loading && prompts.length > 0 && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 pr-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {prompts.map((p) => (
                <tr key={p._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="truncate max-w-[150px] sm:max-w-[250px]">{p.title}</div>
                  </td>
                  <td className="p-4 text-foreground/70">{p.creator?.name || 'Unknown'}</td>
                  <td className="p-4 text-foreground/70">{p.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${getStatusStyle(p.status)}`}>
                      {p.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleFeature(p._id, p.featured)}
                      className={`p-2 rounded-xl transition-transform hover:scale-110 mx-auto block ${p.featured ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-background border border-foreground/10 text-foreground/30 hover:text-foreground/60'}`}
                      title={p.featured ? "Remove Feature Status" : "Mark as Featured"}
                    >
                      <Star size={18} className={p.featured ? "fill-current" : ""} />
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/prompt/${p._id}`} title="View Prompt Content" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-primary transition-colors flex items-center justify-center">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => updateStatus(p._id, 'approved')} title="Approve Prompt" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-green-500 hover:border-green-500 transition-colors">
                        <Check size={16} />
                      </button>
                      <button onClick={() => openRejectModal(p._id)} title="Reject Prompt" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-orange-500 hover:border-orange-500 transition-colors">
                        <X size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} title="Delete Prompt Permanently" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-red-500 hover:border-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prompts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-foreground/50 italic">No prompts found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-surface border border-foreground/10 p-4 rounded-2xl shadow-sm">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="px-6 py-2.5 rounded-xl font-bold border border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2 text-sm font-bold text-foreground/60">
            <span>Page</span>
            <span className="px-3 py-1 bg-background border border-foreground/10 rounded-lg text-foreground">{pagination.currentPage}</span>
            <span>of {pagination.totalPages}</span>
          </div>

          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-6 py-2.5 rounded-xl font-bold bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            Next
          </button>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-foreground/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setRejectModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-foreground/60 hover:text-foreground bg-background rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-foreground mb-2">Reject Prompt</h2>
            <p className="text-sm text-foreground/60 mb-6">Please provide feedback to the creator explaining why this prompt is being rejected.</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Violates community guidelines, low quality, plagiarized..."
              className="w-full bg-background border border-foreground/10 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] mb-6 resize-none"
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                disabled={!rejectReason.trim()}
                className="px-6 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/20"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminPromptsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Prompt Moderation</h1>
        <p className="text-foreground/60">Manage content, approve submissions, and curate the Featured list.</p>
      </div>
      
      {/* 
        Next.js 15 Requirement: 
        Any component using useSearchParams() must be wrapped in a React Suspense boundary 
        to prevent entirely de-optimizing the route during Server-Side Rendering.
      */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
        <PromptsTable />
      </Suspense>
    </div>
  );
}
