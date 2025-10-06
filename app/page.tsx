'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MemeCard } from './components/MemeCard';
import { PostModal } from './components/PostModal';
import { PaymentModal } from './components/PaymentModal';
import { BottomNav } from './components/BottomNav';
import { memeService } from '@/lib/meme-service';
import { userService } from '@/lib/user-service';
import { creditService } from '@/lib/credit-service';
import { farcasterAPI } from '@/lib/api/farcaster';
import type { Meme, TimeWindow, Category, User } from '@/lib/types';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');
  const [category, setCategory] = useState<Category>('all');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [savedMemes, setSavedMemes] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fid, setFid] = useState<string>('demo-user'); // In real app, get from MiniKit

  // Load user data and memes on mount
  useEffect(() => {
    loadUserData();
    loadMemes();
  }, []);

  // Reload memes when filters change
  useEffect(() => {
    if (!isLoading) {
      loadMemes();
    }
  }, [timeWindow, category]);

  const loadUserData = async () => {
    try {
      const userData = await userService.getOrCreateUser(fid);
      if (userData) {
        setUser(userData);
        setSavedMemes(userData.savedMemes);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadMemes = async () => {
    try {
      setIsLoading(true);
      const fetchedMemes = await memeService.getTrendingMemes(timeWindow, category);
      setMemes(fetchedMemes);
    } catch (error) {
      console.error('Failed to load memes:', error);
      showNotification('Failed to load memes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter memes based on selected filters (already filtered by service)
  const filteredMemes = memes;

  // Show toast notification
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle save meme
  const handleSaveMeme = async (memeId: string) => {
    try {
      if (savedMemes.includes(memeId)) {
        await userService.unsaveMemeForUser(fid, memeId);
        setSavedMemes(savedMemes.filter((id) => id !== memeId));
        showNotification('Meme removed from saved');
      } else {
        await userService.saveMemeForUser(fid, memeId);
        setSavedMemes([...savedMemes, memeId]);
        showNotification('Meme saved successfully! 💾');
      }
    } catch (error) {
      console.error('Failed to save/unsave meme:', error);
      showNotification('Failed to save meme. Please try again.');
    }
  };

  // Handle post meme
  const handlePostMeme = (memeId: string) => {
    const meme = memes.find((m) => m.memeId === memeId);
    if (meme) {
      setSelectedMeme(meme);
      setIsPostModalOpen(true);
    }
  };

  // Handle post submission
  const handlePostSubmit = async (platform: string, caption: string) => {
    try {
      const creditCheck = await creditService.checkCreditsForAction(fid, 1);
      if (!creditCheck.hasEnough) {
        showNotification('Not enough credits! Buy more to continue.');
        setIsPaymentModalOpen(true);
        return;
      }

      // Deduct credits
      const spendResult = await creditService.spendCredits(fid, 1, 'Meme posting');
      if (!spendResult.success) {
        showNotification('Failed to process credits. Please try again.');
        return;
      }

      // Post to selected platform
      if (platform === 'farcaster' && selectedMeme) {
        const postResult = await farcasterAPI.publishCast(caption, selectedMeme.imageUrl);
        if (postResult.success) {
          showNotification(`Posted to ${platform}! 🚀`);
        } else {
          showNotification(`Failed to post to ${platform}. Please try again.`);
          // Refund credits on failure
          await creditService.addCredits(fid, 1, 'Refund for failed post');
        }
      } else {
        // Mock posting for other platforms
        showNotification(`Posted to ${platform}! 🚀`);
      }

      // Update local user state
      if (user) {
        setUser({ ...user, creditsRemaining: spendResult.remainingCredits || 0 });
      }
    } catch (error) {
      console.error('Failed to post meme:', error);
      showNotification('Failed to post meme. Please try again.');
    }
  };

  // Handle credit purchase
  const handlePurchase = async (type: 'credits' | 'pack', amount: number) => {
    try {
      if (type === 'credits') {
        const creditsToAdd = creditService.calculateCreditsFromUSD(amount);
        const result = await creditService.addCredits(fid, creditsToAdd, 'Credit purchase');
        if (result.success) {
          showNotification(`${creditsToAdd} credits added! ⚡`);
          if (user) {
            setUser({ ...user, creditsRemaining: result.newTotal || 0 });
          }
        } else {
          showNotification('Failed to add credits. Please try again.');
        }
      } else {
        // Handle pack purchase
        showNotification('Premium pack unlocked! 📦');
      }
    } catch (error) {
      console.error('Failed to process purchase:', error);
      showNotification('Failed to process purchase. Please try again.');
    }
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <Header
        credits={user?.creditsRemaining || 0}
        onBuyCredits={() => setIsPaymentModalOpen(true)}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        {activeTab === 'feed' && (
          <div className="glass-card p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-gradient">
                Catch Viral Memes Before They Peak
              </h2>
            </div>
            <p className="text-textMuted max-w-2xl mx-auto">
              Real-time trending memes with one-tap social posting and engagement analytics
            </p>
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <>
            <FilterBar
              timeWindow={timeWindow}
              category={category}
              onTimeWindowChange={setTimeWindow}
              onCategoryChange={setCategory}
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-textMuted">Loading trending memes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMemes.map((meme) => (
                  <MemeCard
                    key={meme.memeId}
                    meme={meme}
                    onSave={handleSaveMeme}
                    onPost={handlePostMeme}
                    isSaved={savedMemes.includes(meme.memeId)}
                  />
                ))}
              </div>
            )}

            {filteredMemes.length === 0 && (
              <div className="glass-card p-12 text-center">
                <p className="text-textMuted">
                  No memes found for this filter combination. Try adjusting your filters!
                </p>
              </div>
            )}
          </>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Collections Coming Soon</h3>
            <p className="text-textMuted">
              Premium meme packs will be available here
            </p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
            <p className="text-textMuted">
              Track your meme performance and engagement metrics
            </p>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <>
            {savedMemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memes
                  .filter((meme) => savedMemes.includes(meme.memeId))
                  .map((meme) => (
                    <MemeCard
                      key={meme.memeId}
                      meme={meme}
                      onSave={handleSaveMeme}
                      onPost={handlePostMeme}
                      isSaved={true}
                    />
                  ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No Saved Memes</h3>
                <p className="text-textMuted">
                  Start saving memes from the feed to see them here
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <PostModal
        meme={selectedMeme}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPost={handlePostSubmit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPurchase={handlePurchase}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="glass-card px-6 py-3 shadow-glow">
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
