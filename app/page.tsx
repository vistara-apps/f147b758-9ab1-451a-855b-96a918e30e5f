'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MemeCard } from './components/MemeCard';
import { PostModal } from './components/PostModal';
import { PaymentModal } from './components/PaymentModal';
import { BottomNav } from './components/BottomNav';
import { mockMemes, mockUser } from '@/lib/mockData';
import type { Meme, TimeWindow, Category } from '@/lib/types';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');
  const [category, setCategory] = useState<Category>('all');
  const [credits, setCredits] = useState(mockUser.creditsRemaining);
  const [savedMemes, setSavedMemes] = useState<string[]>(mockUser.savedMemes);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filter memes based on selected filters
  const filteredMemes = mockMemes.filter((meme) => {
    const matchesTimeWindow = meme.trendingTimeWindow === timeWindow;
    const matchesCategory = category === 'all' || meme.category === category;
    return matchesTimeWindow && matchesCategory;
  });

  // Show toast notification
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle save meme
  const handleSaveMeme = (memeId: string) => {
    if (savedMemes.includes(memeId)) {
      setSavedMemes(savedMemes.filter((id) => id !== memeId));
      showNotification('Meme removed from saved');
    } else {
      setSavedMemes([...savedMemes, memeId]);
      showNotification('Meme saved successfully! 💾');
    }
  };

  // Handle post meme
  const handlePostMeme = (memeId: string) => {
    const meme = mockMemes.find((m) => m.memeId === memeId);
    if (meme) {
      setSelectedMeme(meme);
      setIsPostModalOpen(true);
    }
  };

  // Handle post submission
  const handlePostSubmit = (platform: string, caption: string) => {
    if (credits > 0) {
      setCredits(credits - 1);
      showNotification(`Posted to ${platform}! 🚀`);
    } else {
      showNotification('Not enough credits! Buy more to continue.');
      setIsPaymentModalOpen(true);
    }
  };

  // Handle credit purchase
  const handlePurchase = (type: 'credits' | 'pack', amount: number) => {
    if (type === 'credits') {
      setCredits(credits + 1000);
      showNotification('1000 credits added! ⚡');
    } else {
      showNotification('Premium pack unlocked! 📦');
    }
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <Header 
        credits={credits} 
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
                {mockMemes
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
