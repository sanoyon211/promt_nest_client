'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { FileText, Bookmark, Zap, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const defaultDailyCopies = [
  { day: 'Mon', copies: 0 }, { day: 'Tue', copies: 0 },
  { day: 'Wed', copies: 0 }, { day: 'Thu', copies: 0 },
  { day: 'Fri', copies: 0 }, { day: 'Sat', copies: 0 },
  { day: 'Sun', copies: 0 },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [stats, setStats] = useState({ totalPrompts: 0, totalBookmarks: 0 });
  const [creatorStats, setCreatorStats] = useState(null);
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

        // Fetch analytics for charts for all users
        const creatorRes = await fetch(`${API_URL}/creator/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (creatorRes.ok) {
            const creatorData = await creatorRes.json();
            setCreatorStats(creatorData);
          }
      } catch (err) {
        console.error("Failed to fetch user stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const isPremium = user?.subscription?.toLowerCase() === 'premium';
  const showCharts = !!creatorStats;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const COLORS = {
    primary: '#4F46E5', // Indigo
    secondary: '#DB2777', // Pink
    grid: isDark ? '#334155' : '#E2E8F0',
    surface: isDark ? '#1E1B2E' : '#FFFFFF',
    text: isDark ? '#F1F0F8' : '#1E1B2E'
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="w-full">
      
      {/* Greeting Header */}
      <div className="mb-8 md:mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-black text-text-primary mb-2 tracking-tight"
        >
          Welcome back, {user?.name?.split(' ')[0] || 'Creator'}! 
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary font-medium text-[15px]"
        >
          Here's a quick overview of your workspace.
        </motion.p>
      </div>
      
      {loading ? (
        // Premium Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm h-[170px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              <div className="w-12 h-12 rounded-xl bg-foreground/5 mb-6 animate-pulse"></div>
              <div className="w-24 h-3 bg-foreground/5 rounded-md mb-4 animate-pulse"></div>
              <div className="w-16 h-8 bg-foreground/5 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        // Stats Grid
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {/* Total Prompts Card */}
          <motion.div variants={itemVariants} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <FileText size={24} strokeWidth={2} />
            </div>
            <h3 className="text-text-secondary font-bold mb-1.5 tracking-wider uppercase text-[11px]">Total Prompts</h3>
            <p className="text-4xl font-black text-text-primary">{stats.totalPrompts}</p>
          </motion.div>

          {/* Total Bookmarks Card */}
          <motion.div variants={itemVariants} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500"></div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 ring-1 ring-accent/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Bookmark size={24} strokeWidth={2} />
            </div>
            <h3 className="text-text-secondary font-bold mb-1.5 tracking-wider uppercase text-[11px]">Total Bookmarks</h3>
            <p className="text-4xl font-black text-text-primary">{stats.totalBookmarks}</p>
          </motion.div>

          {/* Account Status Card */}
          <motion.div variants={itemVariants} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-border transition-all duration-300 relative overflow-hidden">
            {isPremium && (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-50 pointer-events-none"></div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ring-1 shadow-inner group-hover:scale-110 transition-transform duration-300 ${
              isPremium 
                ? 'bg-gradient-to-br from-accent/20 to-primary/20 text-accent ring-accent/30' 
                : 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20'
            }`}>
              {isPremium ? <Zap size={24} strokeWidth={2} className="fill-accent/20" /> : <ShieldCheck size={24} strokeWidth={2} />}
            </div>
            <h3 className="text-text-secondary font-bold mb-1.5 tracking-wider uppercase text-[11px]">Account Status</h3>
            <p className={`text-3xl md:text-4xl font-black ${isPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent' : 'text-text-primary'}`}>
              {isPremium ? 'Premium' : 'Active'}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Render Charts for All Users */}
      {!loading && showCharts && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-primary mb-6">Prompt Growth (6 Mo)</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={creatorStats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="prompts" stroke={COLORS.primary} strokeWidth={3} fill="url(#colorPrompts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold text-text-primary mb-6">Total Copies (This Week)</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={creatorStats.dailyCopiesData || defaultDailyCopies} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="day" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: COLORS.grid, opacity: 0.1}} contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, borderRadius: '12px' }} />
                    <Bar dataKey="copies" fill={COLORS.secondary} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Global Style for Shimmer Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
