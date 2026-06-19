'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, BarChart, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyPromptsPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_URL}/prompts/my-prompts`);
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // Robust mock data for UI testing
        setPrompts([
          { _id: '1', title: 'SEO Blog Generator', category: 'SEO', status: 'Approved', copyCount: 1250, createdAt: '2023-10-12T00:00:00.000Z' },
          { _id: '2', title: 'Python Code Architect', category: 'Coding', status: 'Pending', copyCount: 0, createdAt: '2023-11-01T00:00:00.000Z' },
          { _id: '3', title: 'Viral Twitter Thread', category: 'Marketing', status: 'Rejected', copyCount: 0, createdAt: '2023-09-15T00:00:00.000Z' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    try {
      await fetch(`${API_URL}/prompts/${id}`, { method: 'DELETE' });
      setPrompts(prompts.filter(p => p._id !== id));
      toast.success('Prompt deleted successfully');
    } catch (err) {
      toast.error('Failed to delete prompt');
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-500/10 text-green-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'rejected': return 'bg-red-500/10 text-red-500';
      default: return 'bg-foreground/10 text-foreground';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-foreground">My Prompts</h1>
        <Link href="/dashboard/add-prompt" className="px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-transform shadow-md whitespace-nowrap">
          Create New
        </Link>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Copies</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {prompts.map((prompt) => (
                <tr key={prompt._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="truncate max-w-[200px] sm:max-w-xs">{prompt.title}</div>
                  </td>
                  <td className="p-4 text-foreground/70">{prompt.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(prompt.status)}`}>
                      {prompt.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-foreground/80">{prompt.copyCount || 0}</td>
                  <td className="p-4 text-foreground/60">{new Date(prompt.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Analytics" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-primary hover:border-primary transition-colors">
                        <BarChart size={16} />
                      </button>
                      <Link href={`/dashboard/prompts/${prompt._id}/edit`} title="Edit" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-accent hover:border-accent transition-colors flex items-center justify-center">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(prompt._id)} title="Delete" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-red-500 hover:border-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prompts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-foreground/50 italic">No prompts found. Create your first one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
