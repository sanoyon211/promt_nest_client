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
      toast.success('Registration successful!');
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="bg-surface border border-foreground/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black text-foreground mb-2 text-center">Join PromptVerse</h1>
        <p className="text-foreground/60 text-center mb-8 text-sm">Create an account to discover and share premium AI prompts.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input required type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
          </div>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input required type="url" placeholder="Photo URL" value={formData.photoURL} onChange={(e) => setFormData({...formData, photoURL: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input required type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-background border border-foreground/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-primary text-background font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 mt-2 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Sign Up (Better Auth)'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-foreground/10"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-surface px-2 text-foreground/50">OR CONTINUE WITH</span></div>
        </div>

        <button onClick={loginWithGoogle} className="w-full bg-background border border-foreground/10 text-foreground font-bold py-3 rounded-xl hover:bg-foreground/5 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
          Google (Auth0)
        </button>

        <p className="text-center text-sm text-foreground/60 mt-6">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
