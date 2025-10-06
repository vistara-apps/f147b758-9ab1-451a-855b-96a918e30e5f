'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MemeCard } from './components/MemeCard';
import { BottomNav } from './components/BottomNav';
import { useMemes } from '@/lib/hooks/useMemes';
import { useAuth } from './components/AuthProvider';
import { PaymentModal } from './components/PaymentModal';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('feed');
  const [timeWindow, setTimeWindow] = useState<'1h' | '3h' | '6h'>('1h');
  const [category, setCategory] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { user } = useAuth();
  const { memes, isLoading: memesLoading, error: memesError, refetch } = useMemes(timeWindow);

  // Filter memes based on selected filters
  const filteredMemes = memes.filter((meme) => {
    const matchesCategory = category === 'all' || meme.category === category;
    return matchesCategory;
  });

  // Show toast notification
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle save meme
  const handleSaveMeme = () => {
    showNotification('Meme saved successfully! 💾');
  };

  // Handle post meme
  const handlePostMeme = () => {
    showNotification('Meme posted successfully! 🚀');
  };

  // Handle credit purchase
  const handlePurchaseSuccess = () => {
    showNotification('Purchase completed! ⚡');
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

            {memesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="aspect-square bg-surface rounded-lg mb-3"></div>
                    <div className="h-4 bg-surface rounded mb-2"></div>
                    <div className="h-3 bg-surface rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : memesError ? (
              <div className="glass-card p-12 text-center">
                <p className="text-textMuted">
                  Failed to load memes. Please try again.
                </p>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 bg-primary rounded-lg text-white"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMemes.map((meme) => (
                    <MemeCard
                      key={meme.memeId}
                      meme={meme}
                      onSave={handleSaveMeme}
                      onPost={handlePostMeme}
                      fid={user?.fid || null}
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
          </>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Premium Collections</h3>
            <p className="text-textMuted">
              Unlock curated meme packs for your niche audience
            </p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-textMuted">
              Track your meme performance and engagement metrics
            </p>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Saved Memes</h3>
            <p className="text-textMuted">
              Your saved memes will appear here
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePurchaseSuccess}
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
