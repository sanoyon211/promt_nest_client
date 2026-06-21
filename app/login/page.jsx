'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function LoginForm() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({ 
    email: searchParams.get('email') || '', 
    password: searchParams.get('password') || '' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(formData.email, formData.password, redirectPath);
    } catch (err) {
      // Error is handled and toasted in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle(redirectPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Premium Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface/80 backdrop-blur-2xl border border-border p-8 md:p-10 rounded-[40px] w-full max-w-[440px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none relative"
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[40px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
              <Lock className="text-primary" size={26} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2 text-center tracking-tight">Welcome Back</h1>
          <p className="text-text-secondary text-center mb-8 font-medium">Log in to access your dashboard and saved prompts.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input 
                required 
                type="email" 
                placeholder="Email address" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-[15px] font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all text-text-primary placeholder:text-text-secondary/50" 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                // Increased pr-12 so text doesn't overlap the eye icon
                className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-12 text-[15px] font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all text-text-primary placeholder:text-text-secondary/50" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold">
              <span className="bg-surface px-4 text-text-secondary tracking-widest uppercase">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-background hover:bg-foreground/5 border border-border text-text-primary font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center active:scale-[0.98]"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Google
          </button>
        </div>

        <p className="text-center text-[15px] text-text-secondary mt-8 font-medium">
          Don't have an account? <Link href={`/register${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`} className="text-primary font-bold hover:text-accent transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}