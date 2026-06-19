'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Star, Copy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminAnalyticsPage() {
  const { theme, systemTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalPrompts: 0, totalReviews: 0, totalCopies: 0, chartData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  const COLORS = {
    primary: isDark ? '#818CF8' : '#4F46E5',     
    secondary: isDark ? '#F472B6' : '#DB2777',   
    grid: '#9B94B8',                             
    surface: isDark ? '#1E1B2E' : '#FFFFFF',
    text: isDark ? '#F1F0F8' : '#1E1B2E'
  };

  if (!mounted) return <div className="min-h-screen"></div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Platform Analytics</h1>
        <p className="text-foreground/60">Global aggregated metrics from MongoDB.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Users</h3>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-green-500 font-bold mt-2 flex items-center">
            <TrendingUp size={14} className="mr-1" /> +12% this month
          </p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Prompts</h3>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <FileText size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalPrompts.toLocaleString()}</p>
          <p className="text-xs text-green-500 font-bold mt-2 flex items-center">
            <TrendingUp size={14} className="mr-1" /> +24% this month
          </p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Reviews</h3>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Star size={20} className="fill-current" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalReviews.toLocaleString()}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Copies</h3>
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/60">
              <Copy size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalCopies.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-foreground/10 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-6">Platform Growth (6 Mo)</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.2} vertical={false} />
              <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', padding: '12px' }}
              />
              <Area type="monotone" dataKey="users" name="Users" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="prompts" name="Prompts" stroke={COLORS.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorPrompts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
