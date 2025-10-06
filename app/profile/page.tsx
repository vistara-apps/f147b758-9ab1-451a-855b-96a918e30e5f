'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { UserProfile } from '@/components/UserProfile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, Meme } from '@/lib/types';
import { useMiniKit } from '@/components/MiniKitProvider';

export default function ProfilePage() {
  const { fid } = useMiniKit();
  const [user, setUser] = useState<User | null>(null);
  const [savedMemes, setSavedMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fid) {
      fetchUserData();
    }
  }, [fid]);

  const fetchUserData = async () => {
    if (!fid) return;

    try {
      // Fetch user data
      const userResponse = await fetch(`/api/users?fid=${fid}`);
      const userData = await userResponse.json();
      setUser(userData);

      // In production, fetch saved memes from database
      // For now, use mock data
      setSavedMemes([]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!fid) return;

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid, ...updates }),
      });

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Your <span className="text-gradient">Profile</span>
          </h2>
          <p className="text-text-muted">
            Manage your account and view your activity
          </p>
        </div>

        <UserProfile
          user={user}
          savedMemes={savedMemes}
          onUpdateProfile={handleUpdateProfile}
        />
      </main>

      <BottomNav />
    </div>
  );
}
