'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPrompts: 0, totalBookmarks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access-token');
        if (!token) return;
        const res = await fetch(`${API_URL}/user/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch user stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
            <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Total Prompts</h3>
            <p className="text-4xl font-black text-foreground">{stats.totalPrompts}</p>
          </div>
          <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
            <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Total Bookmarks</h3>
            <p className="text-4xl font-black text-foreground">{stats.totalBookmarks}</p>
          </div>
          <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10"></div>
            <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Account Status</h3>
            <p className="text-4xl font-black text-accent">{user?.subscription === 'Premium' ? 'Premium' : 'Active'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
