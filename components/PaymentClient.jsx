'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { ShieldCheck, Zap, Unlock, Copy } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Unlock Premium Access</h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          Get lifetime access to our exclusive vault of master prompts and take your AI game to the absolute next level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side: Benefits Presentation */}
        <div className="bg-surface rounded-3xl p-8 lg:p-10 border border-foreground/10 shadow-sm relative overflow-hidden">
          {/* Subtle glow effect behind benefits */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mr-4 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Plan Benefits</h2>
          </div>
          
          <ul className="space-y-8">
            <li className="flex items-start">
              <div className="bg-accent/10 p-2 rounded-xl mr-4 flex-shrink-0">
                <Unlock className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Unlimited Private Prompts</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">Bypass the blur lock and view all highly-optimized, private prompts crafted exclusively by Top Creators.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-accent/10 p-2 rounded-xl mr-4 flex-shrink-0">
                <Copy className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">1-Click Copy Access</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">Instantly copy full prompt code blocks securely to your clipboard for rapid workflow integration.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-accent/10 p-2 rounded-xl mr-4 flex-shrink-0">
                <Zap className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Community Engagement</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">Unlock the ability to rate, review, and bookmark premium prompts to curate your own dashboard.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side: Stripe Checkout Form */}
        <div className="bg-surface rounded-3xl p-8 lg:p-10 border border-primary/20 shadow-2xl relative overflow-hidden">
          {/* Decorative pink blur blob */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-foreground mb-1">Lifetime Premium</h2>
            <div className="flex items-baseline mb-8 pb-8 border-b border-foreground/10">
              <span className="text-6xl font-black text-foreground">$5</span>
              <span className="text-foreground/50 ml-2 font-medium tracking-wide uppercase text-sm">/ one-time</span>
            </div>

            {/* We initialize Stripe Elements with the Client Secret */}
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
