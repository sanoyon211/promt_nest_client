'use client';

import { useState, useEffect } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const { user } = useAuth();
  const [redirectPath, setRedirectPath] = useState('/dashboard/profile');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const red = params.get('redirect');
      if (red) setRedirectPath(red);
    }
  }, []);

  const plans = [
    {
      name: "Basic",
      description: "Perfect for exploring and saving basic public prompts.",
      price: "$0",
      duration: "/ forever",
      features: [
        "Access to public prompt library",
        "Save and bookmark prompts",
        "Basic search functionality",
        "Community support",
      ],
      cta: user ? "Go to Library" : "Get Started",
      href: user ? "/all-prompts" : "/login",
      highlighted: false,
    },
    {
      name: "Lifetime Premium",
      description: "For creators and professionals who need unlimited power.",
      price: "$5",
      duration: "/ one-time",
      features: [
        "Unlimited Private Prompts",
        "Bypass blur locks on premium content",
        "1-Click Copy Access for workflows",
        "Rate, review, and engage with creators",
        "Lifetime access, no monthly fees",
      ],
      cta: "Upgrade Now",
      href: user ? `/payment?redirect=${encodeURIComponent(redirectPath)}` : `/login?redirect=/pricing`,
      highlighted: true,
      badge: "Best Value"
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
    <div className="min-h-screen py-16 md:py-24 relative overflow-hidden flex flex-col justify-center bg-background">
      
      {/* Premium Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-[11px] font-black uppercase tracking-widest mb-6 shadow-sm"
          >
            <Sparkles size={14} className="text-primary" />
            Pricing Plans
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight mb-6"
          >
            Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2">pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed font-medium max-w-2xl mx-auto"
          >
            Choose the perfect plan for your needs. Upgrade once, enjoy lifetime access to our exclusive vault of master prompts.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center max-w-4xl mx-auto"
        >
          {plans.map((plan, idx) => (
            <motion.div 
              variants={itemVariants}
              key={idx} 
              className={`relative rounded-2xl transition-all duration-500 group ${
                plan.highlighted 
                  ? 'scale-100 md:scale-105 z-10 hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] hover:-translate-y-2' 
                  : 'hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none'
              }`}
            >
              {/* Animated Gradient Border for Highlighted Card */}
              {plan.highlighted && (
                <div className="absolute -inset-[2px] bg-gradient-to-br from-primary via-accent to-primary opacity-50 blur-[2px] rounded-[34px] group-hover:opacity-75 transition-opacity duration-500"></div>
              )}
              {plan.highlighted && (
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary to-accent rounded-[33px] opacity-100"></div>
              )}
              
              <div className={`relative h-full rounded-2xl overflow-hidden flex flex-col ${
                plan.highlighted
                  ? 'bg-surface p-8 md:p-10'
                  : 'bg-surface border border-border p-8 md:p-10'
              }`}>
                
                {/* Premium Inner Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0"></div>

                {plan.badge && (
                  <div className="absolute top-0 right-8 z-20">
                    <div className="bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-b-xl shadow-lg shadow-primary/20 flex items-center">
                      <Zap size={10} className="mr-1 fill-current" />
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{plan.name}</h3>
                    <p className="text-[14px] font-medium text-text-secondary h-10">{plan.description}</p>
                  </div>
                  
                  <div className="mb-8 flex items-baseline">
                    <span className="text-5xl font-black text-text-primary tracking-tighter">{plan.price}</span>
                    <span className="text-[13px] text-text-secondary font-bold tracking-widest uppercase ml-2">{plan.duration}</span>
                  </div>
                  
                  <Link 
                    href={plan.href}
                    className={`w-full py-4 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center mb-8 relative overflow-hidden group/btn active:scale-95 ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]' 
                        : 'bg-foreground/5 text-text-primary hover:bg-foreground/10 border border-border'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    )}
                    <span className="relative z-10">{plan.cta}</span>
                  </Link>
                  
                  <div className="space-y-4 pt-8 border-t border-border mt-auto">
                    <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest mb-4">What's included</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                          plan.highlighted ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-foreground/5 text-text-secondary border border-border'
                        }`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-medium text-text-secondary leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
