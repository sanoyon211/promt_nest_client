'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { setSessionCookie, getSessionCookie, clearSessionCookie } from '@/app/actions/auth';

const AuthContext = createContext(null);

// Placeholder for your existing Express + MongoDB API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount to prevent redirect on page refresh
  useEffect(() => {
    async function initAuth() {
      try {
        const token = await getSessionCookie();
        if (token) {
          // Verify token and fetch user data from Express backend
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            await clearSessionCookie();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Failed to restore session from existing token:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAuth();
  }, []);

  // Hybrid Auth0 for Google Login integration
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // NOTE: Depending on your Auth0 setup, you might redirect to an Express endpoint here
      // Example: window.location.href = `${API_URL}/auth/google`;
      
      // FOR DEMO: Simulated successful Google Login return payload from your Express backend Auth0 route
      const simulatedToken = "auth0_google_jwt_simulation"; 
      const simulatedUser = {
        name: "Google User",
        email: "google@example.com",
        photoURL: "https://example.com/avatar.jpg",
        role: "User", // CRITICAL: Ensure social login default role is 'User'
        provider: "Auth0"
      };

      // Sync with existing Express + MongoDB backend
      const res = await fetch(`${API_URL}/auth/sync-social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: simulatedToken, user: simulatedUser })
      });

      if (!res.ok) throw new Error("Failed to sync social login with backend");
      
      const { jwt, user: backendUser } = await res.json();
      
      // Store JWT securely as HttpOnly cookie
      await setSessionCookie(jwt || simulatedToken);
      setUser(backendUser || simulatedUser);
    } catch (error) {
      console.error("Google Login Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hybrid Better Auth for Email/Password (Registration)
  const registerWithEmail = async (name, email, password, photoURL) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, photoURL })
      });
      
      if (!res.ok) throw new Error("Registration failed");
      
      const { jwt, user: newUser } = await res.json();
      await setSessionCookie(jwt);
      setUser(newUser);
    } catch (error) {
      console.error("Registration Error", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hybrid Better Auth for Email/Password (Login)
  const loginWithEmail = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error("Login failed");
      
      const { jwt, user: loggedInUser } = await res.json();
      await setSessionCookie(jwt);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await clearSessionCookie();
    setUser(null);
    setIsLoading(false);
    // Optionally trigger Express backend logout endpoint:
    // await fetch(`${API_URL}/auth/logout`, { method: "POST" });
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
