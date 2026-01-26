import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, we would verify the token and get user info
      // For now, we'll just set a dummy user
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiClient.login(email, password);

    if (result.error) {
      throw new Error(result.error);
    }

    if (result.data && result.data.access_token) {
      // Store token in localStorage
      localStorage.setItem('token', result.data.access_token);

      // Create user object based on the login response
      const userData: User = {
        id: result.data.user_id || 'unknown', // Adjust based on actual API response
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const signup = async (email: string, password: string) => {
    const result = await apiClient.signup(email, password);

    if (result.error) {
      throw new Error(result.error);
    }

    if (result.data) {
      // Store user data
      const userData: User = {
        id: result.data.id || 'unknown',
        email: result.data.email,
        created_at: result.data.created_at,
        updated_at: result.data.updated_at,
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};