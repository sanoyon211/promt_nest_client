'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Copy, Star, DollarSign, FileText } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const defaultDailyCopies = [
  { day: 'Mon', copies: 0 },
  { day: 'Tue', copies: 0 },
  { day: 'Wed', copies: 0 },
  { day: 'Thu', copies: 0 },
  { day: 'Fri', copies: 0 },
  { day: 'Sat', copies: 0 },
  { day: 'Sun', copies: 0 },
];

export default function CreatorAnalyticsPage() {
  const { theme, systemTheme } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPrompts: 0, totalCopies: 0, totalBookmarks: 0, chartData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/creator/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Strict Color Logic from Requirements
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  const COLORS = {
    primary: isDark ? '#818CF8' : '#4F46E5',     // Indigo (Primary Line)
    secondary: isDark ? '#F472B6' : '#DB2777',   // Pink Accent (Secondary Bar)
    grid: '#9B94B8',                             // Neutral 
    surface: isDark ? '#1E1B2E' : '#FFFFFF',
    text: isDark ? '#F1F0F8' : '#1E1B2E'
  };

  // Prevent hydration mismatch for Next-Themes and Recharts
  if (!mounted) return <div className="min-h-screen"></div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Creator Analytics</h1>
        <p className="text-foreground/60">Track your prompt performance and earnings.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Copies</h3>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Copy size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalCopies}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Total Bookmarks</h3>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Star size={20} className="fill-current" />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalBookmarks}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/60 font-bold tracking-wide uppercase text-xs">Published Prompts</h3>
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/60">
              <FileText size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{loading ? '...' : stats.totalPrompts}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Prompt Growth Chart (Area) */}
        <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-foreground/10 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Prompt Growth (6 Mo)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.2} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: COLORS.primary, fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="prompts" stroke={COLORS.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorPrompts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Copies Chart (Bar) */}
        <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-foreground/10 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Total Copies (This Week)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultDailyCopies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.2} vertical={false} />
                <XAxis dataKey="day" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: COLORS.secondary, fontWeight: 'bold' }}
                  cursor={{fill: COLORS.grid, opacity: 0.1}}
                />
                <Bar dataKey="copies" fill={COLORS.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
