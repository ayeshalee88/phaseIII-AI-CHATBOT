import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Dynamic import for next-auth functions to handle potential runtime issues in Vercel
const getSignIn = () => {
  try {
    if (typeof window !== 'undefined') {
      const { signIn } = require('next-auth/react');
      return signIn;
    }
  } catch (error) {
    console.warn('next-auth signIn not available:', error);
    return () => Promise.resolve();
  }
  return () => Promise.resolve();
};

const getSignOut = () => {
  try {
    if (typeof window !== 'undefined') {
      const { signOut } = require('next-auth/react');
      return signOut;
    }
  } catch (error) {
    console.warn('next-auth signOut not available:', error);
    return () => Promise.resolve();
  }
  return () => Promise.resolve();
};

const getUseSession = () => {
  try {
    if (typeof window !== 'undefined') {
      const { useSession } = require('next-auth/react');
      return useSession;
    }
  } catch (error) {
    console.warn('next-auth useSession not available:', error);
    return () => [null, 'loading'];
  }
  return () => [null, 'loading'];
};

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, status] = getUseSession()();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const signInFunc = getSignIn();
    const result = await signInFunc('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    if (result?.ok) {
      router.push('/dashboard'); // ✅ Login redirects to dashboard
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      // Create the user account via backend API
      const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      const response = await fetch(`${BACKEND_API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      // After successful signup, log them in
      const signInFunc = getSignIn();
      const result = await signInFunc('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Account created but login failed. Please try logging in.');
      }

      if (result?.ok) {
        router.push('/dashboard'); // ✅ Signup also redirects to dashboard
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const signInFunc = getSignIn();
    await signInFunc('google', { callbackUrl: '/dashboard' }); // ✅ Google login also goes to dashboard
  };

  const logout = async () => {
    const signOutFunc = getSignOut();
    await signOutFunc({ callbackUrl: '/login' });
  };

  const value = {
    user: session?.user ? {
      id: session.user.id as string,
      email: session.user.email!,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
    } : null,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};