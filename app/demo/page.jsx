import Link from 'next/link';
import { Shield, PenTool, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Demo Accounts | PromtNest',
  description: 'Explore the PromtNest platform from different user perspectives.',
};

export default function DemoAccountsPage() {
  const accounts = [
    {
      role: 'ADMIN USER',
      icon: Shield,
      color: 'text-fuchsia-500',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20',
      desc: 'Access to system analytics, user management, prompt moderation, payment histories, and system configurations.',
      email: 'admin@promtnest.com',
      password: 'adminpassword123'
    },
    {
      role: 'CREATOR USER',
      icon: PenTool,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      desc: 'Access to creator analytics, adding new AI prompts, editing owned listings, and tracking prompt views.',
      email: 'creator@promtnest.com',
      password: 'creatorpassword123'
    },
    {
      role: 'STANDARD USER',
      icon: User,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Access to search prompts, copy prompts to clipboard, save to collections, leave reviews, and purchase premium access.',
      email: 'user@promtnest.com',
      password: 'userpassword123'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-surface border border-foreground/10 text-foreground/60 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Shield size={14} className="mr-2" />
          Developer Sandbox
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
          Demo <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Accounts</span>
        </h1>
        <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
          Explore PromtNest from different user perspectives. You can change these credentials in the code, and click below to auto-fill the login page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {accounts.map((acc, idx) => {
          const Icon = acc.icon;
          return (
            <div key={idx} className="bg-surface rounded-3xl border border-foreground/5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden flex flex-col relative group">
              {/* Top Accent Line */}
              <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${acc.color.split('-')[1]}-500 to-transparent opacity-50`}></div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className={`w-14 h-14 rounded-2xl ${acc.bg} ${acc.color} flex items-center justify-center mb-6 border ${acc.border}`}>
                  <Icon size={24} />
                </div>
                
                <h3 className={`text-xs font-black uppercase tracking-widest ${acc.color} mb-4 inline-block`}>
                  <span className={`${acc.bg} px-3 py-1 rounded-full border ${acc.border}`}>{acc.role}</span>
                </h3>
                
                <p className="text-foreground/70 text-sm mb-8 leading-relaxed flex-1">
                  {acc.desc}
                </p>

                <div className="space-y-4 mb-8 bg-background/50 p-5 rounded-2xl border border-foreground/5">
                  <div>
                    <label className="text-xs font-bold text-foreground/40 uppercase mb-1 block">Email</label>
                    <div className="font-mono text-sm text-foreground bg-surface p-3 rounded-xl border border-foreground/10 flex justify-between items-center group-hover:border-primary/30 transition-colors">
                      {acc.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/40 uppercase mb-1 block">Password</label>
                    <div className="font-mono text-sm text-foreground bg-surface p-3 rounded-xl border border-foreground/10 flex justify-between items-center group-hover:border-primary/30 transition-colors">
                      {acc.password}
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/login?email=${encodeURIComponent(acc.email)}&password=${encodeURIComponent(acc.password)}`}
                  className="w-full py-4 px-6 rounded-xl bg-background border border-foreground/10 text-foreground font-bold flex items-center justify-center hover:bg-foreground hover:text-background transition-all group-hover:shadow-lg mt-auto"
                >
                  Go to Login
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
