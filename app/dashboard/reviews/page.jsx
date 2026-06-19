'use client';
import { useState, useEffect } from 'react';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/user/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // Mock data fallback
        setReviews([
          { _id: 'r1', prompt: { _id: '2', title: 'Python Code Architect' }, rating: 5, text: 'Amazing structure, saves me hours every week!', createdAt: '2023-11-06T00:00:00.000Z' },
          { _id: 'r2', prompt: { _id: '8', title: 'Next.js Boilerplate Gen' }, rating: 4, text: 'Very useful but sometimes requires manual tweaking for Tailwind v4.', createdAt: '2023-10-22T00:00:00.000Z' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r._id !== id));
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">My Reviews</h1>
        <p className="text-foreground/60">Manage feedback you've left on prompts.</p>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Prompt Title</th>
                <th className="p-4">Rating</th>
                <th className="p-4 min-w-[200px]">Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="truncate max-w-[150px] sm:max-w-[200px]">{review.prompt?.title || 'Unknown Prompt'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-foreground/20'} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-foreground/70">
                    <div className="truncate max-w-[200px] sm:max-w-xs italic text-xs leading-relaxed" title={review.text}>
                      "{review.text}"
                    </div>
                  </td>
                  <td className="p-4 text-foreground/60">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/prompt/${review.prompt?._id}`} title="View Prompt" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-primary hover:border-primary transition-colors flex items-center justify-center">
                        <ExternalLink size={16} />
                      </Link>
                      <button onClick={() => handleDelete(review._id)} title="Delete Review" className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-red-500 hover:border-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-foreground/50 italic">You haven't reviewed any prompts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
