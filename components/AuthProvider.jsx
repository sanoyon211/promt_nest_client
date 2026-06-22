'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';

const AuthContext = createContext(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Adjust if your backend has /api prefix

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // 1. Generate Custom JWT from your Express backend
          const res = await fetch(`${API_URL}/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });
          
          if (res.ok) {
            const { token } = await res.json();
            
            if (token) {
              // Save token securely in localStorage for API calls
              localStorage.setItem('access-token', token);
              // Save in cookie for Next.js Middleware (expires in 1 day)
              document.cookie = `access-token=${token}; path=/; max-age=86400; SameSite=Lax`;
              
              // 2. Save/Sync user in MongoDB
              await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: currentUser.displayName || 'Unknown User',
                  email: currentUser.email,
                  photoURL: currentUser.photoURL || '',
                  role: 'User', // Your backend handles default role logic
                  subscription: 'Free'
                })
              });

              // 3. Fetch detailed user profile from MongoDB to get actual Role and Subscription
              const userRes = await fetch(`${API_URL}/users/${currentUser.email}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (userRes.ok) {
                const dbUser = await userRes.json();
                setUser({ ...currentUser, ...dbUser });
              } else {
                setUser(currentUser);
              }
            }
          } else {
             setUser(currentUser);
          }
        } catch (error) {
          console.error("Auth sync error with backend:", error);
          setUser(currentUser); // fallback
        }
      } else {
        localStorage.removeItem('access-token');
        document.cookie = "access-token=; path=/; max-age=0; SameSite=Lax";
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (redirectPath = '/') => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google!');
      window.location.href = redirectPath;
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error("Google Login Error", err);
        toast.error(err.message || 'Google login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (name, email, photoURL, password, redirectPath = '/') => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
      });
      
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          photoURL: photoURL,
          role: 'User',
          subscription: 'Free'
        })
      });

      setUser(prev => {
        if (!prev) return prev;
        return { ...prev, name, photoURL, displayName: name };
      });

      toast.success('Registration successful!');
      window.location.href = redirectPath;
    } catch (err) {
      console.error("Registration Error", err);
      toast.error(err.message || 'Registration failed.');
      setIsLoading(false);
      throw err;
    }
  };

  const loginWithEmail = async (email, password, redirectPath = '/') => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      window.location.href = redirectPath;
    } catch (err) {
      console.error("Login Error", err);
      toast.error('Invalid email or password.');
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      localStorage.removeItem('access-token');
      document.cookie = "access-token=; path=/; max-age=0; SameSite=Lax";
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error("Logout error", err);
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (name, photoURL) => {
    try {
      if (!auth.currentUser) return;
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL
      });
      setUser(prev => ({ ...prev, name, photoURL, photo: photoURL, displayName: name }));
    } catch (err) {
      console.error("Update profile error", err);
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      if (!auth.currentUser) return;
      const token = localStorage.getItem('access-token');
      const userRes = await fetch(`${API_URL}/users/${auth.currentUser.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (userRes.ok) {
        const dbUser = await userRes.json();
        setUser(prev => ({ ...prev, ...dbUser }));
      }
    } catch (err) {
      console.error("Error refreshing user data", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, registerWithEmail, loginWithEmail, logout, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
