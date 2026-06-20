'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function PricingPage() {
  const { user } = useAuth();

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
      cta: user ? "Go to Home" : "Get Started",
      href: user ? "/" : "/login",
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
      href: user ? "/payment" : "/login?redirect=/pricing",
      highlighted: true,
      badge: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen py-16 md:py-24 relative overflow-hidden flex flex-col justify-center">
      {/* Premium Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6 border border-primary/20 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Pricing Plans
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight mb-4">
            Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">pricing</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Choose the perfect plan for your needs. Upgrade once, enjoy lifetime access to our premium vault.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center max-w-3xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl transition-all duration-500 hover:-translate-y-2 group ${
                plan.highlighted 
                  ? 'scale-100 md:scale-105 z-10' 
                  : ''
              }`}
            >
              {/* Animated Gradient Border for Highlighted Card */}
              {plan.highlighted && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary via-accent to-primary opacity-50 blur-sm rounded-3xl group-hover:opacity-75 transition-opacity duration-500"></div>
              )}
              {plan.highlighted && (
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary to-accent rounded-[25px] opacity-100"></div>
              )}
              
              <div className={`relative h-full rounded-[24px] overflow-hidden ${
                plan.highlighted
                  ? 'bg-surface shadow-2xl shadow-primary/20 p-7 md:p-8'
                  : 'bg-surface/80 backdrop-blur-md border border-border shadow-lg p-7'
              }`}>
                
                {/* Premium Inner Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0"></div>

                {plan.badge && (
                  <div className="absolute top-0 right-8 z-20">
                    <div className="bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-b-xl shadow-lg shadow-primary/20">
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                    <p className="text-xs text-text-secondary h-8">{plan.description}</p>
                  </div>
                  
                  <div className="mb-8 flex items-baseline">
                    <span className="text-4xl font-black text-text-primary tracking-tighter">{plan.price}</span>
                    <span className="text-xs text-text-secondary ml-1 font-medium">{plan.duration}</span>
                  </div>
                  
                  <Link 
                    href={plan.href}
                    className={`w-full py-3 rounded-xl text-sm text-center font-bold transition-all flex items-center justify-center mb-8 relative overflow-hidden group/btn ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-primary/40' 
                        : 'bg-foreground/5 text-text-primary hover:bg-foreground/10 border border-border'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    )}
                    <span className="relative z-10">{plan.cta}</span>
                  </Link>
                  
                  <div className="space-y-3 pt-6 border-t border-border/50">
                    <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-4">What's included</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.highlighted ? 'bg-primary/20 text-primary' : 'bg-foreground/10 text-foreground/50'
                        }`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-sm text-text-secondary leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
