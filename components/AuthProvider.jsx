'use client';
import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signUp, signOut } from '@/lib/auth-client';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Better Auth's native useSession hook securely handles HttpOnly cookies and session states
  const { data: session, isPending: isLoading } = useSession();
  const router = useRouter();

  // Extract user from Better Auth session data
  const user = session?.user || null;

  const loginWithGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      console.error("Google Login Error", err);
      toast.error('Google login failed.');
    }
  };

  const registerWithEmail = async (name, email, photoURL, password) => {
    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
        image: photoURL // Better Auth standard field is 'image' for avatars
      });
      if (error) throw error;
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (err) {
      console.error("Registration Error", err);
      toast.error(err.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const { data, error } = await signIn.email({
        email,
        password
      });
      if (error) throw error;
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      console.error("Login Error", err);
      toast.error(err.message || 'Invalid credentials.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, registerWithEmail, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
