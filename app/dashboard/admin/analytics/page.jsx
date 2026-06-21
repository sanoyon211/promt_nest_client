'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Star, Copy, TrendingUp, BarChart2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

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
    primary: '#4F46E5', // Indigo
    secondary: '#DB2777', // Pink
    grid: isDark ? '#334155' : '#E2E8F0',
    surface: isDark ? '#1E1B2E' : '#FFFFFF',
    text: isDark ? '#F1F0F8' : '#1E1B2E'
  };

  // Prevent hydration mismatch
  if (!mounted) return <div className="min-h-screen"></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  // Premium Skeleton Loader
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full pb-10">
        <div className="mb-10 flex items-center">
          <div className="w-14 h-14 rounded-[16px] bg-primary/10 mb-2 animate-pulse mr-5"></div>
          <div>
            <div className="w-64 h-8 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
            <div className="w-48 h-4 bg-foreground/5 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface p-8 rounded-[24px] border border-border shadow-sm h-[160px] animate-pulse">
              <div className="w-full flex justify-between mb-4">
                <div className="w-24 h-4 bg-foreground/5 rounded-md"></div>
                <div className="w-10 h-10 bg-foreground/5 rounded-xl"></div>
              </div>
              <div className="w-16 h-10 bg-foreground/5 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="bg-surface p-8 rounded-[32px] border border-border shadow-sm h-[450px] animate-pulse"></div>
      </div>
    );
  }

  const summaryCards = [
    { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-primary', glow: 'bg-primary/10', trend: '+12% this month' },
    { title: 'Total Prompts', value: stats.totalPrompts || 0, icon: FileText, color: 'text-accent', glow: 'bg-accent/10', trend: '+24% this month' },
    { title: 'Total Reviews', value: stats.totalReviews || 0, icon: Star, color: 'text-yellow-500 dark:text-yellow-400', glow: 'bg-yellow-500/10' },
    { title: 'Total Copies', value: stats.totalCopies || 0, icon: Copy, color: 'text-text-secondary', glow: 'bg-foreground/5' }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <BarChart2 size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Platform Analytics</h1>
          <p className="text-text-secondary font-medium mt-1">Global aggregated metrics and growth data from MongoDB.</p>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              className="bg-surface p-6 xl:p-8 rounded-[24px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${card.glow}`}></div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest">{card.title}</h3>
                <div className={`w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={20} strokeWidth={2} />
                </div>
              </div>
              <p className="text-4xl font-black text-text-primary">{card.value.toLocaleString()}</p>
              {card.trend && (
                <p className="text-[11px] font-bold text-green-600 dark:text-green-400 mt-3 flex items-center uppercase tracking-wider">
                  <TrendingUp size={14} className="mr-1.5" /> {card.trend}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Platform Growth Chart */}
        <motion.div variants={itemVariants} className="bg-surface p-6 sm:p-8 md:p-10 rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
          <h2 className="text-lg font-bold text-text-primary mb-8">Platform Growth (6 Mo)</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '16px', padding: '12px 16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" name="Users" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="prompts" name="Prompts" stroke={COLORS.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorPrompts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}