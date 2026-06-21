'use client';
import Link from 'next/link';
import { Shield, PenTool, User, ArrowRight, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// Note: In Next.js App Router, you cannot export `metadata` from a 'use client' component.
// If you need SEO metadata for this page, create a separate `layout.jsx` in the `app/demo` folder.

export default function DemoAccountsPage() {
  const accounts = [
    {
      role: 'ADMIN USER',
      icon: Shield,
      themeColors: {
        text: 'text-fuchsia-500',
        bg: 'bg-fuchsia-500/10',
        border: 'border-fuchsia-500/20',
        glow: 'from-fuchsia-500/20 to-purple-600/20',
        hoverBorder: 'hover:border-fuchsia-500/50'
      },
      desc: 'Access system analytics, manage users, moderate prompts, review payment history, and configure system settings.',
      email: 'admin@promtnest.com',
      password: 'adminpassword123'
    },
    {
      role: 'CREATOR USER',
      icon: PenTool,
      themeColors: {
        text: 'text-cyan-500 dark:text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        glow: 'from-cyan-500/20 to-blue-500/20',
        hoverBorder: 'hover:border-cyan-500/50'
      },
      desc: 'Access creator analytics, publish new AI workflows, edit owned listings, and track engagement metrics.',
      email: 'creator@promtnest.com',
      password: 'creatorpassword123'
    },
    {
      role: 'STANDARD USER',
      icon: User,
      themeColors: {
        text: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        glow: 'from-emerald-500/20 to-teal-500/20',
        hoverBorder: 'hover:border-emerald-500/50'
      },
      desc: 'Search prompts, copy workflows to clipboard, save items to personal library, leave reviews, and upgrade to premium.',
      email: 'user@promtnest.com',
      password: 'userpassword123'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-[11px] font-black uppercase tracking-widest mb-6 shadow-sm"
        >
          <TerminalSquare size={14} className="mr-2 text-primary" />
          Developer Sandbox
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 tracking-tight"
        >
          Demo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pb-2">Accounts</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-text-secondary max-w-2xl mx-auto text-lg font-medium leading-relaxed"
        >
          Explore PromptNest from different user perspectives. You can change these credentials in the codebase, and click below to auto-fill the login page.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10"
      >
        {accounts.map((acc, idx) => {
          const Icon = acc.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`bg-surface rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col relative group ${acc.themeColors.hoverBorder}`}
            >
              {/* Top Accent Gradient Background */}
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${acc.themeColors.glow} opacity-50 -z-10 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl ${acc.themeColors.bg} ${acc.themeColors.text} flex items-center justify-center mb-6 border ${acc.themeColors.border} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} strokeWidth={2} />
                </div>

                <h3 className={`text-[11px] font-black uppercase tracking-widest ${acc.themeColors.text} mb-4 inline-block`}>
                  <span className={`${acc.themeColors.bg} px-3.5 py-1.5 rounded-md border ${acc.themeColors.border} shadow-sm`}>{acc.role}</span>
                </h3>

                <p className="text-text-secondary text-[15px] font-medium mb-8 leading-relaxed flex-1">
                  {acc.desc}
                </p>

                <div className="space-y-4 mb-8 bg-background p-6 rounded-[24px] border border-border shadow-inner">
                  <div>
                    <label className="text-[11px] font-black text-text-secondary/60 uppercase tracking-widest mb-1.5 block">Email Address</label>
                    <div className="font-mono text-[13px] font-bold text-text-primary bg-surface p-3.5 rounded-xl border border-border flex justify-between items-center transition-colors">
                      {acc.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-text-secondary/60 uppercase tracking-widest mb-1.5 block">Password</label>
                    <div className="font-mono text-[13px] font-bold text-text-primary bg-surface p-3.5 rounded-xl border border-border flex justify-between items-center transition-colors">
                      {acc.password}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/login?email=${encodeURIComponent(acc.email)}&password=${encodeURIComponent(acc.password)}`}
                  className="w-full py-4 px-6 rounded-xl bg-background border border-border text-text-primary font-bold flex items-center justify-center hover:bg-text-primary hover:text-background transition-all duration-300 group-hover:shadow-lg active:scale-95 mt-auto"
                >
                  Auto-fill Login
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}