'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // In a real implementation, this would check with Base Wallet
      // For now, we'll simulate a logged-in user
      const mockUser: User = {
        fid: '12345',
        walletAddress: '0x1234567890abcdef',
        creditsRemaining: 3,
        tierType: 'free',
        savedMemes: [],
        connectedAccounts: {},
        preferences: {
          niches: ['crypto', 'startup'],
          notificationSettings: {
            viralAlerts: true,
            newPacks: true,
            lowCredits: true,
          },
        },
      };

      setUser(mockUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would trigger Base Wallet connection
      // For now, we'll simulate login
      const mockUser: User = {
        fid: '12345',
        walletAddress: '0x1234567890abcdef',
        creditsRemaining: 5,
        tierType: 'free',
        savedMemes: [],
        connectedAccounts: {},
        preferences: {
          niches: ['crypto', 'startup'],
          notificationSettings: {
            viralAlerts: true,
            newPacks: true,
            lowCredits: true,
          },
        },
      };

      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

