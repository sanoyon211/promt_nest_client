'use client';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { User, Mail, Shield, Star, Zap, PenTool } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fallback defaults if user object doesn't have these
  const subscription = user.subscription || 'Free';
  const role = user.role || 'User';
  const totalPrompts = user.totalPrompts || 0;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-black text-foreground mb-8">My Profile</h1>
      
      <div className="bg-surface border border-foreground/10 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {user.photo ? (
              <img 
                src={user.photo} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-5xl font-black border-4 border-background shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          {/* User Details */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{user.name || 'Anonymous User'}</h2>
                <div className="flex items-center justify-center md:justify-start text-foreground/60 mb-4">
                  <Mail size={16} className="mr-2" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wider flex items-center">
                    <Shield size={12} className="mr-1.5" />
                    {role}
                  </span>
                  
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center ${
                    subscription === 'Premium' 
                      ? 'bg-[#CFFAFE] text-cyan-900 dark:bg-cyan-900 dark:text-[#CFFAFE]' 
                      : 'bg-foreground/10 text-foreground/80'
                  }`}>
                    {subscription === 'Premium' ? <Star size={12} className="mr-1.5 fill-current" /> : null}
                    {subscription} Plan
                  </span>
                </div>
              </div>
              
              {/* Conditional Upgrade Button */}
              {subscription !== 'Premium' && (
                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <Link 
                    href="/payment" 
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-accent text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20 w-full md:w-auto"
                  >
                    <Zap size={18} className="mr-2 fill-current" />
                    Upgrade to Premium
                  </Link>
                </div>
              )}
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-foreground/10">
              <div className="bg-background rounded-2xl p-5 border border-foreground/5 flex items-center transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0">
                  <PenTool size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-foreground/50 font-bold mb-1">Total Prompts</p>
                  <p className="text-2xl font-black text-foreground leading-none">{totalPrompts}</p>
                </div>
              </div>
              
              <div className="bg-background rounded-2xl p-5 border border-foreground/5 flex items-center transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mr-4 flex-shrink-0">
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-foreground/50 font-bold mb-1">Account Status</p>
                  <p className="text-xl font-bold text-foreground leading-none mt-1">Verified</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
