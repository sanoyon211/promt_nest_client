'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Mail, Lock, User, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Register() {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerWithEmail(formData.name, formData.email, formData.photoURL, formData.password);
    } catch (err) {
      // Error is handled and toasted in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error is handled and toasted in AuthProvider
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="bg-surface/80 backdrop-blur-xl border border-border p-10 rounded-[32px] w-full max-w-md shadow-2xl relative">
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <UserPlus className="text-primary" size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2 text-center tracking-tight">Create Account</h1>
          <p className="text-text-secondary text-center mb-8 text-sm">Join PromtNest and unlock the power of AI creativity.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors" size={18} />
              <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-text-primary placeholder-text-secondary/50" />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors" size={18} />
              <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-text-primary placeholder-text-secondary/50" />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors" size={18} />
              <input required type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-text-primary placeholder-text-secondary/50" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10">{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-surface px-4 text-text-secondary font-bold tracking-widest uppercase">Or</span></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full bg-surface hover:bg-foreground/5 border border-border text-text-primary font-bold py-4 rounded-2xl transition-colors flex items-center justify-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
            Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-foreground/60 mt-6">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
