'use client';
import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CopiedPromptsPage() {
  const { user } = useAuth();
  const [copiedPrompts, setCopiedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCopied = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/user/copied`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCopiedPrompts(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setCopiedPrompts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCopied();
  }, []);

  const getTierStyle = (tier) => {
    if (tier?.toLowerCase() === 'private') return 'bg-[#E5E3F0] text-[#1E1B2E] dark:bg-[#18162B] dark:text-[#E5E3F0]';
    return 'bg-[#ECEBF3] text-[#232040] dark:bg-[#232040] dark:text-[#ECEBF3]';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Copied Prompts</h1>
        <p className="text-foreground/60">A history of all the prompts you have copied for quick access.</p>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Prompt Title</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Date Copied</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {copiedPrompts.map((item) => (
                <tr key={item._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="truncate max-w-[200px] sm:max-w-xs">{item.prompt?.title || 'Unknown Prompt'}</div>
                  </td>
                  <td className="p-4 text-foreground/70">{item.prompt?.creator?.name || 'Unknown'}</td>
                  <td className="p-4 text-foreground/70">{item.prompt?.category || 'General'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierStyle(item.prompt?.tier)} uppercase`}>
                      {item.prompt?.tier || 'Public'}
                    </span>
                  </td>
                  <td className="p-4 text-foreground/60">{new Date(item.copiedAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/prompt/${item.prompt?._id}`} title="View Details" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-primary hover:border-primary transition-colors flex items-center justify-center">
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {copiedPrompts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-foreground/50 italic">You haven't copied any prompts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
