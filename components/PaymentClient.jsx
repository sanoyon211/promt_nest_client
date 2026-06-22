'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { ShieldCheck, Zap, Unlock, Copy, Lock, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// For local testing, we use the standard Stripe Test Key. 
// Replace with your real environment variable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PaymentClient() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the client secret from the backend Payment Intent
    const fetchIntent = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/create-payment-intent`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ plan: 'premium', amount: 500 }) // $5.00
        });
        
        if (res.ok) {
          const data = await res.json();
          setClientSecret(data.clientSecret);
        } else {
          // Mock fallback simulation for frontend testing
          setClientSecret('pi_simulated_secret_123');
        }
      } catch (err) {
        // Mock fallback simulation for frontend testing if backend is offline
        setClientSecret('pi_simulated_secret_123');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntent();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <Lock size={24} className="text-primary animate-pulse" />
        </div>
        <p className="mt-4 text-text-secondary font-bold text-[14px] uppercase tracking-widest animate-pulse">Securing Checkout...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 lg:py-24 relative">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-primary/5 to-accent/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface border border-border text-text-secondary text-[11px] font-black uppercase tracking-widest mb-6 shadow-sm">
          <Star size={14} className="mr-2 text-accent fill-accent" />
          Pro Creator Tier
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 tracking-tight">
          Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pb-2">Premium Access</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
          Get lifetime access to our exclusive vault of master prompts and take your AI generation game to the absolute next level.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start"
      >
        {/* Left Side: Benefits Presentation */}
        <motion.div variants={itemVariants} className="flex flex-col justify-center">
          <div className="flex items-center mb-10">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight">Plan Benefits</h2>
              <p className="text-text-secondary font-medium mt-1">Everything you need to prompt like a pro.</p>
            </div>
          </div>
          
          <ul className="space-y-8">
            <li className="flex items-start group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all shadow-sm">
                <Unlock className="text-text-secondary group-hover:text-accent transition-colors" size={22} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-text-primary mb-1.5">Unlimited Private Prompts</h3>
                <p className="text-[15px] text-text-secondary font-medium leading-relaxed">Bypass the blur lock and view all highly-optimized, private prompts crafted exclusively by Top Creators.</p>
              </div>
            </li>
            
            <li className="flex items-start group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shadow-sm">
                <Copy className="text-text-secondary group-hover:text-primary transition-colors" size={22} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-text-primary mb-1.5">1-Click Copy Access</h3>
                <p className="text-[15px] text-text-secondary font-medium leading-relaxed">Instantly copy full prompt code blocks securely to your clipboard for rapid workflow integration.</p>
              </div>
            </li>
            
            <li className="flex items-start group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-green-500/10 group-hover:border-green-500/30 transition-all shadow-sm">
                <CheckCircle2 className="text-text-secondary group-hover:text-green-500 transition-colors" size={22} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-text-primary mb-1.5">Community Engagement</h3>
                <p className="text-[15px] text-text-secondary font-medium leading-relaxed">Unlock the ability to rate, review, and bookmark premium workflows to curate your personal dashboard.</p>
              </div>
            </li>
          </ul>

          <div className="mt-12 p-6 bg-surface border border-border rounded-2xl flex items-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mr-4 border border-border shadow-sm flex-shrink-0">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-10 h-10 rounded-full" />
            </div>
            <div>
              <p className="text-[14px] italic text-text-secondary font-medium leading-relaxed">"Upgrading to Premium was a no-brainer. The private SEO prompts saved me 10+ hours a week."</p>
              <p className="text-[12px] font-black text-text-primary mt-2 uppercase tracking-widest">— Sarah Jenkins, Marketer</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Stripe Checkout Form */}
        <motion.div variants={itemVariants} className="relative">
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-primary via-accent to-background rounded-2xl opacity-30 blur-[2px]"></div>
          
          <div className="bg-surface rounded-2xl p-5 md:p-6 lg:p-8 border border-border/50 shadow-2xl relative overflow-hidden z-10 flex flex-col h-full">
            
            {/* Top decorative badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-accent to-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl shadow-md">
              Most Popular
            </div>

            <h2 className="text-2xl font-black text-text-primary mb-2 mt-2">Lifetime Access</h2>
            <p className="text-text-secondary font-medium text-[14px] mb-6">Pay once, use forever. No hidden fees.</p>
            
            <div className="flex items-end mb-8 pb-8 border-b border-border">
              <span className="text-6xl font-black text-text-primary leading-none">$5</span>
              <span className="text-text-secondary ml-2 font-bold tracking-wider uppercase text-[12px] mb-1.5">/ One-time</span>
            </div>

            {/* We initialize Stripe Elements with the Client Secret */}
            <div className="flex-1">
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'night', // Change to 'stripe' or 'flat' based on exact light/dark mode needs, but 'night' looks premium on dark themes
                    variables: {
                      colorPrimary: '#4F46E5', // Matches your primary
                      colorBackground: 'transparent',
                      colorText: '#ffffff',
                    }
                  }
                }}>
                  <CheckoutForm clientSecret={clientSecret} />
                </Elements>
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center text-text-secondary/70">
              <Lock size={14} className="mr-2" />
              <span className="text-[12px] font-bold uppercase tracking-widest">Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}